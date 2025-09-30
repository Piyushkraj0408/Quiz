let quizData = [];
let score = 0;
let currentQuestionIndex = 0;
let timerInterval;
let timeLeft = 20;

// --- DOM ELEMENTS ---
const quizContent = document.getElementById("quizContent");
const nextBtn = document.getElementById("nextBtn");
const resultSection = document.getElementById("resultSection");
const scoreDisplay = document.getElementById("scoreDisplay");
const timerDisplay = document.getElementById("timerDisplay");
const submitBtn = document.getElementById("submitBtn");
const totalQDisplay = document.getElementById("totalQ");

async function fetchQuiz() {
    const difficulty = localStorage.getItem("apiDifficulty") || 'easy';
    const categoryId = localStorage.getItem("apiCategory") || '9';

    quizContent.innerHTML = "<p>Loading Quiz...</p>";
    if (submitBtn) submitBtn.classList.add("hidden"); // Defensive check for submitBtn
    resultSection.classList.add("hidden");


    const url = `https://opentdb.com/api.php?amount=10&category=${categoryId}&difficulty=${difficulty}&type=multiple`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.response_code !== 0) {
            throw new Error("Could not fetch questions for the selected category/difficulty.");
        }

        quizData = data.results.map(item => {
            const allOptions = [...item.incorrect_answers, item.correct_answer];
            const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);
            
            return {
                question: item.question,
                options: shuffledOptions,
                // ✅ BUG FIX: Store the actual text of the correct answer, not its index.
                answer: item.correct_answer,
                selected: null
            };
        });
        
        // Reset state for a new quiz
        currentQuestionIndex = 0;
        score = 0;
        totalQDisplay.innerText = quizData.length;
        showQuestion();

    } catch (err) {
        console.error("Error loading quiz:", err);
        quizContent.innerHTML = `<p><b>Failed to load quiz.</b><br>${err.message}<br>Please try a different category or difficulty.</p>`;
        if (submitBtn) submitBtn.classList.add("hidden");
    }
}

function showQuestion() {
    if (currentQuestionIndex >= quizData.length) {
        endQuiz();
        return;
    }

    const currentQuestion = quizData[currentQuestionIndex];
    quizContent.innerHTML = "";
    const questionDiv = document.createElement("div");

    const questionText = document.createElement('p');
    questionText.innerHTML = `<b>Q${currentQuestionIndex + 1}:</b> ${currentQuestion.question}`;
    questionDiv.appendChild(questionText);

    currentQuestion.options.forEach(opt => {
        const optionEl = document.createElement("button");
        optionEl.className = "quiz-option";
        optionEl.innerHTML = opt;
        // Now this passes the correct data types for comparison
        optionEl.onclick = () => selectAnswer(optionEl, opt, currentQuestion.answer);
        questionDiv.appendChild(optionEl);
    });

    quizContent.appendChild(questionDiv);
    nextBtn.classList.add("hidden");

    resetTimer();
    startTimer();
}

function selectAnswer(selectedElement, selectedOption, correctAnswer) {
    clearInterval(timerInterval);

    const allOptions = quizContent.querySelectorAll(".quiz-option");
    allOptions.forEach(btn => btn.disabled = true);

    // This comparison now works correctly (e.g., "Paris" === "Paris")
    if (selectedOption === correctAnswer) {
        selectedElement.classList.add("correct");
        score++;
    } else {
        selectedElement.classList.add("incorrect");
        allOptions.forEach(btn => {
            if (btn.innerHTML === correctAnswer) {
                btn.classList.add("correct");
            }
        });
    }
    
    nextBtn.classList.remove("hidden");
}

function moveToNextQuestion() {
    currentQuestionIndex++;
    showQuestion();
}

function resetTimer() {
    clearInterval(timerInterval);
    timeLeft = 20;
    timerDisplay.innerText = `Time Left: ${timeLeft}s`;
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.innerText = `Time Left: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleTimeOut();
        }
    }, 1000);
}

function handleTimeOut() {
    // This logic now works correctly because it's comparing text with text
    const correctAnswer = quizData[currentQuestionIndex].answer;
    const allOptions = quizContent.querySelectorAll(".quiz-option");
    
    allOptions.forEach(btn => {
        btn.disabled = true;
        if (btn.innerHTML === correctAnswer) {
            btn.classList.add("correct");
        }
    });
    nextBtn.classList.remove("hidden");
}

function endQuiz() {
    quizContent.innerHTML = "<h2>Quiz Finished! 🎉</h2>";
    resultSection.classList.remove("hidden");
    scoreDisplay.innerText = score;
    nextBtn.classList.add("hidden");
    timerDisplay.innerText = "";
}

// Initializer and event listener
nextBtn.onclick = moveToNextQuestion;
window.onload = fetchQuiz;

function retryQuiz() {
    // This will re-fetch the questions and reset the quiz state.
    fetchQuiz();
}

function closeQuiz() {
    // This will send the user back to the home/selection page.
    // IMPORTANT: Make sure "index.html" is the correct name of your file.
    window.location.href = "role.html";
}