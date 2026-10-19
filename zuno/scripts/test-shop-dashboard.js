/**
 * ZUNO Shopkeeper Dashboard Real Database Verification Test
 *
 * Verifies:
 * 1. Unauthenticated requests to /dashboard are redirected to /login.
 * 2. Authenticated requests render real shop name and profile from database.
 * 3. Total elimination of mock/sample datasets (no fake revenue ₹14,250, no Ananya Sharma, no Rahul Prasad, no Fresh Farm Tomatoes).
 * 4. Honest empty states when database has 0 records (orders, catalog, delivery partners).
 * 5. Honest schema limitations reporting (rating displays N/A ★; Reviews not in schema).
 * 6. Top orange dev mock border is removed as requested.
 */

const http = require("http");

function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body,
        });
      });
    });
    req.on("error", reject);
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function runDashboardAudit() {
  console.log("=================================================");
  console.log(" ZUNO Shopkeeper Dashboard Real Data Verification");
  console.log("=================================================\n");

  let passed = 0;
  let total = 0;

  function assert(condition, message, failureDetail = "") {
    total++;
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message} - ${failureDetail}`);
    }
  }

  try {
    // 1. Unauthenticated request to /dashboard
    const unauthRes = await makeRequest({
      hostname: "localhost",
      port: 3000,
      path: "/dashboard",
      method: "GET",
    });

    assert(
      unauthRes.statusCode === 307 &&
        unauthRes.headers.location?.includes("/login"),
      "Unauthenticated request to /dashboard is blocked with 307 redirect to /login"
    );

    // 2. Perform dev-mock-login for approved shop
    const loginPayload = JSON.stringify({ phone: "8887602317" });
    const loginRes = await makeRequest(
      {
        hostname: "localhost",
        port: 3000,
        path: "/api/auth/dev-mock-login",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(loginPayload),
        },
      },
      loginPayload
    );

    assert(
      loginRes.statusCode === 200,
      "Dev mock login endpoint responds with HTTP 200 for approved phone 8887602317"
    );

    const loginData = JSON.parse(loginRes.body);
    assert(
      loginData.shopName === "abc123" && loginData.isApproved === true,
      "Resolved shop matches real database record (shopName: 'abc123', isApproved: true)"
    );

    const setCookie = loginRes.headers["set-cookie"];
    const cookieHeader = setCookie
      ? setCookie.map((c) => c.split(";")[0]).join("; ")
      : "";

    // 3. Authenticated request to /dashboard
    const dashRes = await makeRequest({
      hostname: "localhost",
      port: 3000,
      path: "/dashboard",
      method: "GET",
      headers: {
        Cookie: cookieHeader,
      },
    });

    assert(
      dashRes.statusCode === 200,
      "Authenticated shopkeeper successfully accesses /dashboard with HTTP 200"
    );

    const html = dashRes.body;

    // 4. Audit Mock Data Elimination
    assert(
      !html.includes("14,250"),
      "Mock revenue '₹14,250' is NOT present in dashboard"
    );
    assert(
      !html.includes("Ananya Sharma"),
      "Mock customer 'Ananya Sharma' is NOT present in dashboard"
    );
    assert(
      !html.includes("Vikram Mehta"),
      "Mock customer 'Vikram Mehta' is NOT present in dashboard"
    );
    assert(
      !html.includes("Rahul Prasad"),
      "Mock delivery rider 'Rahul Prasad' is NOT present in dashboard"
    );
    assert(
      !html.includes("Fresh Farm Tomatoes"),
      "Mock product 'Fresh Farm Tomatoes' is NOT present in dashboard"
    );
    assert(
      !html.includes("Organic Spinach Bunch"),
      "Mock product 'Organic Spinach Bunch' is NOT present in dashboard"
    );

    // 5. Audit Real Database Data and Honest Empty States
    assert(
      html.includes("abc123"),
      "Real database shop name 'abc123' is rendered in dashboard header and greeting"
    );
    assert(
      html.includes("No customer orders received yet"),
      "Honest empty orders state displayed when database has 0 orders"
    );
    assert(
      html.includes("No products listed in your shop catalog yet"),
      "Honest empty catalog state displayed when database has 0 shop products"
    );
    assert(
      html.includes("No delivery partner assigned yet"),
      "Honest empty delivery partner state displayed when no deliveries are assigned"
    );
    assert(
      html.includes("Reviews not in schema") || html.includes("N/A ★"),
      "Honest reporting of schema limitation for store rating (no reviews table in schema)"
    );

    // 6. Audit removal of top orange banner
    assert(
      !html.includes("DEVELOPMENT MOCK AUTH ACTIVE") &&
        !html.includes("border-orange-500"),
      "Top orange dev banner/border is completely removed as requested"
    );

    console.log(`\n=================================================`);
    console.log(` Results: ${passed}/${total} dashboard audit tests passed.`);
    console.log(`=================================================`);

    if (passed !== total) {
      process.exit(1);
    }
  } catch (err) {
    console.error("Test execution error:", err);
    process.exit(1);
  }
}

runDashboardAudit();
