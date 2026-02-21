// ================== DEV.JS - Online / Offline Unlock Logic ==================

// Duration of unlock in ms (30 days)
const UNLOCK_DURATION = 30 * 1000; // 30 days

// Helper: Check if quiz is unlocked
function isUnlocked(quizId) {
    const unlockData = JSON.parse(localStorage.getItem(`unlock_${quizId}`));
    if (!unlockData) return false;

    const now = Date.now();
    if (now - unlockData.timestamp > UNLOCK_DURATION) {
        // Expired unlock
        localStorage.removeItem(`unlock_${quizId}`);
        return false;
    }
    return true;
}

// Helper: Unlock a quiz
function unlockQuiz(quizId) {
    localStorage.setItem(`unlock_${quizId}`, JSON.stringify({ timestamp: Date.now() }));
}

// Render lock/unlock button in quiz-page
function renderLockButton(quizId) {
    const unlockBtn = document.getElementById("unlockBtn");
    if (!unlockBtn) return;

    // Only quizzes 3-10 need unlock
    if (quizId >= 3 && quizId <= 10 && !isUnlocked(quizId)) {
        unlockBtn.style.display = "inline-block";

        unlockBtn.onclick = () => {
            alert("Simulated Interstitial Ad...");
            unlockQuiz(quizId);
            renderLockButton(quizId);
            alert("Unlocked for 30 days!");
        };

    } else {
        unlockBtn.style.display = "none";
    }
}

// ================== Hook into QuizEngine ==================
function setupUnlockLogic() {
    // When a quiz starts
    const originalStart = QuizEngine.startQuiz;

    QuizEngine.startQuiz = function (quizId) {
        originalStart.call(QuizEngine, quizId);
        renderLockButton(parseInt(quizId));
    };
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    setupUnlockLogic();
});