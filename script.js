// KBC Quiz Game JavaScript

// DOM Elements
const welcomeScreen = document.getElementById('welcome-screen');
const gameScreen = document.getElementById('game-screen');
const feedbackScreen = document.getElementById('feedback-screen');
const resultsScreen = document.getElementById('results-screen');

const playerNameInput = document.getElementById('player-name');
const startGameBtn = document.getElementById('start-game');
const playerNameDisplay = document.getElementById('player-name-display');
const questionCounter = document.getElementById('question-counter');
const currentScoreDisplay = document.getElementById('current-score');
const questionText = document.getElementById('question-text');
const options = document.querySelectorAll('.option');
const optionTexts = document.querySelectorAll('.option-text');

const fiftyFiftyBtn = document.getElementById('fifty-fifty');
const audiencePollBtn = document.getElementById('audience-poll');
const phoneFriendBtn = document.getElementById('phone-friend');

const feedbackMessage = document.getElementById('feedback-message');
const correctAnswerText = document.getElementById('correct-answer');
const educationalFact = document.getElementById('educational-fact');
const nextQuestionBtn = document.getElementById('next-question');

const finalMessage = document.getElementById('final-message');
const finalScore = document.getElementById('final-score');
const previousScoresList = document.getElementById('previous-scores-list');
const playAgainBtn = document.getElementById('play-again');

const audiencePollModal = document.getElementById('audience-poll-modal');
const audiencePollClose = document.getElementById('audience-poll-close');
const pollBars = document.querySelectorAll('.poll-bar');
const pollPercentages = document.querySelectorAll('.poll-percentage');

const phoneFriendModal = document.getElementById('phone-friend-modal');
const phoneFriendClose = document.getElementById('phone-friend-close');
const phoneFriendMessage = document.getElementById('phone-friend-message');

const confettiCanvas = document.getElementById('confetti-canvas');
const ctx = confettiCanvas.getContext('2d');

// Game State
let playerName = '';
let currentQuestionIndex = 0;
let score = 0;
let selectedQuestions = [];
let fiftyFiftyUsed = false;
let audiencePollUsed = false;
let phoneFriendUsed = false;
let selectedOption = null;
let recentlyUsedQuestionIds = [];

// Confetti Setup
confettiCanvas.width = window.innerWidth;
confettiCanvas.height = window.innerHeight;
const confettiPieces = [];
const confettiColors = ['#ffd700', '#ff0000', '#00ff00', '#0000ff', '#ff00ff', '#00ffff'];

// Event Listeners
window.addEventListener('resize', () => {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
});

startGameBtn.addEventListener('click', startGame);
nextQuestionBtn.addEventListener('click', showNextQuestion);
playAgainBtn.addEventListener('click', resetGame);
fiftyFiftyBtn.addEventListener('click', useFiftyFifty);
audiencePollBtn.addEventListener('click', useAudiencePoll);
phoneFriendBtn.addEventListener('click', usePhoneFriend);
audiencePollClose.addEventListener('click', () => closeModal(audiencePollModal));
phoneFriendClose.addEventListener('click', () => closeModal(phoneFriendModal));

// Add Enter key functionality for name input
playerNameInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        startGame();
    }
});

options.forEach(option => {
    option.addEventListener('click', () => selectOption(option));
});

