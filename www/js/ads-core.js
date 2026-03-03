// ads-core.js

let admobReady = false;

document.addEventListener("deviceready", async () => {
  try {
    await admob.start();
    admobReady = true;
    console.log("✅ AdMob Initialized");
  } catch (err) {
    console.error("❌ AdMob Init Error:", err);
  }
});

function isAdmobReady() {
  return admobReady;
}