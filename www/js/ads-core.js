// ads-core.js

let admobReady = false;

document.addEventListener("deviceready", async () => {
  if (!window.admob) return alert("AdMob not available");

  try {
    await admob.start(); // start AdMob
    admobReady = true;
    console.log("AdMob started");

    // 🔹 Delay ads until splash ends
    setTimeout(() => {
      // Load native ad for initial page
      loadNativeForPageSafe("index");

      // Preload interstitial ad
      preloadInterstitial();
    }, 2000); // match splash duration

  } catch (err) {
    console.error("AdMob start failed:", err);
  }
});

function isAdmobReady() {
  return admobReady;
}