// Questions Database
const questionsDatabase = [
    // Science & Space
    {
        id: 1,
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correctAnswer: 1,
        fact: "Mars appears red because its surface contains iron oxide, commonly known as rust."
    },
    
    // Computer Science & Programming
    {
        id: 31,
        question: "What does CPU stand for?",
        options: ["Central Processing Unit", "Computer Personal Unit", "Central Program Utility", "Core Processing Unit"],
        correctAnswer: 0,
        fact: "The CPU is often called the 'brain' of the computer and performs most of the processing inside a computer."
    },
    {
        id: 32,
        question: "Which programming language is known as the 'mother of all programming languages'?",
        options: ["Java", "C", "Python", "FORTRAN"],
        correctAnswer: 1,
        fact: "C was developed in the early 1970s by Dennis Ritchie at Bell Labs and has influenced many modern programming languages."
    },
    {
        id: 33,
        question: "What does HTML stand for?",
        options: ["Hyper Text Markup Language", "High Tech Multi Language", "Hyper Transfer Markup Language", "Hyperlink Text Management Language"],
        correctAnswer: 0,
        fact: "HTML was created by Tim Berners-Lee in 1990 while working at CERN and is the standard markup language for creating web pages."
    },
    {
        id: 34,
        question: "Which of these is not a JavaScript framework?",
        options: ["Angular", "React", "Django", "Vue"],
        correctAnswer: 2,
        fact: "Django is a high-level Python web framework, while Angular, React, and Vue are JavaScript frameworks/libraries."
    },
    {
        id: 35,
        question: "What is the primary function of an operating system?",
        options: ["Run applications", "Manage hardware resources", "Connect to the internet", "Store data"],
        correctAnswer: 1,
        fact: "Operating systems manage hardware resources, provide services for computer programs, and create a user interface for interaction."
    },
    
    // History
    {
        id: 36,
        question: "Who was the first President of the United States?",
        options: ["Thomas Jefferson", "John Adams", "George Washington", "Benjamin Franklin"],
        correctAnswer: 2,
        fact: "George Washington served as the first President from 1789 to 1797 and is the only president to have been elected unanimously by the Electoral College."
    },
    {
        id: 37,
        question: "In which year did World War II end?",
        options: ["1943", "1945", "1947", "1950"],
        correctAnswer: 1,
        fact: "World War II ended in 1945 with the surrender of Germany in May and Japan in September following the atomic bombings of Hiroshima and Nagasaki."
    },
    {
        id: 38,
        question: "Who was the first woman Prime Minister of India?",
        options: ["Sarojini Naidu", "Indira Gandhi", "Sonia Gandhi", "Pratibha Patil"],
        correctAnswer: 1,
        fact: "Indira Gandhi served as Prime Minister of India for three consecutive terms from 1966 to 1977 and a fourth term from 1980 until her assassination in 1984."
    },
    {
        id: 39,
        question: "Which ancient wonder was located in Alexandria, Egypt?",
        options: ["The Hanging Gardens", "The Colossus of Rhodes", "The Lighthouse (Pharos)", "The Temple of Artemis"],
        correctAnswer: 2,
        fact: "The Lighthouse of Alexandria, also known as the Pharos, was built in the 3rd century BCE and was one of the tallest man-made structures for many centuries."
    },
    {
        id: 40,
        question: "Who wrote the 'I Have a Dream' speech?",
        options: ["Malcolm X", "Martin Luther King Jr.", "Barack Obama", "Nelson Mandela"],
        correctAnswer: 1,
        fact: "Martin Luther King Jr. delivered his famous 'I Have a Dream' speech during the March on Washington for Jobs and Freedom on August 28, 1963."
    },
    
    // Current Affairs & News
    {
        id: 41,
        question: "Which technology company became the first to reach a $3 trillion market cap in 2024?",
        options: ["Microsoft", "Google", "Apple", "Amazon"],
        correctAnswer: 2,
        fact: "Apple became the first company to reach a $3 trillion market capitalization, highlighting its continued dominance in the tech industry."
    },
    {
        id: 42,
        question: "Which country hosted the 2024 Summer Olympics?",
        options: ["United States", "Japan", "France", "Australia"],
        correctAnswer: 2,
        fact: "The 2024 Summer Olympics were held in Paris, France, marking the third time Paris has hosted the Olympic Games (previously in 1900 and 1924)."
    },
    {
        id: 43,
        question: "What is the name of the NASA mission that returned humans to the Moon in 2024?",
        options: ["Apollo", "Artemis", "Orion", "Constellation"],
        correctAnswer: 1,
        fact: "The Artemis program is NASA's initiative to return humans to the Moon, with a focus on establishing sustainable exploration by the end of the decade."
    },
    {
        id: 44,
        question: "Which cryptocurrency was the first to be created?",
        options: ["Ethereum", "Bitcoin", "Dogecoin", "Litecoin"],
        correctAnswer: 1,
        fact: "Bitcoin was created in 2009 by an unknown person or group using the pseudonym Satoshi Nakamoto and introduced the concept of blockchain technology."
    },
    {
        id: 45,
        question: "What technology trend gained significant attention in 2023-2024 for its rapid advancement?",
        options: ["Virtual Reality", "Artificial Intelligence", "Quantum Computing", "5G Networks"],
        correctAnswer: 1,
        fact: "Generative AI models like GPT-4 and other large language models revolutionized many industries with their ability to generate human-like text, images, and code."
    },
    
    // Science & Innovation
    {
        id: 46,
        question: "What is the name of the particle discovered at CERN in 2012 that helps explain why objects have mass?",
        options: ["Graviton", "Higgs Boson", "Neutrino", "Quark"],
        correctAnswer: 1,
        fact: "The Higgs Boson, sometimes called the 'God Particle', was theorized in 1964 but not discovered until 2012 at the Large Hadron Collider."
    },
    {
        id: 47,
        question: "Which renewable energy source is the fastest-growing globally?",
        options: ["Hydroelectric", "Wind", "Solar", "Geothermal"],
        correctAnswer: 2,
        fact: "Solar energy has become the fastest-growing renewable energy source due to falling costs, improved efficiency, and supportive policies worldwide."
    },
    
    // Arts & Literature
    {
        id: 48,
        question: "Who painted 'Starry Night'?",
        options: ["Pablo Picasso", "Claude Monet", "Vincent van Gogh", "Leonardo da Vinci"],
        correctAnswer: 2,
        fact: "Vincent van Gogh painted 'Starry Night' in 1889 while staying at the Saint-Paul-de-Mausole asylum in Saint-Rémy-de-Provence, France."
    },
    {
        id: 49,
        question: "Which novel begins with the line 'It was the best of times, it was the worst of times'?",
        options: ["Great Expectations", "A Tale of Two Cities", "Oliver Twist", "Pride and Prejudice"],
        correctAnswer: 1,
        fact: "Charles Dickens' 'A Tale of Two Cities' (1859) begins with this famous opening line and is set during the French Revolution."
    },
    
    // Sports
    {
        id: 50,
        question: "Which country has won the most FIFA World Cup titles?",
        options: ["Germany", "Brazil", "Italy", "Argentina"],
        correctAnswer: 1,
        fact: "Brazil has won the FIFA World Cup five times (1958, 1962, 1970, 1994, and 2002), making it the most successful national team in the tournament's history."
    },
    {
        id: 51,
        question: "In which sport would you perform a 'Salchow'?",
        options: ["Gymnastics", "Diving", "Figure Skating", "Snowboarding"],
        correctAnswer: 2,
        fact: "The Salchow is a figure skating jump named after Swedish skater Ulrich Salchow, who first performed it in 1909."
    },
    
    // Business & Economics
    {
        id: 52,
        question: "Which company owns Instagram, WhatsApp, and Facebook?",
        options: ["Alphabet", "Meta", "Microsoft", "Amazon"],
        correctAnswer: 1,
        fact: "Meta Platforms, Inc. (formerly Facebook, Inc.) owns these popular social media and messaging platforms, reaching billions of users worldwide."
    },
    {
        id: 53,
        question: "What is the currency of Japan?",
        options: ["Yuan", "Won", "Yen", "Ringgit"],
        correctAnswer: 2,
        fact: "The Japanese Yen is one of the world's most traded currencies and is the third most used currency as a reserve currency after the US Dollar and Euro."
    },
    
    // Environment & Climate
    {
        id: 54,
        question: "Which gas is most responsible for the greenhouse effect causing climate change?",
        options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
        correctAnswer: 1,
        fact: "While carbon dioxide occurs naturally in the atmosphere, human activities have increased CO2 levels by more than 45% since the Industrial Revolution."
    },
    {
        id: 55,
        question: "Which ocean contains the Great Barrier Reef?",
        options: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"],
        correctAnswer: 2,
        fact: "The Great Barrier Reef is located in the Coral Sea, off the coast of Queensland, Australia, in the Pacific Ocean."
    },
    
    // International Relations
    {
        id: 56,
        question: "Which organization has the motto 'Peace, Dignity and Equality on a Healthy Planet'?",
        options: ["World Health Organization", "United Nations", "European Union", "NATO"],
        correctAnswer: 1,
        fact: "The United Nations was founded in 1945 after World War II with the aim of preventing future wars and facilitating cooperation in international law, security, and human rights."
    },
    {
        id: 57,
        question: "Which country has the largest population in the world as of 2024?",
        options: ["China", "India", "United States", "Indonesia"],
        correctAnswer: 1,
        fact: "India surpassed China as the world's most populous country in 2023, with a population exceeding 1.4 billion people."
    },
    
    // Additional Computer Science
    {
        id: 58,
        question: "What does API stand for in computer programming?",
        options: ["Application Programming Interface", "Advanced Program Integration", "Automated Processing Interface", "Application Process Integration"],
        correctAnswer: 0,
        fact: "APIs allow different software applications to communicate with each other, enabling developers to integrate existing services rather than building everything from scratch."
    },
    {
        id: 59,
        question: "Which of these is a version control system?",
        options: ["Docker", "Kubernetes", "Git", "Jenkins"],
        correctAnswer: 2,
        fact: "Git was created by Linus Torvalds in 2005 for development of the Linux kernel and has become the most widely used version control system in software development."
    },
    {
        id: 60,
        question: "What is the main purpose of a firewall in computer networks?",
        options: ["Speed up internet connection", "Monitor system performance", "Block unauthorized access", "Increase storage capacity"],
        correctAnswer: 2,
        fact: "Firewalls act as a barrier between a trusted network and untrusted networks, monitoring and controlling incoming and outgoing network traffic based on security rules."
    },
    {
        id: 2,
        question: "What is the chemical symbol for gold?",
        options: ["Go", "Gd", "Au", "Ag"],
        correctAnswer: 2,
        fact: "The symbol Au comes from the Latin word for gold, 'aurum', which means 'shining dawn'."
    },
    {
        id: 3,
        question: "Which element has the chemical symbol 'O'?",
        options: ["Gold", "Oxygen", "Osmium", "Oganesson"],
        correctAnswer: 1,
        fact: "Oxygen makes up about 21% of Earth's atmosphere and is essential for human respiration."
    },
    {
        id: 4,
        question: "Which planet has the most moons?",
        options: ["Jupiter", "Saturn", "Uranus", "Neptune"],
        correctAnswer: 1,
        fact: "Saturn has over 80 moons, with the exact number still being discovered as technology advances."
    },
    {
        id: 5,
        question: "What is the main component of the Sun?",
        options: ["Oxygen", "Carbon", "Helium", "Hydrogen"],
        correctAnswer: 3,
        fact: "The Sun is composed of approximately 73% hydrogen and 25% helium by mass, with the remaining 2% consisting of heavier elements."
    },
    
    // Literature & Arts
    {
        id: 6,
        question: "Who wrote the play 'Romeo and Juliet'?",
        options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
        correctAnswer: 1,
        fact: "William Shakespeare wrote 'Romeo and Juliet' around 1594-1595, early in his career."
    },
    {
        id: 7,
        question: "Who painted the Mona Lisa?",
        options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
        correctAnswer: 2,
        fact: "Leonardo da Vinci began painting the Mona Lisa around 1503 and worked on it for several years."
    },
    
    // Geography & World
    {
        id: 8,
        question: "Which country is home to the Great Barrier Reef?",
        options: ["Brazil", "Australia", "Thailand", "Mexico"],
        correctAnswer: 1,
        fact: "The Great Barrier Reef is the world's largest coral reef system and can be seen from outer space."
    },
    {
        id: 9,
        question: "What is the capital city of Japan?",
        options: ["Seoul", "Beijing", "Tokyo", "Bangkok"],
        correctAnswer: 2,
        fact: "Tokyo became the capital of Japan in 1868, replacing the former capital, Kyoto."
    },
    {
        id: 10,
        question: "What is the largest ocean on Earth?",
        options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
        correctAnswer: 3,
        fact: "The Pacific Ocean covers more than 30% of the Earth's surface and contains more than half of the free water on Earth."
    },
    {
        id: 11,
        question: "Which country is known as the Land of the Rising Sun?",
        options: ["China", "Thailand", "Japan", "South Korea"],
        correctAnswer: 2,
        fact: "Japan is called the Land of the Rising Sun because from China's perspective, the sun rises from the direction of Japan."
    },
    {
        id: 12,
        question: "Which is the smallest country in the world by land area?",
        options: ["Monaco", "Maldives", "Vatican City", "San Marino"],
        correctAnswer: 2,
        fact: "Vatican City is just 0.49 square kilometers (0.19 square miles) in area, making it the smallest sovereign state in the world."
    },
    
    // Technology & Computing
    {
        id: 13,
        question: "Which of these is NOT a programming language?",
        options: ["Java", "Python", "Cobra", "Leopard"],
        correctAnswer: 3,
        fact: "While Python and Cobra are named after snakes, Leopard is not a programming language."
    },
    {
        id: 14,
        question: "Who is considered the father of modern computer science?",
        options: ["Bill Gates", "Steve Jobs", "Alan Turing", "Tim Berners-Lee"],
        correctAnswer: 2,
        fact: "Alan Turing's work on the concept of a universal machine became the foundation of the modern theory of computation and computers."
    },
    
    // Mathematics
    {
        id: 15,
        question: "What is the smallest prime number?",
        options: ["0", "1", "2", "3"],
        correctAnswer: 2,
        fact: "2 is the only even prime number, as all other even numbers are divisible by 2."
    },
    
    // General Knowledge
    {
        id: 16,
        question: "What is the hardest natural substance on Earth?",
        options: ["Gold", "Iron", "Diamond", "Platinum"],
        correctAnswer: 2,
        fact: "Diamonds are formed deep within the Earth under extreme pressure and heat, typically 150-200 kilometers below the surface."
    },
    {
        id: 17,
        question: "Which famous scientist developed the theory of relativity?",
        options: ["Isaac Newton", "Albert Einstein", "Galileo Galilei", "Stephen Hawking"],
        correctAnswer: 1,
        fact: "Einstein published his theory of general relativity in 1915, which revolutionized our understanding of gravity."
    },
    
    // Ramayana
    {
        id: 18,
        question: "Who is the author of the original Ramayana?",
        options: ["Valmiki", "Ved Vyasa", "Tulsidas", "Kamban"],
        correctAnswer: 0,
        fact: "Sage Valmiki composed the original Ramayana in Sanskrit, consisting of 24,000 verses divided into seven books (kandas)."
    },
    {
        id: 19,
        question: "Who was Lord Rama's father?",
        options: ["King Janaka", "King Dasharatha", "King Bharata", "King Ravana"],
        correctAnswer: 1,
        fact: "King Dasharatha of Ayodhya had three wives - Kausalya, Kaikeyi, and Sumitra, and four sons - Rama, Bharata, Lakshmana, and Shatrughna."
    },
    {
        id: 20,
        question: "For how many years was Lord Rama exiled to the forest?",
        options: ["7 years", "10 years", "14 years", "21 years"],
        correctAnswer: 2,
        fact: "Lord Rama was exiled for 14 years due to Queen Kaikeyi's two boons that she had received from King Dasharatha."
    },
    {
        id: 21,
        question: "Who helped Lord Rama build a bridge to Lanka?",
        options: ["Sugriva and his army", "Jambavan", "Hanuman", "The Vanara (monkey) army"],
        correctAnswer: 3,
        fact: "The bridge, known as Ram Setu or Adam's Bridge, was built by the Vanara army by throwing stones into the sea that floated on water."
    },
    
    // Mahabharata
    {
        id: 22,
        question: "Who wrote the Mahabharata?",
        options: ["Valmiki", "Ved Vyasa", "Tulsidas", "Kalidas"],
        correctAnswer: 1,
        fact: "Ved Vyasa dictated the Mahabharata to Lord Ganesha, who wrote it down. It contains about 100,000 verses, making it the longest epic poem ever written."
    },
    {
        id: 23,
        question: "How many Pandava brothers were there in the Mahabharata?",
        options: ["Three", "Four", "Five", "Six"],
        correctAnswer: 2,
        fact: "The five Pandava brothers were Yudhishthira, Bhima, Arjuna, Nakula, and Sahadeva, all married to Draupadi."
    },
    {
        id: 24,
        question: "Which sacred text was narrated by Lord Krishna to Arjuna before the Kurukshetra war?",
        options: ["Ramayana", "Bhagavad Gita", "Upanishads", "Vedas"],
        correctAnswer: 1,
        fact: "The Bhagavad Gita consists of 700 verses and is part of the Mahabharata. It contains Lord Krishna's teachings on duty, righteousness, and spiritual wisdom."
    },
    {
        id: 25,
        question: "Who was the eldest among the Kaurava brothers?",
        options: ["Duryodhana", "Dushasana", "Vikarna", "Yuyutsu"],
        correctAnswer: 0,
        fact: "Duryodhana was the eldest of the 100 Kaurava brothers and the main antagonist of the Mahabharata."
    },
    
    // Famous Cities
    {
        id: 26,
        question: "Which city is known as the 'City of Love'?",
        options: ["Venice", "Paris", "Rome", "Vienna"],
        correctAnswer: 1,
        fact: "Paris is known as the 'City of Love' for its romantic ambiance, beautiful architecture, and the Seine River that flows through it."
    },
    {
        id: 27,
        question: "Which Indian city is known as the 'Pink City'?",
        options: ["Jaipur", "Jodhpur", "Udaipur", "Bikaner"],
        correctAnswer: 0,
        fact: "Jaipur is called the 'Pink City' because its buildings were painted pink to welcome the Prince of Wales (later King Edward VII) in 1876."
    },
    {
        id: 28,
        question: "Which city is located on two continents?",
        options: ["Cairo", "Moscow", "Istanbul", "Jerusalem"],
        correctAnswer: 2,
        fact: "Istanbul spans both Europe and Asia, with the Bosphorus Strait dividing the city between the two continents."
    },
    {
        id: 29,
        question: "Which city is home to the Taj Mahal?",
        options: ["Delhi", "Jaipur", "Agra", "Lucknow"],
        correctAnswer: 2,
        fact: "The Taj Mahal in Agra was built by Emperor Shah Jahan in memory of his wife Mumtaz Mahal between 1631 and 1648."
    },
    
    // World History
    {
        id: 30,
        question: "Who was the first woman to win a Nobel Prize?",
        options: ["Mother Teresa", "Marie Curie", "Rosa Parks", "Florence Nightingale"],
        correctAnswer: 1,
        fact: "Marie Curie won the Nobel Prize twice, in Physics (1903) and Chemistry (1911), and remains the only person to win Nobel Prizes in multiple scientific fields."
    }
];

