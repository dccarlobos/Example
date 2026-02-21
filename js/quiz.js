const QuizEngine = (function () {

  // ================= STATE =================
  let originalQuestions = [];
  let viewIndexes = [];
  let currentQuestion = 0;
  let furthestQuestion = 0;
  let score = 0;
  let userAnswers = [];
  let isReviewMode = false;

// ================= DOM CACHE =================
  let questionEl;
  let optionsEl;
  let scoreEl;

  function init(dom) {
    questionEl = dom.questionEl;
    optionsEl = dom.optionsEl;
    scoreEl = dom.scoreEl;
  }
  
  // ================= START QUIZ =================
  function startQuiz(quizId) {
    const quizData = window["quiz" + quizId];
    if (!quizData) {
      console.error("Quiz not found:", quizId);
      return;
    }

    originalQuestions = [...quizData.questions];
    viewIndexes = originalQuestions.map((_, i) => i);

    currentQuestion = 0;
    furthestQuestion = 0;
    score = 0;
    userAnswers = [];
    isReviewMode = false;

    const quizTitleEl = document.getElementById("quizTitle");
    if (quizTitleEl) quizTitleEl.textContent = quizData.title || "Quiz";

    goToPage("quiz-page");
    const quizContainerEl = document.getElementById("quiz");
    if (quizContainerEl) quizContainerEl.style.display = "block";

    renderQuestion();
  }

  // ================= RENDER =================
  function renderQuestion() {
    const originalIndex = viewIndexes[currentQuestion];
    const q = originalQuestions[originalIndex];

    if (!q) {
      questionEl.textContent = "Quiz finished!";
      optionsEl.innerHTML = "";
      return;
    }

    // Determine if answered
    const savedAnswer = userAnswers[originalIndex];
    const answered = savedAnswer !== undefined;

    questionEl.textContent = q.question;
    optionsEl.innerHTML = "";

    q.options.forEach((opt, i) => {
      const btn = document.createElement("button");
      btn.textContent = opt;

      if (answered) {
        btn.disabled = true;
        if (i === q.answer) btn.classList.add("correct");
        if (i === savedAnswer && i !== q.answer) btn.classList.add("wrong");
      } else {
        btn.onclick = () => checkAnswer(i, originalIndex);
      }

      optionsEl.appendChild(btn);
    });

    scoreEl.textContent = `Score: ${score}/${originalQuestions.length}`;
  }

  // ================= CHECK ANSWER =================
  function checkAnswer(selected, originalIndex) {
    if (userAnswers[originalIndex] !== undefined) return;

    userAnswers[originalIndex] = selected;

    const q = originalQuestions[originalIndex];
    const buttons = optionsEl.querySelectorAll("button");

    buttons.forEach((btn, i) => {
      btn.disabled = true;
      if (i === q.answer) btn.classList.add("correct");
      if (i === selected && i !== q.answer) btn.classList.add("wrong");
    });

    if (selected === q.answer) score++;

    if (currentQuestion >= furthestQuestion) {
      furthestQuestion = currentQuestion + 1;
    }

    scoreEl.textContent = `Score: ${score}/${originalQuestions.length}`;
  }

  // ================= NAVIGATION =================
  function next() {
    if (currentQuestion < viewIndexes.length - 1) {
      currentQuestion++;
      renderQuestion();
    }
  }

  function prev() {
    if (currentQuestion > 0) {
      currentQuestion--;
      renderQuestion();
    }
  }

  function forward() {
    if (currentQuestion < furthestQuestion) {
      currentQuestion++;
      renderQuestion();
    }
  }

  // ================= RESET =================
  function reset() {
    viewIndexes = originalQuestions.map((_, i) => i);
    currentQuestion = 0;
    furthestQuestion = 0;
    score = 0;
    userAnswers = [];
    isReviewMode = false;
    renderQuestion();
  }

  // ================= SHUFFLE =================
  function shuffle() {
    viewIndexes = [...viewIndexes].sort(() => Math.random() - 0.5);
    currentQuestion = 0;
    renderQuestion();
  }

  // ================= MODE =================
  function changeMode(selectedMode) {
    if (selectedMode === "all") {
      viewIndexes = originalQuestions.map((_, i) => i);
      isReviewMode = false;
      renderQuestion();
      return;
    }

    if (selectedMode === "wrong") {
      const wrongIndexes = originalQuestions
        .map((q, idx) => (userAnswers[idx] !== q.answer ? idx : null))
        .filter(idx => idx !== null);

      if (wrongIndexes.length === 0) {
        questionEl.textContent = "🎉 All answers correct!";
        optionsEl.innerHTML = "";
        return;
      }

      viewIndexes = wrongIndexes;
      currentQuestion = 0;

      // Reset answers for only wrong questions
      viewIndexes.forEach(idx => {
        userAnswers[idx] = undefined;
      });

      isReviewMode = true; // enable only-didn't-know mode
      renderQuestion();
    }
  }


  return {
    init,
    startQuiz,
    next,
    prev,
    forward,
    reset,
    shuffle,
    changeMode
  };
})();