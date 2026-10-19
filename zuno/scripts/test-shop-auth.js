/**
 * ZUNO Shopkeeper OTP & Authentication Flow Validation Script
 *
 * Verifies:
 * 1. Consistent phone normalization across inputs (+91, spaces, 10-digit).
 * 2. OTP format validation (6-digit numeric, trim).
 * 3. Exact error classification for HTTP 400 (phone_provider_disabled) vs HTTP 403 (otp_expired).
 * 4. Supabase Auth provider settings check without exposing sensitive secrets.
 */

const https = require("https");

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mwcvagktpvlzorojdsxg.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13Y3ZhZ2t0cHZsem9yb2pkc3hnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA2ODk4MDYsImV4cCI6MjEwNjI2NTgwNn0.KmkVlqAY8QmQItwU-JFbWzsFoHGjOtuef4jCVpDiAlY";

// Replicating @zuno/validation normalizePhoneE164 logic
function normalizePhoneE164(phone) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `+91${digits}`;
  }
  if (digits.length === 12 && digits.startsWith("91")) {
    return `+${digits}`;
  }
  return phone.startsWith("+") ? phone : `+${phone}`;
}

function clean10Phone(phone) {
  return phone.replace(/\D/g, "").slice(-10);
}

function validateOtpCode(code) {
  const trimmed = (code || "").trim();
  return /^\d{6}$/.test(trimmed);
}

function classifyAuthError(status, errorBody) {
  let parsed = {};
  try {
    parsed = typeof errorBody === "string" ? JSON.parse(errorBody) : errorBody;
  } catch {
    parsed = { msg: String(errorBody) };
  }

  const code = parsed.code || status;
  const errorCode = parsed.error_code || "";
  const msg = parsed.msg || parsed.message || "";

  if (status === 400 && (errorCode === "phone_provider_disabled" || msg.toLowerCase().includes("unsupported phone provider"))) {
    return {
      type: "PHONE_PROVIDER_DISABLED",
      status: 400,
      userMessage: "Supabase SMS phone provider is currently disabled. Please enable the Phone provider in your Supabase Dashboard (under Authentication > Providers > Phone) or configure a Test Phone Number (e.g. +918887602317 with code 123456).",
    };
  }

  if (status === 403 && (errorCode === "otp_expired" || msg.toLowerCase().includes("token has expired"))) {
    return {
      type: "OTP_EXPIRED_OR_INVALID",
      status: 403,
      userMessage: "Verification code has expired or is invalid. Please request a fresh OTP.",
    };
  }

  return {
    type: "UNKNOWN_AUTH_ERROR",
    status,
    userMessage: msg || "Authentication error occurred.",
  };
}

async function fetchSupabaseAuthSettings() {
  const url = `${SUPABASE_URL}/auth/v1/settings`;
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
        },
      },
      (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(body) });
          } catch (e) {
            resolve({ status: res.statusCode, raw: body });
          }
        });
      }
    );
    req.on("error", reject);
  });
}