// Game Functions
function startGame() {
    if (!playerNameInput.value.trim()) {
        alert("Please enter your name to start the game!");
        return;
    }
    
    playerName = playerNameInput.value.trim();
    playerNameDisplay.textContent = playerName;
    
    // Reset game state
    currentQuestionIndex = 0;
    score = 0;
    currentScoreDisplay.textContent = score;
    fiftyFiftyUsed = false;
    audiencePollUsed = false;
    phoneFriendUsed = false;
    
    // Reset lifeline buttons
    fiftyFiftyBtn.classList.remove('used');
    audiencePollBtn.classList.remove('used');
    phoneFriendBtn.classList.remove('used');
    
    // Select random questions
    selectRandomQuestions();
    
    // Show first question
    showQuestion();
    
    // Switch to game screen
    switchScreen(welcomeScreen, gameScreen);
}

function selectRandomQuestions() {
    // Filter out recently used questions
    const availableQuestions = questionsDatabase.filter(q => !recentlyUsedQuestionIds.includes(q.id));
    
    // If we don't have enough questions, reset the recently used list
    if (availableQuestions.length < 10) {
        recentlyUsedQuestionIds = [];
    }
    
    // Shuffle available questions and select 10
    selectedQuestions = shuffleArray(availableQuestions).slice(0, 10);
    
    // Update recently used questions
    recentlyUsedQuestionIds = [...recentlyUsedQuestionIds, ...selectedQuestions.map(q => q.id)];
    
    // Keep only the most recent 15 questions in the recently used list
    if (recentlyUsedQuestionIds.length > 15) {
        recentlyUsedQuestionIds = recentlyUsedQuestionIds.slice(-15);
    }
}

