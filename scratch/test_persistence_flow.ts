import http from 'http';

async function main() {
  console.log("==================================================");
  console.log("   PSIP PERSISTENCE & DYNAMIC COMPLAINT FLOW TEST ");
  console.log("==================================================");

  // 1. Health check
  console.log("\n1. Testing GET /api/health...");
  const health = await makeRequest("GET", "/api/health");
  console.log("   Status:", health.status);
  console.log("   Response:", JSON.stringify(health.data, null, 2));

  if (health.status !== 200) {
    throw new Error("Health check failed!");
  }

  // 2. Submit citizen complaint
  console.log("\n2. Submitting citizen complaint via POST /api/complaints...");
  const submitRes = await makeRequest("POST", "/api/complaints", {
    description: "Water supply pipeline leak reported near Renigunta Main Road causing severe flooding.",
    mandal: "Renigunta",
    village: "Renigunta Main",
    department: "Municipal Administration",
    mobileNumber: "9876543210",
    consentGiven: true,
    notificationPreference: "sms",
    isAnonymous: false,
  });

  console.log("   Status:", submitRes.status);
  console.log("   Response:", JSON.stringify(submitRes.data, null, 2));

  const complaintId = submitRes.data.id;
  const trackingToken = submitRes.data.trackingToken;

  if (!complaintId || !trackingToken) {
    throw new Error("Complaint ID or Tracking Token missing from submission!");
  }
  console.log(`   ✓ Complaint ID Generated: ${complaintId}`);
  console.log(`   ✓ Tracking Token Generated: ${trackingToken}`);

  // 3. Track initial status as citizen
  console.log(`\n3. Citizen tracking complaint via GET /api/track?id=${complaintId}&token=${trackingToken}...`);
  const trackInitial = await makeRequest("GET", `/api/track?id=${complaintId}&token=${trackingToken}`);
  console.log("   Status:", trackInitial.status);
  console.log("   Current Status:", trackInitial.data.status);
  console.log("   Public Projection:", JSON.stringify(trackInitial.data, null, 2));

  // 4. Staff login
  console.log("\n4. Staff logging in via POST /api/auth/login...");
  const loginRes = await makeRequest("POST", "/api/auth/login", {
    username: "mla_staff",
    password: "dev-mla-2026",
  });
  console.log("   Status:", loginRes.status);
  console.log("   Session Cookie:", loginRes.cookie);

  const cookieHeader = loginRes.cookie;

  // 5. Staff fetch complaint queue
  console.log("\n5. Staff fetching live complaint queue via GET /api/complaints?source=live...");
  const listRes = await makeRequest("GET", "/api/complaints?source=live", null, cookieHeader);
  console.log("   Status:", listRes.status);
  console.log("   Live Complaints Count:", listRes.data.total);
  const foundInQueue = listRes.data.complaints.find((c: any) => c.id === complaintId);
  console.log("   Found submitted complaint in staff queue:", Boolean(foundInQueue));

  // 6. Staff update status to "Under Review"
  console.log(`\n6. Staff updating status of ${complaintId} to "Under Review"...`);
  const update1 = await makeRequest("PATCH", `/api/complaints/${complaintId}/status`, {
    status: "Under Review",
    internalNote: "Assigned reviewer verifying flooded area report.",
  }, cookieHeader);
  console.log("   Status:", update1.status);
  console.log("   Response:", JSON.stringify(update1.data, null, 2));

  // 7. Staff update status to "Assigned"
  console.log(`\n7. Staff updating status of ${complaintId} to "Assigned"...`);
  const update2 = await makeRequest("PATCH", `/api/complaints/${complaintId}/status`, {
    status: "Assigned",
    assignedDepartment: "Municipal Administration",
    assignedTo: "MRO_Renigunta",
    internalNote: "Dispatched maintenance crew to site.",
  }, cookieHeader);
  console.log("   Status:", update2.status);
  console.log("   Response:", JSON.stringify(update2.data, null, 2));

  // 8. Staff update status to "Resolved"
  console.log(`\n8. Staff updating status of ${complaintId} to "Resolved"...`);
  const update3 = await makeRequest("PATCH", `/api/complaints/${complaintId}/status`, {
    status: "Resolved",
    internalNote: "Pipeline repaired and water supply restored.",
  }, cookieHeader);
  console.log("   Status:", update3.status);
  console.log("   Response:", JSON.stringify(update3.data, null, 2));

  // 9. Citizen tracks updated status
  console.log(`\n9. Citizen tracking updated status via GET /api/track?id=${complaintId}&token=${trackingToken}...`);
  const trackFinal = await makeRequest("GET", `/api/track?id=${complaintId}&token=${trackingToken}`);
  console.log("   Status:", trackFinal.status);
  console.log("   Final Status:", trackFinal.data.status);
  console.log("   Status History Timeline:", JSON.stringify(trackFinal.data.statusHistory, null, 2));

  if (trackFinal.data.status !== "Resolved") {
    throw new Error("Final status does not match expected 'Resolved' status!");
  }

  console.log("\n==================================================");
  console.log("   ✓ ALL E2E PERSISTENCE TESTS PASSED CLEANLY!");
  console.log("==================================================");
}

function makeRequest(method: string, pathUrl: string, bodyData: any = null, cookie: string = ""): Promise<any> {
  return new Promise((resolve, reject) => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (cookie) {
      headers["Cookie"] = cookie;
    }

    const options: http.RequestOptions = {
      hostname: "localhost",
      port: 3000,
      path: pathUrl,
      method: method,
      headers,
    };

    const req = http.request(options, (res) => {
      let data = "";
      const setCookie = res.headers["set-cookie"] ? res.headers["set-cookie"][0] : "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed, cookie: setCookie });
        } catch {
          resolve({ status: res.statusCode, data, cookie: setCookie });
        }
      });
    });

    req.on("error", (e) => reject(e));
    if (bodyData) {
      req.write(JSON.stringify(bodyData));
    }
    req.end();
  });
}

main().catch((e) => {
  console.error("Test error:", e);
  process.exit(1);
});
