async function showInterstitialSafe() {
  try {
    if (!interstitialReady) {
      await preloadInterstitial();
      return;
    }

    await admob.interstitial.show();
    interstitialReady = false;
    await preloadInterstitial();

  } catch (e) {
    console.warn("Interstitial skipped");
  }
}

async function loadNativeSafe(containerSelector) {
  try {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const ad = await admob.native.load({
      id: { android: "ca-app-pub-3940256099942544/2247696110" },
      template: "medium",
      container: containerSelector
    });

    await admob.native.render(ad);

  } catch (e) {
    console.warn("Native skipped");
  }
}