function showQuestion() {
    const currentQuestion = selectedQuestions[currentQuestionIndex];
    
    // Update question counter
    questionCounter.textContent = `Question ${currentQuestionIndex + 1}/${selectedQuestions.length}`;
    
    // Set question text
    questionText.textContent = currentQuestion.question;
    
    // Reset options
    options.forEach((option, index) => {
        option.classList.remove('selected', 'correct', 'incorrect', 'disabled', 'friend-suggested');
        option.querySelector('.option-text').textContent = currentQuestion.options[index];
    });
    
    // Reset selected option
    selectedOption = null;
}

function selectOption(option) {
    // If an option is already selected or disabled, do nothing
    if (selectedOption !== null || option.classList.contains('disabled')) {
        return;
    }
    
    // Get the index of the selected option
    const optionIndex = parseInt(option.getAttribute('data-index'));
    
    // Mark as selected
    option.classList.add('selected');
    selectedOption = optionIndex;
    
    // Check answer after a short delay
    setTimeout(() => {
        checkAnswer();
    }, 1000);
}

function checkAnswer() {
    const currentQuestion = selectedQuestions[currentQuestionIndex];
    const correctOptionIndex = currentQuestion.correctAnswer;
    
    // Mark correct and incorrect options
    options[correctOptionIndex].classList.add('correct');
    
    if (selectedOption !== correctOptionIndex) {
        options[selectedOption].classList.add('incorrect');
    }
    
    // Update score if correct
    if (selectedOption === correctOptionIndex) {
        score += 10;
        currentScoreDisplay.textContent = score;
        
        // Show confetti for correct answer
        createConfetti();
        
        // Set feedback message
        feedbackMessage.textContent = "Correct! Well done!";
        feedbackMessage.style.color = "#4CAF50";
    } else {
        feedbackMessage.textContent = "Sorry, that's incorrect.";
        feedbackMessage.style.color = "#F44336";
    }
    
    // Show correct answer and educational fact
    correctAnswerText.textContent = `The correct answer is: ${currentQuestion.options[correctOptionIndex]}`;
    educationalFact.textContent = currentQuestion.fact;
    
    // Switch to feedback screen after a delay
    setTimeout(() => {
        switchScreen(gameScreen, feedbackScreen);
    }, 1500);
}

