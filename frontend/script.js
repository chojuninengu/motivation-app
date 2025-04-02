const API_URL = 'http://localhost:3000/api';

// DOM Elements
const motivationForm = document.getElementById('motivationForm');
const motivationsContainer = document.getElementById('motivationsContainer');
const stateForm = document.getElementById('stateForm');
const saveForm = document.getElementById('saveForm');
const emotionalStateInput = document.getElementById('emotionalState');
const quoteElement = document.getElementById('quote');
const authorElement = document.getElementById('author');
const savedQuoteInput = document.getElementById('savedQuote');
const savedAuthorInput = document.getElementById('savedAuthor');
const savedTagsInput = document.getElementById('savedTags');
const savedMotivationsList = document.getElementById('savedMotivationsList');

// Current state
let currentState = '';

// Collection of motivational quotes
const motivationalQuotes = [
    {
        content: "The only way to do great work is to love what you do.",
        author: "Steve Jobs",
        tags: ["work", "passion", "success"]
    },
    {
        content: "Believe you can and you're halfway there.",
        author: "Theodore Roosevelt",
        tags: ["belief", "confidence", "success"]
    },
    {
        content: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        author: "Winston Churchill",
        tags: ["success", "failure", "perseverance"]
    },
    {
        content: "The future belongs to those who believe in the beauty of their dreams.",
        author: "Eleanor Roosevelt",
        tags: ["dreams", "future", "belief"]
    },
    {
        content: "Don't watch the clock; do what it does. Keep going.",
        author: "Sam Levenson",
        tags: ["perseverance", "time", "motivation"]
    },
    {
        content: "The only limit to our realization of tomorrow is our doubts of today.",
        author: "Franklin D. Roosevelt",
        tags: ["doubt", "future", "belief"]
    },
    {
        content: "You are never too old to set another goal or to dream a new dream.",
        author: "C.S. Lewis",
        tags: ["dreams", "goals", "age"]
    },
    {
        content: "The way to get started is to quit talking and begin doing.",
        author: "Walt Disney",
        tags: ["action", "start", "motivation"]
    },
    {
        content: "It does not matter how slowly you go as long as you do not stop.",
        author: "Confucius",
        tags: ["perseverance", "progress", "motivation"]
    },
    {
        content: "You miss 100% of the shots you don't take.",
        author: "Wayne Gretzky",
        tags: ["opportunity", "action", "success"]
    },
    {
        content: "The only person you are destined to become is the person you decide to be.",
        author: "Ralph Waldo Emerson",
        tags: ["destiny", "choice", "self-improvement"]
    },
    {
        content: "Everything you've ever wanted is on the other side of fear.",
        author: "George Addair",
        tags: ["fear", "courage", "success"]
    },
    {
        content: "Success is walking from failure to failure with no loss of enthusiasm.",
        author: "Winston Churchill",
        tags: ["success", "failure", "enthusiasm"]
    },
    {
        content: "The mind is everything. What you think you become.",
        author: "Buddha",
        tags: ["mindset", "thoughts", "self-improvement"]
    },
    {
        content: "The best time to plant a tree was 20 years ago. The second best time is now.",
        author: "Chinese Proverb",
        tags: ["time", "action", "opportunity"]
    }
];

// Get a random quote
function getRandomQuote(state = '') {
    // If state is provided, filter quotes by matching tags
    let filteredQuotes = motivationalQuotes;
    if (state) {
        const stateLower = state.toLowerCase();
        filteredQuotes = motivationalQuotes.filter(quote =>
            quote.tags.some(tag => tag.toLowerCase().includes(stateLower))
        );
    }

    // If no quotes match the state, use all quotes
    if (filteredQuotes.length === 0) {
        filteredQuotes = motivationalQuotes;
    }

    // Return a random quote from the filtered list
    return filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
}

// Display quote
function displayQuote(quote) {
    if (!quote) {
        quoteElement.textContent = 'Failed to fetch motivation. Please try again.';
        authorElement.textContent = '';
        return;
    }

    quoteElement.textContent = quote.content;
    authorElement.textContent = `- ${quote.author}`;
}

// Fetch new motivation
function fetchNewMotivation() {
    console.log('Fetching new motivation for state:', currentState);
    const quote = getRandomQuote(currentState);
    displayQuote(quote);
}

// Handle state form submission
stateForm.addEventListener('submit', (e) => {
    e.preventDefault();
    currentState = emotionalStateInput.value.trim();
    console.log('Form submitted with state:', currentState);

    fetchNewMotivation();
});

// Toggle dark mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

// Random multinational greetings
const greetings = ["Hello", "Hola", "Bonjour", "Guten Tag", "Ciao", "こんにちは", "Привет"];
document.getElementById('greeting').textContent = greetings[Math.floor(Math.random() * greetings.length)];

// Initial quote fetch
fetchNewMotivation();
