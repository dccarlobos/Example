// ads-ui.js

const nativeMap = {
  "index": "#nativeAdIndex",
  "quiz-menu": "#nativeAdMenu",
  "quiz-page": "#nativeAdQuiz"
};

async function loadNativeSafe(selector) {
  if (!isAdmobReady()) return;

  try {
    await admob.native.load({
      id: {
        android: "ca-app-pub-3940256099942544/2247696110"
      }
    });

    await admob.native.show({
      container: selector
    });

    console.log("✅ Native shown in", selector);

  } catch (e) {
    console.error("Native error:", e);
  }
}

async function showInterstitialSafe() {
  if (!isAdmobReady()) return;

  try {
    await admob.interstitial.load({
      id: {
        android: "ca-app-pub-3940256099942544/1033173712"
      }
    });

    await admob.interstitial.show();

    console.log("✅ Interstitial shown");

  } catch (e) {
    console.error("Interstitial error:", e);
  }
}

function loadNativeForPageSafe(pageId) {
    const selector = nativeMap[pageId];
    if (!selector) return;

    const tryLoad = () => {
        const container = document.querySelector(selector);
        if (!container) return;

        if (container.offsetParent === null) {
            setTimeout(tryLoad, 100);
            return;
        }

        loadNativeSafe(selector);
    };

    tryLoad();
}