function showNextQuestion() {
    currentQuestionIndex++;
    
    // Check if we've reached the end of the quiz
    if (currentQuestionIndex >= selectedQuestions.length) {
        showResults();
    } else {
        showQuestion();
        switchScreen(feedbackScreen, gameScreen);
    }
}

function showResults() {
    // Calculate percentage score
    const percentage = Math.round((score / (selectedQuestions.length * 10)) * 100);
    
    // Set final message based on score
    if (percentage >= 80) {
        finalMessage.textContent = "Outstanding! You're a knowledge champion!";
    } else if (percentage >= 60) {
        finalMessage.textContent = "Great job! You have solid knowledge!";
    } else if (percentage >= 40) {
        finalMessage.textContent = "Good effort! Keep learning!";
    } else {
        finalMessage.textContent = "Nice try! There's room for improvement.";
    }
    
    // Set final score
    finalScore.textContent = `Your score: ${score} points (${percentage}%)`;
    
    // Save score to local storage
    saveScore();
    
    // Display previous scores
    displayPreviousScores();
    
    // Switch to results screen
    switchScreen(feedbackScreen, resultsScreen);
}

function saveScore() {
    // Get existing scores from local storage
    let scores = JSON.parse(localStorage.getItem('kbcScores')) || [];
    
    // Add new score
    scores.push({
        name: playerName,
        score: score,
        date: new Date().toLocaleDateString()
    });
    
    // Sort scores by highest first
    scores.sort((a, b) => b.score - a.score);
    
    // Keep only top 5 scores
    scores = scores.slice(0, 5);
    
    // Save back to local storage
    localStorage.setItem('kbcScores', JSON.stringify(scores));
}

