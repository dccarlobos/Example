// ===============================
// QUIZ LOADER
// ===============================

const quizContainer = document.getElementById("quiz-list");

// Quiz configuration
const quizConfig = [
    { id: 1, offlineAllowed: true },
    { id: 2, offlineAllowed: true },
    { id: 3, offlineAllowed: false },
    { id: 4, offlineAllowed: false },
    { id: 5, offlineAllowed: false },
    { id: 6, offlineAllowed: false },
    { id: 7, offlineAllowed: false },
    { id: 8, offlineAllowed: false },
    { id: 9, offlineAllowed: false },
    { id: 10, offlineAllowed: false }
];

// Internet checker (lightweight)
function hasInternet() {
    return navigator.onLine;
}

// Check unlock state
function isUnlocked(quizId) {
    return localStorage.getItem(`unlock_${quizId}`) === "true";
}

// Render quiz buttons dynamically
function renderQuizButtons() {

    quizContainer.innerHTML = "";

    quizConfig.forEach((quiz, index) => {

        const btn = document.createElement("button");
        btn.className = "btn primary-btn";
        btn.dataset.quiz = quiz.id;

        let label = `Quiz ${index + 1}`;

        // If online-required quiz
        if (!quiz.offlineAllowed) {
            if (!isUnlocked(quiz.id)) {
                label += " 🔒";
            }
        }

        btn.textContent = label;

        quizContainer.appendChild(btn);
    });
}

// Handle click (event delegation)
quizContainer.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    const btn = e.target.closest("[data-quiz]");
    if (!btn) return;

    const quizId = Number(btn.dataset.quiz);
    const quiz = quizConfig.find(q => q.id === quizId);
    if (!quiz) return;

    // Offline allowed → always start
    if (quiz.offlineAllowed) {
        QuizEngine.startQuiz(quizId);
        return;
    }

    // If unlocked → start
    if (isUnlocked(quizId)) {
        QuizEngine.startQuiz(quizId);
        return;
    }

    // If offline → redirect to no internet page
    if (!hasInternet()) {
        goToPage("extra");
        return;
    }

    // Online but not unlocked → temporary access
    QuizEngine.startQuiz(quizId);
});

// Initialize when DOM ready
document.addEventListener("DOMContentLoaded", () => {
    renderQuizButtons();
});