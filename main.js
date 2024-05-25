const app = document.getElementById('app');
let questions = [];
let currentQuestionIndex = 0;
let score = 0;

// Fetch questions from the API
async function fetchQuestions() {
  const apiUrl = 'https://opentdb.com/api.php?amount=10';
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching questions:', error);
  }
}

// Render home page
function renderHomePage() {
  app.innerHTML = `
    <div class="container text-center">
      <div class="card">
        <div class="card-body">
          <h1>Welcome to the Quiz</h1>
          <button id="start-quiz" class="btn btn-primary btn-small mt-4">Start Quiz</button>
        </div>
      </div>
    </div>
  `;
  document.getElementById('start-quiz').addEventListener('click', startQuiz);
}

// Render question page
function renderQuestionPage(question, questionIndex, totalQuestions) {
  const answers = [...question.incorrect_answers, question.correct_answer].sort(() => Math.random() - 0.5);
  app.innerHTML = `
    <div class="container">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Question ${questionIndex + 1} of ${totalQuestions}</h5>
          <p class="card-text">${question.question}</p>
          ${answers.map((answer, index) => `
            <div class="form-check">
              <input class="form-check-input" type="radio" name="answer" id="answer${index}" value="${answer}">
              <label class="form-check-label" for="answer${index}">
                ${answer}
              </label>
            </div>
          `).join('')}
          <button id="submit-answer" class="btn btn-primary mt-3">Submit Answer</button>
        </div>
      </div>
    </div>
  `;
  document.getElementById('submit-answer').addEventListener('click', () => handleAnswerSubmission(question.correct_answer));
}

// Render results page
function renderResultsPage(score, totalQuestions) {
  app.innerHTML = `
    <div class="container text-center">
      <div class="card">
        <div class="card-body">
          <h1>Quiz Results</h1>
          <p>Your score is ${score} out of ${totalQuestions}</p>
          <button id="restart-quiz" class="btn btn-primary">Restart Quiz</button>
        </div>
      </div>
    </div>
  `;
  document.getElementById('restart-quiz').addEventListener('click', startQuiz);
}

// Handle answer submission
function handleAnswerSubmission(correctAnswer) {
  const selectedAnswer = document.querySelector('input[name="answer"]:checked');
  if (!selectedAnswer) {
    alert('Please select an answer.');
    return;
  }

  const userAnswer = selectedAnswer.value;
  if (userAnswer === correctAnswer) {
    score++;
  }

  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    renderQuestionPage(questions[currentQuestionIndex], currentQuestionIndex, questions.length);
  } else {
    renderResultsPage(score, questions.length);
  }
}

// Start quiz
async function startQuiz() {
  questions = await fetchQuestions();
  currentQuestionIndex = 0;
  score = 0;
  renderQuestionPage(questions[currentQuestionIndex], currentQuestionIndex, questions.length);
}

// Initial render
renderHomePage();



   
 