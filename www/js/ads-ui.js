   // ads-ui.js
let nativeLoading = false;
let currentNativeAd = null; // Track active ad to destroy when switching pages

// Updated map with per-page ad unit IDs (replace with your actual IDs)
const nativeMap = {
  "index": {
    selector: "#nativeAdIndex",
    adUnitId: {
      android: "ca-app-pub-3940256099942544/2247696110", // Test ID
    }
  },
  "quiz-menu": {
    selector: "#nativeAdMenu",
    adUnitId: {
      android: "ca-app-pub-3940256099942544/2247696110", // Test ID
    }
  },
  "quiz-page": {
    selector: "#nativeAdQuiz",
    adUnitId: {
      android: "ca-app-pub-3940256099942544/2247696110", // Test ID
    }
  }
};

// Helper to clean up existing native ad
function destroyCurrentNativeAd() {
  if (currentNativeAd) {
    try {
      admob.native.destroy(currentNativeAd);
    } catch (e) {
      console.warn("Destroy native failed:", e);
    }
    currentNativeAd = null;
  }
}

async function loadNativeSafe(pageConfig) {
  if (!isAdmobReady() || nativeLoading) return;

  nativeLoading = true;
  destroyCurrentNativeAd();

  try {

    currentNativeAd = await admob.native.load({
      id: pageConfig.adUnitId,
      options: {
      
        mediaAspectRatio: "any"
      }
    });

    const container = document.querySelector(pageConfig.selector);
    if (!container) throw new Error("Native container not found");

    await admob.native.show(currentNativeAd, {
      container
    });

    console.log(`Native ad loaded for ${pageConfig.selector}`);

  } catch (e) {

    console.error("Native ad error:", e);

    const container = document.querySelector(pageConfig.selector);
    if (container) container.style.display = "none";

  } finally {
    nativeLoading = false;
  }
}

async function showInterstitialSafe() {
  if (!isAdmobReady()) return;

  try {
    await admob.interstitial.load({
      id: {
        android: "ca-app-pub-3940256099942544/1033173712",
        ios: "ca-app-pub-3940256099942544/4411468910"
      }
    });
    await admob.interstitial.show();
    console.log("✅ Interstitial shown");
  } catch (e) {
    console.error("Interstitial error:", e);
  }
}

function loadNativeForPageSafe(pageId) {
  const pageConfig = nativeMap[pageId];
  if (!pageConfig) return;

  const tryLoad = () => {
    const container = document.querySelector(pageConfig.selector);
    if (!container) return;

    // Wait until container is visible in DOM
    if (container.offsetParent === null) {
      setTimeout(tryLoad, 100);
      return;
    }

    loadNativeSafe(pageConfig);
  };

  tryLoad();
}

// Optional: Call this when switching pages to clean up ads
function cleanupNativeAdOnPageChange() {
  destroyCurrentNativeAd();
  nativeLoading = false;
}