function displayPreviousScores() {
    // Clear previous scores list
    previousScoresList.innerHTML = '';
    
    // Get scores from local storage
    const scores = JSON.parse(localStorage.getItem('kbcScores')) || [];
    
    // Display scores
    if (scores.length === 0) {
        previousScoresList.innerHTML = '<li>No previous scores</li>';
    } else {
        scores.forEach(scoreData => {
            const li = document.createElement('li');
            li.textContent = `${scoreData.name}: ${scoreData.score} points (${scoreData.date})`;
            previousScoresList.appendChild(li);
        });
    }
}

function resetGame() {
    switchScreen(resultsScreen, welcomeScreen);
}

// Lifeline Functions
function useFiftyFifty() {
    if (fiftyFiftyUsed) return;
    
    fiftyFiftyUsed = true;
    fiftyFiftyBtn.classList.add('used');
    
    const currentQuestion = selectedQuestions[currentQuestionIndex];
    const correctOptionIndex = currentQuestion.correctAnswer;
    
    // Get indices of incorrect options
    const incorrectIndices = [0, 1, 2, 3].filter(i => i !== correctOptionIndex);
    
    // Randomly select two incorrect options to hide
    const toHide = shuffleArray(incorrectIndices).slice(0, 2);
    
    // Disable the selected incorrect options
    toHide.forEach(index => {
        options[index].classList.add('disabled');
    });
}

