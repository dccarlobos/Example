let interstitialLoaded = false;

document.addEventListener('admob.interstitial.load', () => {
  interstitialLoaded = true;
});

// Fire when device ready
async function initAds() {
  try {
    if (!window.admob) {
      console.warn("AdMob not available");
      return;
    }

    await window.admob.start();

    loadInterstitial();
    loadNativeAd("#nativeAdIndex", "ca-app-pub-3940256099942544/2247696110");
    loadNativeAd("#nativeAdMenu", "ca-app-pub-3940256099942544/2247696110");
    loadNativeAd("#nativeAdQuiz", "ca-app-pub-3940256099942544/2247696110");

  } catch (err) {
    console.error("AdMob init error:", err);
  }
}

// Function to load native ad in a container
async function loadNativeAd(containerSelector, adUnitId) {
  try {
    const ad = await admob.native.load({
      id: { android: adUnitId },
      template: "medium", // adjusts height dynamically
      container: containerSelector
    });
    await admob.native.render(ad);
    console.log("Native ad loaded in", containerSelector);
  } catch (err) {
    console.error("Native ad failed:", err);
  }
}

// Interstitial preload
async function loadInterstitial() {
  try {
    await admob.interstitial.load({
      id: { android: "ca-app-pub-3940256099942544/1033173712" } // test interstitial
    });
    interstitialLoaded = true;
    console.log("Interstitial loaded");
  } catch (err) {
    console.error("Interstitial failed:", err);
  }
}

// Show interstitial safely
async function showInterstitial() {
  if (!interstitialLoaded) return;
  try {
    await admob.interstitial.show();
    interstitialLoaded = false;
    loadInterstitial(); // preload next
  } catch (err) {
    console.warn("Interstitial not ready");
  }
}

// Example: call after quiz finished or unlock
