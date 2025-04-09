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

// Mapping of emotional states to Quotable API tags
const emotionToTags = {
    'depressed': ['depression', 'hope', 'inspiration'],
    'sad': ['sadness', 'hope', 'inspiration'],
    'anxious': ['anxiety', 'courage', 'strength'],
    'stressed': ['stress', 'peace', 'calm'],
    'angry': ['anger', 'peace', 'forgiveness'],
    'tired': ['exhaustion', 'perseverance', 'strength'],
    'happy': ['happiness', 'joy', 'success'],
    'confident': ['confidence', 'success', 'strength'],
    'motivated': ['motivation', 'success', 'inspiration'],
    'work': ['work', 'success', 'perseverance'],
    'study': ['learning', 'wisdom', 'success'],
    'love': ['love', 'relationships', 'happiness'],
    'fear': ['fear', 'courage', 'strength'],
    'dreams': ['dreams', 'future', 'success'],
    'success': ['success', 'achievement', 'motivation']
};

// Get a random quote from Quotable API
async function getRandomQuote(state = '') {
    try {
        let url = 'https://api.quotable.io/random';
        
        // If state is provided and we have matching tags, use them
        if (state && emotionToTags[state.toLowerCase()]) {
            const tags = emotionToTags[state.toLowerCase()];
            url = `https://api.quotable.io/random?tags=${tags.join('|')}`;
        }
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch quote');
        }
        
        const data = await response.json();
        return {
            content: data.content,
            author: data.author
        };
    } catch (error) {
        console.error('Error fetching quote:', error);
        // Return a fallback quote if the API fails
        return {
            content: "Every day is a new opportunity to grow and learn. Keep moving forward!",
            author: "Anonymous"
        };
    }
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
async function fetchNewMotivation() {
    console.log('Fetching new motivation for state:', currentState);
    const quote = await getRandomQuote(currentState);
    displayQuote(quote);
}

// Handle state form submission
stateForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    currentState = emotionalStateInput.value.trim().toLowerCase();
    console.log('Form submitted with state:', currentState);
    
    await fetchNewMotivation();
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