function useAudiencePoll() {
    if (audiencePollUsed) return;
    
    audiencePollUsed = true;
    audiencePollBtn.classList.add('used');
    
    const currentQuestion = selectedQuestions[currentQuestionIndex];
    const correctOptionIndex = currentQuestion.correctAnswer;
    
    // Generate audience poll percentages
    // Correct answer gets 45-70%, others share the rest
    let percentages = [0, 0, 0, 0];
    
    // Correct answer percentage (45-70%)
    percentages[correctOptionIndex] = Math.floor(Math.random() * 26) + 45;
    
    // Distribute remaining percentage among incorrect options
    const remainingPercentage = 100 - percentages[correctOptionIndex];
    let allocated = 0;
    
    for (let i = 0; i < 4; i++) {
        if (i !== correctOptionIndex) {
            // For the last incorrect option, allocate all remaining percentage
            if (i === 3 || (i === 2 && correctOptionIndex === 3)) {
                percentages[i] = remainingPercentage - allocated;
            } else {
                // Random percentage for other incorrect options
                const maxAllocation = remainingPercentage - allocated - (3 - i - 1);
                percentages[i] = Math.floor(Math.random() * maxAllocation);
                allocated += percentages[i];
            }
        }
    }
    
    // Update poll bars and percentages
    pollBars.forEach((bar, index) => {
        bar.style.width = `${percentages[index]}%`;
        pollPercentages[index].textContent = `${percentages[index]}%`;
    });
    
    // Show audience poll modal
    openModal(audiencePollModal);
}

