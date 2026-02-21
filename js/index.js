// ================================
// SPA Navigation + Button Handling
// ================================

// --- 1️⃣ Go to page function ---
const goToPage = (pageId) => {
    const current = document.querySelector('.page.active');
    const next = document.getElementById(pageId);

    if (!next) {
        console.warn(`Page with ID "${pageId}" not found.`);
        return;
    }

    if (current === next) return; // same page, no action

    // Optional: exit animation for current page
    if (current) {
        current.classList.remove('active');
        current.classList.add('exit');
    }

    // Show target page
    next.classList.remove('exit');
    next.classList.add('active');

    window.scrollTo(0, 0); // important to reset scroll
};

// --- 2️⃣ Quiz button handler ---
const startQuiz = (quizId) => {
    console.log("Starting quiz:", quizId);
    // Example: call your existing QuizEngine function
    if (typeof QuizEngine !== "undefined") {
        QuizEngine.startQuiz(quizId); // correct method
        goToPage('quiz-page');
    } else {
        console.warn("QuizEngine not initialized.");
    }
};

// --- 3️⃣ Share button handler ---
const shareAction = (type) => {
    switch(type) {
        case 'Facebook':
            console.log("Sharing to Facebook...");
            // open Facebook share link
            break;
        case 'twitter':
            console.log("Sharing to Twitter...");
            // open Twitter share link
            break;
        case 'copy':
            console.log("Copying link...");
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied!");
            break;
        case 'phone':
            console.log("Sharing via Phone...");
            // Cordova or navigator.share logic
            if (navigator.share) {
                navigator.share({
                    title: "RME Reviewer",
                    url: window.location.href
                }).catch(err => console.warn(err));
            } else {
                alert("Sharing not supported on this device.");
            }
            break;
        default:
            console.warn("Unknown share type:", type);
    }
};

// --- 4️⃣ Event delegation for all buttons ---
document.body.addEventListener("click", e => {
    const pageBtn = e.target.closest("[data-page]");
    if (pageBtn) {
        const targetPage = pageBtn.dataset.page;
        goToPage(targetPage);
        return;
    }

    const shareBtn = e.target.closest("[data-share]");
    if (shareBtn) {
        const shareType = shareBtn.dataset.share;
        shareAction(shareType);
        return;
    }
});

// --- 5️⃣ Initial page on load ---
document.addEventListener('DOMContentLoaded', () => {
  
  // 🔹 1. Pass DOM elements to QuizEngine
  QuizEngine.init({
    questionEl: document.getElementById("question"),
    optionsEl: document.getElementById("options"),
    scoreEl: document.getElementById("score")
  });

  // 🔹 2. Navigation buttons
  document.getElementById("nextBtn")?.addEventListener("click", QuizEngine.next);
  document.getElementById("prevBtn")?.addEventListener("click", QuizEngine.prev);
  document.getElementById("forwardBtn")?.addEventListener("click", QuizEngine.forward);
  document.getElementById("resetBtn")?.addEventListener("click", QuizEngine.reset);
  document.getElementById("shuffleBtn")?.addEventListener("click", QuizEngine.shuffle);

  // 🔹 3. Mode buttons (kung button na gamit mo)
  document.getElementById("modeAll")?.addEventListener("click", () => {
    QuizEngine.changeMode("all");
  });

  document.getElementById("modeWrong")?.addEventListener("click", () => {
    QuizEngine.changeMode("wrong");
  });
  
    // 1️⃣ Theme setup
    const themeSwitch = document.getElementById('themeSwitch');

    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light');
        if (themeSwitch) themeSwitch.checked = true;
    }

    if (themeSwitch) {
        themeSwitch.addEventListener('change', () => {
            document.body.classList.toggle('light');
            localStorage.setItem(
                'theme',
                document.body.classList.contains('light') ? 'light' : 'dark'
            );
        });
    }


    
    const SPLASH_DURATION = 2000; // 4 seconds
    const splash = document.getElementById('splash');
    const main = document.getElementById('index');

    // Cordova splashscreen (optional)
    if (navigator.splashscreen) {
        navigator.splashscreen.show();
    }

    setTimeout(function() {
        // Hide Cordova splashscreen
        if (navigator.splashscreen) {
            navigator.splashscreen.hide();
        }

        // Hide splash page (fade-out)
        splash.classList.remove('active');
        main.classList.add('active');

    }, SPLASH_DURATION);
    

    // 2️⃣ Initial page setup
    if (!document.querySelector('.page.active')) {
        goToPage('index'); // default SPA page
    }
});