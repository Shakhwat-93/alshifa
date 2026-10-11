const BASE_URL = "http://localhost:3000";

async function runTests() {
  console.log("==================================================");
  console.log("🚀 STARTING E2E CMS DATABASE & API VERIFICATION");
  console.log("==================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  // --- 1. Content API check ---
  console.log("--- 1. Testing GET /api/content ---");
  const contentRes = await fetch(`${BASE_URL}/api/content`);
  assert(contentRes.status === 200, "Content API responds with 200 OK");
  const contentData = await contentRes.json();
  assert(contentData.success === true, "Content API success flag is true");
  assert(Array.isArray(contentData.sections_order), "sections_order is an array");
  assert(typeof contentData.sections_data === "object", "sections_data is an object");
  assert(contentData.sections_data.hero?.title !== undefined, "Hero section has title");

  // --- 2. Admin Landing GET check ---
  console.log("\n--- 2. Testing GET /api/admin/landing ---");
  const adminLandingRes = await fetch(`${BASE_URL}/api/admin/landing`);
  assert(adminLandingRes.status === 200, "Admin Landing API responds with 200 OK");
  const adminLandingData = await adminLandingRes.json();
  assert(adminLandingData.success === true, "Admin Landing returns success");
  assert(adminLandingData.landing?.id !== undefined, "Landing row has ID");

  // --- 3. Test Draft vs Publish Workflow (Test E) ---
  console.log("\n--- 3. Testing Draft vs Publish workflow ---");
  const originalHeroTitle = adminLandingData.landing.sections_data.hero.title;
  const draftTitle = "টেস্ট ড্রাফট শিরোনাম " + Date.now();

  // Save Draft
  const modifiedSectionsData = JSON.parse(JSON.stringify(adminLandingData.landing.sections_data));
  modifiedSectionsData.hero.title = draftTitle;

  const draftRes = await fetch(`${BASE_URL}/api/admin/landing`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "save_draft",
      sections_data: modifiedSectionsData,
      sections_order: adminLandingData.landing.sections_order,
    }),
  });
  const draftResult = await draftRes.json();
  assert(draftResult.success === true, "Save Draft API returns success");

  // Public visitor should NOT see the draft title
  const publicVisitorRes = await fetch(`${BASE_URL}/api/content?t=${Date.now()}`);
  const publicVisitorData = await publicVisitorRes.json();
  assert(
    publicVisitorData.sections_data.hero.title === originalHeroTitle,
    "Public visitor sees original published title, NOT the draft"
  );

  // Preview visitor SHOULD see the draft title
  const previewVisitorRes = await fetch(`${BASE_URL}/api/content?preview=true&t=${Date.now()}`);
  const previewVisitorData = await previewVisitorRes.json();
  assert(
    previewVisitorData.sections_data.hero.title === draftTitle,
    "Preview visitor sees draft title in preview mode"
  );

  // Publish the updated title (Test A)
  console.log("\n--- 4. Testing Publish Live & Database Persistence (Test A) ---");
  const publishedTitle = "শিফা পেইন কেয়ার অয়েল (লাইভ পাবলিশড)";
  modifiedSectionsData.hero.title = publishedTitle;

  const publishRes = await fetch(`${BASE_URL}/api/admin/landing`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "publish",
      sections_data: modifiedSectionsData,
      sections_order: adminLandingData.landing.sections_order,
      seo_title: "শিফা পেইন কেয়ার অয়েল | Al-Shifa Care",
      seo_description: "প্রাকৃতিক উপাদানে তৈরি শিফা পেইন কেয়ার অয়েল।",
    }),
  });
  const publishResult = await publishRes.json();
  assert(publishResult.success === true, "Publish API returns success");

  // Verify public visitor sees published content immediately
  const liveRes = await fetch(`${BASE_URL}/api/content?t=${Date.now()}`);
  const liveData = await liveRes.json();
  assert(
    liveData.sections_data.hero.title === publishedTitle,
    "Public visitor now sees live published title"
  );

  // --- 5. Media Upload & Validation (Test B, G) ---
  console.log("\n--- 5. Testing Media Upload & Security Validation ---");
  // Test invalid upload (empty file) -> rejected
  const emptyFormRes = await fetch(`${BASE_URL}/api/admin/media/upload`, {
    method: "POST",
    body: new FormData(),
  });
  assert(emptyFormRes.status === 400, "Empty upload rejected with 400 Bad Request");

  // Test valid upload using a simulated WebP image binary
  const dummySvg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="#0E5A2E" width="100" height="100"/><text fill="#fff" x="20" y="50">CMS</text></svg>`;
  const blob = new Blob([dummySvg], { type: "image/svg+xml" });
  const uploadForm = new FormData();
  uploadForm.append("file", blob, "test_badge.svg");
  uploadForm.append("section_key", "hero");
  uploadForm.append("alt_text", "টেস্ট ব্যাজ ইমেজ");

  const uploadRes = await fetch(`${BASE_URL}/api/admin/media/upload`, {
    method: "POST",
    body: uploadForm,
  });
  assert(uploadRes.status === 200, "Image upload responds with 200 OK");
  const uploadData = await uploadRes.json();
  assert(uploadData.success === true, "Upload returned success: true");
  assert(uploadData.url && uploadData.url.startsWith("http"), "Upload returned valid public URL");

  // Verify Media Library lists the uploaded asset
  const mediaListRes = await fetch(`${BASE_URL}/api/admin/media?limit=10`);
  const mediaListData = await mediaListRes.json();
  assert(mediaListData.success === true, "Media library list endpoint returns success");
  assert(mediaListData.assets.length > 0, "Media library contains uploaded assets");

  // --- 6. Section Ordering & Visibility (Test D) ---
  console.log("\n--- 6. Testing Section Reordering & Visibility Toggles ---");
  const reversedOrder = [...adminLandingData.landing.sections_order].reverse();
  const hideGalleryData = JSON.parse(JSON.stringify(modifiedSectionsData));
  hideGalleryData.gallery.visible = false;

  const toggleRes = await fetch(`${BASE_URL}/api/admin/landing`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "publish",
      sections_order: reversedOrder,
      sections_data: hideGalleryData,
    }),
  });
  assert(toggleRes.status === 200, "Visibility & order PATCH responds with 200");

  const verifyOrderRes = await fetch(`${BASE_URL}/api/content?t=${Date.now()}`);
  const verifyOrderData = await verifyOrderRes.json();
  assert(
    verifyOrderData.sections_order[0] === reversedOrder[0],
    "First section matches new reversed order"
  );
  assert(
    verifyOrderData.sections_data.gallery.visible === false,
    "Gallery section is hidden (visible: false) in database"
  );

  // Restore normal default state
  console.log("\n--- 7. Restoring Canonical Section State & Order ---");
  hideGalleryData.gallery.visible = true;
  hideGalleryData.hero.title = "শিফা পেইন কেয়ার অয়েল";
  const defaultOrder = [
    "announcement",
    "hero",
    "gallery",
    "offer_banner",
    "badges",
    "intro",
    "ingredients",
    "usage",
    "certification",
    "mid_cta",
    "reviews",
    "timer",
    "final_cta",
    "checkout",
  ];

  await fetch(`${BASE_URL}/api/admin/landing`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "publish",
      sections_order: defaultOrder,
      sections_data: hideGalleryData,
    }),
  });

  // --- 8. Order Placement & Business Logic Regression Check (Test I) ---
  console.log("\n--- 8. Testing Order API Integration (Regression Test) ---");
  const orderRes = await fetch(`${BASE_URL}/api/order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "টেস্ট কাস্টমার",
      phone: "01712345678",
      address: "টেস্ট ঠিকানা, ধানমন্ডি, ঢাকা",
      district: "বাংলাদেশ (ফ্রি ডেলিভারি)",
      quantity: 1,
      unitPrice: 950,
      deliveryCharge: 0,
      variant: "১ বোতল",
    }),
  });
  assert(orderRes.status === 200, "Order submission responds with 200");
  const orderData = await orderRes.json();
  assert(orderData.success === true, "Order created successfully");
  assert(orderData.order?.order_id !== undefined, "Order has generated order_id");

  // Summary
  console.log("\n==================================================");
  console.log(`🏁 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error("Test execution error:", e);
  process.exit(1);
});
