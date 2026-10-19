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

async function runNavigationAudit() {
  console.log("=================================================");
  console.log(" ZUNO Shopkeeper Sidebar & Navigation Verification");
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
    // 1. Authenticate to obtain cookie
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

    const setCookie = loginRes.headers["set-cookie"];
    const cookieHeader = setCookie
      ? setCookie.map((c) => c.split(";")[0]).join("; ")
      : "";

    assert(Boolean(cookieHeader), "Dev mock session cookie successfully acquired");

    // 2. Audit all 9 sidebar routes
    const routes = [
      { path: "/dashboard", name: "Overview", expectedHeading: "Shop Dashboard" },
      { path: "/orders", name: "Orders", expectedHeading: "Orders Management" },
      { path: "/products", name: "Products", expectedHeading: "Product Catalog" },
      { path: "/inventory", name: "Inventory", expectedHeading: "Inventory Control" },
      { path: "/shop", name: "Shop Profile", expectedHeading: "Shop Profile" },
      { path: "/earnings", name: "Earnings", expectedHeading: "Earnings &amp; Settlements" },
      { path: "/analytics", name: "Analytics", expectedHeading: "Store Analytics" },
      { path: "/notifications", name: "Notifications", expectedHeading: "Store Notifications" },
      { path: "/settings", name: "Settings", expectedHeading: "Store Settings" },
    ];

    for (const route of routes) {
      // Test unauthenticated access is rejected
      const unauthRes = await makeRequest({
        hostname: "localhost",
        port: 3000,
        path: route.path,
        method: "GET",
      });

      assert(
        unauthRes.statusCode === 307 && unauthRes.headers.location?.includes("/login"),
        `Route ${route.path} strictly blocks unauthenticated access with 307 redirect`
      );

      // Test authenticated access returns 200
      const authRes = await makeRequest({
        hostname: "localhost",
        port: 3000,
        path: route.path,
        method: "GET",
        headers: {
          Cookie: cookieHeader,
        },
      });

      assert(
        authRes.statusCode === 200,
        `Route ${route.path} (${route.name}) returns HTTP 200 for approved shopkeeper`
      );

      const html = authRes.body;

      // Verify official logo asset is referenced
      assert(
        html.includes("/brandlogo.png"),
        `Route ${route.path} includes official ZUNO logo asset (/brandlogo.png)`
      );

      // Verify high-contrast logo container
      assert(
        html.includes("bg-white rounded-2xl p-3 shadow-md border border-white/20"),
        `Route ${route.path} embeds logo in high-contrast card for optimal readability`
      );

      // Verify layout scrolling classes (independent scrolling shell)
      assert(
        html.includes("h-screen w-screen overflow-hidden") &&
          html.includes("overflow-y-auto"),
        `Route ${route.path} uses viewport-height shell with independent scrolling containers`
      );

      // Verify fixed header is present (preventing clipping)
      assert(
        html.includes("h-16 flex-shrink-0 bg-white border-b border-gray-200"),
        `Route ${route.path} includes stable top header preventing title clipping`
      );

      // Verify active link state for this route
      assert(
        html.includes(`href="${route.path}"`),
        `Route ${route.path} contains Next.js navigation link`
      );
    }

    console.log(`\nNavigation Audit Summary: ${passed} / ${total} tests passed.`);
    if (passed === total) {
      console.log("All sidebar routes and layout tests passed successfully!");
      process.exit(0);
    } else {
      console.error(`${total - passed} tests failed!`);
      process.exit(1);
    }
  } catch (err) {
    console.error("Test execution error:", err);
    process.exit(1);
  }
}

runNavigationAudit();
