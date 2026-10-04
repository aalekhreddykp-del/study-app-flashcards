const DEFAULT_DECKS = [
  {
    id: 'science',
    name: 'Science',
    cards: [
      {
        question: 'What is the powerhouse of the cell?',
        answer: 'The mitochondrion is often called the powerhouse of the cell because it produces ATP, the cell’s usable energy.'
      },
      {
        question: 'What process do plants use to make food from sunlight?',
        answer: 'Photosynthesis is the process plants use to convert carbon dioxide and water into glucose and oxygen using sunlight.'
      },
      {
        question: 'What is the boiling point of water at sea level?',
        answer: 'Water boils at 100°C (212°F) at sea level under standard atmospheric pressure.'
      },
      {
        question: 'What is the chemical symbol for gold?',
        answer: 'The chemical symbol for gold is Au.'
      }
    ]
  },
  {
    id: 'history',
    name: 'History',
    cards: [
      {
        question: 'Which empire built the Colosseum?',
        answer: 'The Roman Empire built the Colosseum in the 1st century CE.'
      },
      {
        question: 'Who was the first president of the United States?',
        answer: 'George Washington was the first president of the United States.'
      },
      {
        question: 'What year did the Berlin Wall fall?',
        answer: 'The Berlin Wall fell in 1989.'
      },
      {
        question: 'Who wrote the Declaration of Independence?',
        answer: 'Thomas Jefferson wrote the Declaration of Independence.'
      }
    ]
  },
  {
    id: 'language',
    name: 'Language Arts',
    cards: [
      {
        question: 'What is an example of a metaphor?',
        answer: 'A metaphor is a direct comparison without using “like” or “as,” such as “Time is a thief.”'
      },
      {
        question: 'What is the purpose of a thesis statement?',
        answer: 'A thesis statement clearly presents the main idea or argument of an essay.'
      },
      {
        question: 'What is the difference between “affect” and “effect”?',
        answer: '“Affect” is usually a verb meaning to influence, while “effect” is usually a noun meaning the result.'
      },
      {
        question: 'What is the function of a topic sentence?',
        answer: 'A topic sentence introduces the main idea of a paragraph.'
      }
    ]
  }
];

const QUIZ_BANK = [
  {
    question: 'Which organ is responsible for pumping blood throughout the body?',
    options: ['Lungs', 'Heart', 'Liver', 'Kidneys'],
    answer: 'Heart',
    explanation: 'The heart circulates oxygen-rich blood through the body and pumps blood to the lungs for oxygenation.'
  },
  {
    question: 'What is the capital of Japan?',
    options: ['Seoul', 'Kyoto', 'Tokyo', 'Osaka'],
    answer: 'Tokyo',
    explanation: 'Tokyo is the capital city of Japan and is one of the largest metropolitan areas in the world.'
  },
  {
    question: 'Which literary device uses exaggeration for emphasis?',
    options: ['Metaphor', 'Hyperbole', 'Simile', 'Irony'],
    answer: 'Hyperbole',
    explanation: 'Hyperbole is intentional exaggeration used to emphasize a point or create dramatic effect.'
  },
  {
    question: 'What does HTML stand for?',
    options: ['HyperTransfer Markup Language', 'HighText Machine Language', 'HyperText Markup Language', 'Hybrid Text Management Language'],
    answer: 'HyperText Markup Language',
    explanation: 'HTML is the standard markup language used to structure web pages.'
  },
  {
    question: 'Which planet is known as the Red Planet?',
    options: ['Venus', 'Mars', 'Mercury', 'Jupiter'],
    answer: 'Mars',
    explanation: 'Mars is called the Red Planet because iron oxide on its surface gives it a reddish appearance.'
  }
];

const state = {
  activeTab: 'flashcards',
  selectedDeckId: DEFAULT_DECKS[0].id,
  currentCardIndex: 0,
  showAnswer: false,
  quizIndex: 0,
  quizScore: 0,
  quizSubmitted: false,
  selectedAnswer: null,
  deckProgress: {
    science: 0,
    history: 0,
    language: 0
  }
};

const root = document.querySelector('#app');

function getSelectedDeck() {
  return DEFAULT_DECKS.find((deck) => deck.id === state.selectedDeckId) || DEFAULT_DECKS[0];
}

function getCurrentCard() {
  const deck = getSelectedDeck();
  return deck.cards[state.currentCardIndex] || deck.cards[0];
}

function markCardProgress() {
  const deck = getSelectedDeck();
  state.deckProgress[deck.id] = Math.min(
    100,
    Math.round(((state.currentCardIndex + 1) / deck.cards.length) * 100)
  );
}

