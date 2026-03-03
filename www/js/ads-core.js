
let adsReady = false;
let interstitialReady = false;

document.addEventListener("deviceready", async () => {
  if (!window.admob) {
    alert("AdMob not available");
    return;
  }

  try {
    if (!adsReady) {
      await admob.start();
      adsReady = true;
      alert("AdMob Started");
    }

    await preloadInterstitial();

  } catch (e) {
    alert("AdMob Start Failed");
  }
});

async function preloadInterstitial() {
  try {
    await admob.interstitial.load({
      id: { android: "ca-app-pub-3940256099942544/1033173712" }
    });
    interstitialReady = true;
  } catch (e) {
    interstitialReady = false;
  }
}