function usePhoneFriend() {
    if (phoneFriendUsed) return;
    
    phoneFriendUsed = true;
    phoneFriendBtn.classList.add('used');
    
    const currentQuestion = selectedQuestions[currentQuestionIndex];
    const correctOptionIndex = currentQuestion.correctAnswer;
    
    // 70% chance the friend knows the correct answer
    const friendKnows = Math.random() < 0.7;
    
    let message;
    if (friendKnows) {
        message = `I'm pretty sure the answer is ${String.fromCharCode(65 + correctOptionIndex)}. ${currentQuestion.options[correctOptionIndex]}.`;
        
        // Highlight the friend's suggestion
        options[correctOptionIndex].classList.add('friend-suggested');
    } else {
        // Friend doesn't know, gives a random guess
        const randomGuess = Math.floor(Math.random() * 4);
        message = `I'm not entirely sure, but I think it might be ${String.fromCharCode(65 + randomGuess)}. ${currentQuestion.options[randomGuess]}.`;
        
        // Highlight the friend's suggestion
        options[randomGuess].classList.add('friend-suggested');
    }
    
    // Simulate thinking time
    phoneFriendMessage.textContent = "Thinking...";
    openModal(phoneFriendModal);
    
    setTimeout(() => {
        phoneFriendMessage.textContent = message;
    }, 2000);
}

// Helper Functions
function switchScreen(fromScreen, toScreen) {
    fromScreen.classList.remove('active');
    toScreen.classList.add('active');
}

function openModal(modal) {
    modal.classList.add('active');
}

function closeModal(modal) {
    modal.classList.remove('active');
}

function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Confetti Animation
function createConfetti() {
    // Clear existing confetti
    confettiPieces.length = 0;
    
    // Create new confetti pieces
    for (let i = 0; i < 100; i++) {
        confettiPieces.push({
            x: Math.random() * confettiCanvas.width,
            y: -20,
            size: Math.random() * 10 + 5,
            color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
            speed: Math.random() * 3 + 2,
            angle: Math.random() * 2 - 1,
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 10 - 5
        });
    }
    
    // Start animation
    if (!confettiAnimation) {
        confettiAnimation = requestAnimationFrame(animateConfetti);
    }
}

let confettiAnimation;

function animateConfetti() {
    // Clear canvas
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    
    // Update and draw confetti
    let activePieces = false;
    
    confettiPieces.forEach(piece => {
        // Update position
        piece.y += piece.speed;
        piece.x += piece.angle;
        piece.rotation += piece.rotationSpeed;
        
        // Draw confetti
        ctx.save();
        ctx.translate(piece.x, piece.y);
        ctx.rotate((piece.rotation * Math.PI) / 180);
        ctx.fillStyle = piece.color;
        ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size);
        ctx.restore();
        
        // Check if piece is still active
        if (piece.y < confettiCanvas.height + 20) {
            activePieces = true;
        }
    });
    
    // Continue animation if there are active pieces
    if (activePieces) {
        confettiAnimation = requestAnimationFrame(animateConfetti);
    } else {
        cancelAnimationFrame(confettiAnimation);
        confettiAnimation = null;
    }
}

// Initialize the game
document.addEventListener('DOMContentLoaded', () => {
    // Adjust canvas size on load
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
});