function renderApp() {
  const totalCards = DEFAULT_DECKS.reduce((total, deck) => total + deck.cards.length, 0);
  const progressValues = Object.values(state.deckProgress);
  const averageProgress = progressValues.length
    ? Math.round(progressValues.reduce((sum, value) => sum + value, 0) / progressValues.length)
    : 0;

  root.innerHTML = `
    <div class="app-shell">
      <header class="topbar">
        <div class="brand">
          <div class="brand-mark">S</div>
          <span>StudySprint</span>
        </div>

        <nav class="nav-tabs" aria-label="Study sections">
          <button class="tab-button ${state.activeTab === 'flashcards' ? 'active' : ''}" data-tab="flashcards">Flashcards</button>
          <button class="tab-button ${state.activeTab === 'quiz' ? 'active' : ''}" data-tab="quiz">Quiz</button>
          <button class="tab-button ${state.activeTab === 'stats' ? 'active' : ''}" data-tab="stats">Progress</button>
        </nav>
      </header>

      <section class="dashboard-grid">
        <article class="stat-card">
          <div class="stat-label">Decks</div>
          <div class="stat-value">${DEFAULT_DECKS.length}</div>
        </article>
        <article class="stat-card">
          <div class="stat-label">Cards</div>
          <div class="stat-value">${totalCards}</div>
        </article>
        <article class="stat-card">
          <div class="stat-label">Avg. Progress</div>
          <div class="stat-value">${averageProgress}%</div>
        </article>
      </section>

      <main class="content-grid">
        <section class="panel">
          <div class="section-head">
            <h2>Study deck</h2>
            <span class="badge">${getSelectedDeck().cards.length} cards</span>
          </div>

          <div class="deck-list">
            ${DEFAULT_DECKS.map((deck) => `
              <button class="deck-item ${deck.id === state.selectedDeckId ? 'active' : ''}" data-deck-id="${deck.id}">
                <div class="deck-meta">
                  <strong>${deck.name}</strong>
                  <span class="deck-count">${deck.cards.length} flashcards</span>
                </div>
                <span class="badge">${state.deckProgress[deck.id] || 0}%</span>
              </button>
            `).join('')}
          </div>
        </section>

        <aside class="panel">
          <h3>Quick stats</h3>
          <p><strong>Current deck:</strong> ${getSelectedDeck().name}</p>
          <p><strong>Current card:</strong> ${state.currentCardIndex + 1} / ${getSelectedDeck().cards.length}</p>
          <p><strong>Quiz score:</strong> ${state.quizScore} / ${QUIZ_BANK.length}</p>
        </aside>
      </main>

      ${state.activeTab === 'flashcards' ? renderFlashcards() : ''}
      ${state.activeTab === 'quiz' ? renderQuiz() : ''}
      ${state.activeTab === 'stats' ? renderStats() : ''}
    </div>
  `;

  attachListeners();
}

function renderFlashcards() {
  const deck = getSelectedDeck();
  const card = getCurrentCard();

  return `
    <section class="flashcard-container" aria-live="polite">
      <div class="section-head">
        <h2>Flashcards</h2>
        <span class="badge">${deck.name}</span>
      </div>

      <div class="flashcard-stage">
        <article class="flashcard">
          <span class="flashcard-badge">Card ${state.currentCardIndex + 1}</span>

          <div>
            <div class="flashcard-question">${card.question}</div>
            <div class="flashcard-answer ${state.showAnswer ? '' : 'hidden'}">${card.answer}</div>
          </div>

          <div class="card-actions">
            <button class="secondary-btn" data-action="toggle-answer">
              ${state.showAnswer ? 'Hide answer' : 'Show answer'}
            </button>
            <button class="primary-btn" data-action="previous-card">Previous</button>
            <button class="primary-btn" data-action="next-card">Next</button>
          </div>
        </article>
      </div>
    </section>
  `;
}