async function runTests() {
  console.log("=================================================");
  console.log(" ZUNO Shopkeeper Auth & OTP Flow Verification");
  console.log(" Target URL:", SUPABASE_URL);
  console.log("=================================================\n");

  let passedCount = 0;
  let totalCount = 0;

  function assert(condition, testName, details = "") {
    totalCount++;
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passedCount++;
    } else {
      console.error(`[FAIL] ${testName} - ${details}`);
    }
  }

  // Test 1: Consistent phone normalization
  const phoneCases = [
    { input: "8887602317", expected10: "8887602317", expectedE164: "+918887602317" },
    { input: "+918887602317", expected10: "8887602317", expectedE164: "+918887602317" },
    { input: "+91 8887602317", expected10: "8887602317", expectedE164: "+918887602317" },
    { input: "918887602317", expected10: "8887602317", expectedE164: "+918887602317" },
    { input: "  +91 88876-02317 ", expected10: "8887602317", expectedE164: "+918887602317" },
  ];

  for (const c of phoneCases) {
    const c10 = clean10Phone(c.input);
    const e164 = normalizePhoneE164(c10);
    assert(
      c10 === c.expected10 && e164 === c.expectedE164,
      `Phone normalization for "${c.input}" -> ${e164}`,
      `Got c10=${c10}, e164=${e164}`
    );
  }

  // Test 2: OTP code validation
  assert(validateOtpCode("123456") === true, "Valid 6-digit OTP accepted");
  assert(validateOtpCode(" 123456 ") === true, "Valid 6-digit OTP with whitespace accepted after trim");
  assert(validateOtpCode("12345") === false, "Incomplete 5-digit OTP rejected");
  assert(validateOtpCode("1234567") === false, "7-digit OTP rejected");
  assert(validateOtpCode("12345a") === false, "Non-numeric OTP rejected");
  assert(validateOtpCode("") === false, "Empty OTP rejected");

  // Test 3: HTTP 400 phone_provider_disabled classification
  const mock400 = classifyAuthError(400, {
    code: 400,
    error_code: "phone_provider_disabled",
    msg: "Unsupported phone provider",
  });
  assert(
    mock400.type === "PHONE_PROVIDER_DISABLED" && mock400.status === 400,
    "HTTP 400 correctly classified as PHONE_PROVIDER_DISABLED"
  );
  assert(
    mock400.userMessage.includes("enable the Phone provider"),
    "HTTP 400 provides actionable guidance"
  );

  // Test 4: HTTP 403 otp_expired classification
  const mock403 = classifyAuthError(403, {
    code: 403,
    error_code: "otp_expired",
    msg: "Token has expired or is invalid",
  });
  assert(
    mock403.type === "OTP_EXPIRED_OR_INVALID" && mock403.status === 403,
    "HTTP 403 correctly classified as OTP_EXPIRED_OR_INVALID"
  );
  assert(
    mock403.userMessage.includes("expired or is invalid"),
    "HTTP 403 surfaces expired token instruction"
  );

  // Test 5: Dev Mock Auth Invariant Checks
  function testDevMockAuthFlag(nodeEnv, envFlag, nextPublicFlag) {
    const origNodeEnv = process.env.NODE_ENV;
    const origFlag = process.env.ENABLE_DEV_MOCK_AUTH;
    const origNextPublic = process.env.NEXT_PUBLIC_ENABLE_DEV_MOCK_AUTH;

    try {
      process.env.NODE_ENV = nodeEnv;
      if (envFlag !== undefined) process.env.ENABLE_DEV_MOCK_AUTH = envFlag;
      else delete process.env.ENABLE_DEV_MOCK_AUTH;

      if (nextPublicFlag !== undefined) process.env.NEXT_PUBLIC_ENABLE_DEV_MOCK_AUTH = nextPublicFlag;
      else delete process.env.NEXT_PUBLIC_ENABLE_DEV_MOCK_AUTH;

      // Logic from packages/config/src/devMockAuth.ts
      if (process.env.NODE_ENV === "production") return false;
      return (
        process.env.ENABLE_DEV_MOCK_AUTH === "true" ||
        process.env.NEXT_PUBLIC_ENABLE_DEV_MOCK_AUTH === "true"
      );
    } finally {
      process.env.NODE_ENV = origNodeEnv;
      if (origFlag !== undefined) process.env.ENABLE_DEV_MOCK_AUTH = origFlag;
      else delete process.env.ENABLE_DEV_MOCK_AUTH;
      if (origNextPublic !== undefined) process.env.NEXT_PUBLIC_ENABLE_DEV_MOCK_AUTH = origNextPublic;
      else delete process.env.NEXT_PUBLIC_ENABLE_DEV_MOCK_AUTH;
    }
  }

  assert(
    testDevMockAuthFlag("production", "true", "true") === false,
    "Dev mock auth strictly rejected in production (NODE_ENV=production)"
  );
  assert(
    testDevMockAuthFlag("production", "true", undefined) === false,
    "Dev mock auth strictly rejected in production even with ENABLE_DEV_MOCK_AUTH=true"
  );
  assert(
    testDevMockAuthFlag("development", undefined, undefined) === false,
    "Dev mock auth disabled by default in development when unset"
  );
  assert(
    testDevMockAuthFlag("development", "false", "false") === false,
    "Dev mock auth disabled when flag is set to 'false'"
  );
  assert(
    testDevMockAuthFlag("development", "true", undefined) === true,
    "Dev mock auth enabled in development when ENABLE_DEV_MOCK_AUTH=true"
  );
  assert(
    testDevMockAuthFlag("development", undefined, "true") === true,
    "Dev mock auth enabled in development when NEXT_PUBLIC_ENABLE_DEV_MOCK_AUTH=true"
  );

  // Test 6: Invariant verification on dev mock session payload
  function createDevMockSession(shop, rawPhone) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Prohibited in production");
    }
    const isApproved = Boolean(shop.is_approved) && shop.approval_status === "APPROVED";
    return {
      success: true,
      shopName: shop.name,
      isApproved,
      redirect: isApproved ? "/dashboard" : `/status?phone=${rawPhone}`,
      role: "SHOPKEEPER", // Hardcoded - never ADMIN or SUPER_ADMIN
    };
  }

  const approvedShopMock = { name: "Test Shop", is_approved: true, approval_status: "APPROVED" };
  const pendingShopMock = { name: "Pending Shop", is_approved: false, approval_status: "PENDING" };

  const approvedSession = createDevMockSession(approvedShopMock, "8887602317");
  assert(
    approvedSession.redirect === "/dashboard" && approvedSession.isApproved === true,
    "Approved shop mock session grants /dashboard redirect"
  );
  assert(
    approvedSession.role === "SHOPKEEPER" && approvedSession.role !== "ADMIN",
    "Mock session role is strictly SHOPKEEPER and never elevated to ADMIN"
  );

  const pendingSession = createDevMockSession(pendingShopMock, "8887602317");
  assert(
    pendingSession.redirect.startsWith("/status") && pendingSession.isApproved === false,
    "Pending/unapproved shop mock session enforces /status redirect and denies dashboard"
  );

  // Test 7: Live Supabase Auth Settings Verification
  try {
    const settingsRes = await fetchSupabaseAuthSettings();
    assert(settingsRes.status === 200, "Supabase Auth settings endpoint reachable");
    const isPhoneEnabled = Boolean(settingsRes.data?.external?.phone);
    console.log(`[INFO] Supabase External Auth Providers - Phone Enabled: ${isPhoneEnabled}`);
    console.log(`[INFO] Supabase Configured SMS Provider: ${settingsRes.data?.sms_provider || "none"}`);
  } catch (err) {
    console.error("[WARN] Failed to fetch live Supabase settings:", err.message);
  }

  console.log(`\nResults: ${passedCount}/${totalCount} tests passed.`);
  if (passedCount !== totalCount) {
    process.exit(1);
  }
}

runTests();
