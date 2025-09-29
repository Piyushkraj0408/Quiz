let quizData = [];
let score = 0;

const quizContent = document.getElementById("quizContent");
const submitBtn = document.getElementById("submitBtn");
const resultSection = document.getElementById("resultSection");
const scoreDisplay = document.getElementById("scoreDisplay");
const totalQDisplay = document.getElementById("totalQ");

async function fetchQuiz() {
    const difficulty = localStorage.getItem("apiDifficulty") || 'easy';
    const categoryId = localStorage.getItem("apiCategory") || '9';

    quizContent.innerHTML = "<p>Loading Quiz...</p>";
    submitBtn.classList.add("hidden");

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
                answer: shuffledOptions.indexOf(item.correct_answer),
                selected: null
            };
        });

        renderQuiz();

    } catch (err) {
        console.error("Error loading quiz:", err);
        quizContent.innerHTML = "<p>Failed to load quiz. Please try a different category or role.</p>";
        submitBtn.classList.add("hidden");
    }
}

function renderQuiz() {
    quizContent.innerHTML = "";
    quizData.forEach((item, questionIndex) => {
        const questionDiv = document.createElement("div");
        
        const questionText = document.createElement('p');
        questionText.innerHTML = `<b>Q${questionIndex + 1}:</b> ${item.question}`;
        questionDiv.appendChild(questionText);

        item.options.forEach((opt, optionIndex) => {
            const optionEl = document.createElement("div");
            optionEl.className = "quiz-option";
            optionEl.innerHTML = opt;
            optionEl.onclick = () => selectAnswer(questionIndex, optionIndex, optionEl);
            questionDiv.appendChild(optionEl);
        });
        quizContent.appendChild(questionDiv);
    });

    resultSection.classList.add("hidden");
    submitBtn.classList.remove("hidden");
}

function selectAnswer(questionIndex, optionIndex, selectedElement) {
    quizData[questionIndex].selected = optionIndex;
    const siblings = selectedElement.parentNode.querySelectorAll(".quiz-option");
    siblings.forEach(sibling => sibling.style.background = "");
    selectedElement.style.background = "#d1e7dd";
}

function submitQuiz() {
    score = 0;
    quizData.forEach(q => {
        if (q.selected === q.answer) {
            score++;
        }
    });

    scoreDisplay.innerText = score;
    totalQDisplay.innerText = quizData.length;

    resultSection.classList.remove("hidden");
    submitBtn.classList.add("hidden");
    quizContent.innerHTML = "";
}

function retryQuiz() {
    fetchQuiz();
}

function closeQuiz() {
    window.location.href = "role.html";
}

window.onload = function() {
    fetchQuiz();
};