function renderQuiz() {
  if (state.quizIndex >= QUIZ_BANK.length) {
    return `
      <section class="quiz-card">
        <h2>Quiz complete</h2>
        <p>You scored ${state.quizScore} out of ${QUIZ_BANK.length}.</p>
        <div class="quiz-actions">
          <button class="primary-btn" data-action="restart-quiz">Retake quiz</button>
        </div>
      </section>
    `;
  }

  const question = QUIZ_BANK[state.quizIndex];

  return `
    <section class="quiz-card">
      <div class="section-head">
        <h2>Quick quiz</h2>
        <span class="badge">Question ${state.quizIndex + 1}/${QUIZ_BANK.length}</span>
      </div>

      <div class="quiz-question">${question.question}</div>

      <div class="quiz-options">
        ${question.options
          .map((option) => {
            const isSelected = state.selectedAnswer === option;
            const isCorrect = option === question.answer;
            const showCorrect = state.quizSubmitted && isCorrect;
            const showWrong = state.quizSubmitted && isSelected && !isCorrect;

            return `
              <button
                class="choice-button ${showCorrect ? 'correct' : ''} ${showWrong ? 'wrong' : ''}"
                data-choice="${option}"
                ${state.quizSubmitted ? 'disabled' : ''}
              >
                ${option}
              </button>
            `;
          })
          .join('')}
      </div>

      <div class="quiz-footer">
        <span>Score: ${state.quizScore}</span>
        <button
          class="control-button"
          data-action="${state.quizSubmitted ? 'next-question' : 'check-answer'}"
          ${state.selectedAnswer ? '' : 'disabled'}
        >
          ${state.quizSubmitted ? 'Next question' : 'Check answer'}
        </button>
      </div>

      ${state.quizSubmitted ? `<div class="score-summary">${state.selectedAnswer === question.answer ? 'Correct!' : 'Not quite — that was the wrong answer.'}<br><strong>Explanation:</strong> ${question.explanation}</div>` : ''}
    </section>
  `;
}

function renderStats() {
  const values = Object.values(state.deckProgress);
  const average = values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : 0;

  return `
    <section class="panel">
      <h2>Progress overview</h2>
      <div class="deck-list">
        ${DEFAULT_DECKS.map((deck) => `
          <div class="deck-item active" style="pointer-events: none;">
            <div class="deck-meta">
              <strong>${deck.name}</strong>
              <span class="deck-count">${deck.cards.length} flashcards</span>
            </div>
            <span class="badge">${state.deckProgress[deck.id] || 0}%</span>
          </div>
        `).join('')}
      </div>
      <div class="score-summary">
        <strong>Average mastery:</strong> ${average}%
      </div>
    </section>
  `;
}

function attachListeners() {
  const tabButtons = document.querySelectorAll('.tab-button');
  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      state.activeTab = button.dataset.tab;
      renderApp();
    });
  });

  const deckButtons = document.querySelectorAll('[data-deck-id]');
  deckButtons.forEach((button) => {
    button.addEventListener('click', () => {
      state.selectedDeckId = button.dataset.deckId;
      state.currentCardIndex = 0;
      state.showAnswer = false;
      renderApp();
    });
  });

  const toggleAnswerButton = document.querySelector('[data-action="toggle-answer"]');
  if (toggleAnswerButton) {
    toggleAnswerButton.addEventListener('click', () => {
      state.showAnswer = !state.showAnswer;
      renderApp();
    });
  }

  const previousCardButton = document.querySelector('[data-action="previous-card"]');
  if (previousCardButton) {
    previousCardButton.addEventListener('click', () => {
      const deck = getSelectedDeck();
      state.currentCardIndex = (state.currentCardIndex - 1 + deck.cards.length) % deck.cards.length;
      state.showAnswer = false;
      markCardProgress();
      renderApp();
    });
  }

  const nextCardButton = document.querySelector('[data-action="next-card"]');
  if (nextCardButton) {
    nextCardButton.addEventListener('click', () => {
      const deck = getSelectedDeck();
      state.currentCardIndex = (state.currentCardIndex + 1) % deck.cards.length;
      state.showAnswer = false;
      markCardProgress();
      renderApp();
    });
  }

  const choiceButtons = document.querySelectorAll('[data-choice]');
  choiceButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (state.quizSubmitted) return;
      state.selectedAnswer = button.dataset.choice;
      renderApp();
    });
  });

  const checkAnswerButton = document.querySelector('[data-action="check-answer"]');
  if (checkAnswerButton) {
    checkAnswerButton.addEventListener('click', () => {
      if (!state.selectedAnswer) return;

      const question = QUIZ_BANK[state.quizIndex];
      if (state.selectedAnswer === question.answer) {
        state.quizScore += 1;
      }

      state.quizSubmitted = true;
      renderApp();
    });
  }

  const nextQuestionButton = document.querySelector('[data-action="next-question"]');
  if (nextQuestionButton) {
    nextQuestionButton.addEventListener('click', () => {
      state.quizIndex += 1;
      state.selectedAnswer = null;
      state.quizSubmitted = false;
      renderApp();
    });
  }

  const restartQuizButton = document.querySelector('[data-action="restart-quiz"]');
  if (restartQuizButton) {
    restartQuizButton.addEventListener('click', () => {
      state.quizIndex = 0;
      state.quizScore = 0;
      state.quizSubmitted = false;
      state.selectedAnswer = null;
      renderApp();
    });
  }
}

renderApp();
