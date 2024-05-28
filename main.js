const app = document.getElementById('app');
let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let scores = JSON.parse(localStorage.getItem('quizScores')) || [];

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
                    <div class="card mt-4">
                        <div class="card-body">
                            <canvas id="resultsChart" width="400" height="200"></canvas>
                        </div>
                    </div>
                </div>
            `;
  document.getElementById('start-quiz').addEventListener('click', startQuiz);
  setTimeout(renderChart, 100); // Delay to ensure canvas is rendered
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
                            <button id="submit-answer" class="btn btn-primary mt-3">Next</button>
                        </div>
                    </div>
                </div>
            `;
  document.getElementById('submit-answer').addEventListener('click', () => handleAnswerSubmission(question.correct_answer));
}

// Render results page
function renderResultsPage(score, totalQuestions) {
  scores.push(score);
  localStorage.setItem('quizScores', JSON.stringify(scores));

  app.innerHTML = `
                <div class="container text-center">
                    <div class="card">
                        <div class="card-body">
                            <h1>Quiz Results</h1>
                            <p>Your score is ${score} out of ${totalQuestions}</p>
                            <button id="restart-quiz" class="btn btn-primary">Restart Quiz</button>
                        </div>
                    </div>
                    <div class="card mt-4">
                        <div class="card-body">
                            <canvas id="resultsChart" width="400" height="200"></canvas>
                        </div>
                    </div>
                </div>
            `;
  document.getElementById('restart-quiz').addEventListener('click', startQuiz);
  setTimeout(renderChart, 100); // Delay to ensure canvas is rendered
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

// Render chart
function renderChart() {
  const ctx = document.getElementById('resultsChart');
  if (!ctx) {
    console.error('Canvas element not found');
    return;
  }
  const chartContext = ctx.getContext('2d');
  const data = {
    labels: scores.map((_, index) => `Quiz ${index + 1}`),
    datasets: [{
      label: 'Scores',
      data: scores,
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderWidth: 1
    }]
  };
  const config = {
    type: 'line',
    data: data,
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: 10
        }
      }
    }
  };
  new Chart(chartContext, config);
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


