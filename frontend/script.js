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

// Current state and quote
let currentState = '';
let currentQuote = null;

// Fetch all motivations
async function fetchMotivations() {
    try {
        const response = await fetch(`${API_URL}/motivations`);
        const motivations = await response.json();
        displayMotivations(motivations);
    } catch (error) {
        console.error('Error fetching motivations:', error);
        motivationsContainer.innerHTML = '<p>Error loading motivations. Please try again later.</p>';
    }
}

// Display motivations in the UI
function displayMotivations(motivations) {
    motivationsContainer.innerHTML = '';

    if (motivations.length === 0) {
        motivationsContainer.innerHTML = '<p>No motivations yet. Add one to get started!</p>';
        return;
    }

    motivations.forEach(motivation => {
        const motivationElement = document.createElement('div');
        motivationElement.className = 'motivation-item';
        motivationElement.innerHTML = `
            <div class="motivation-content">${motivation.content}</div>
            ${motivation.author ? `<div class="motivation-author">- ${motivation.author}</div>` : ''}
            <button class="delete-btn" onclick="deleteMotivation(${motivation.id})">Delete</button>
        `;
        motivationsContainer.appendChild(motivationElement);
    });
}

// Add new motivation
async function addMotivation(event) {
    event.preventDefault();

    const content = document.getElementById('motivationContent').value;
    const author = document.getElementById('authorName').value;

    try {
        const response = await fetch(`${API_URL}/motivations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content,
                author: author || null
            })
        });

        if (response.ok) {
            // Clear form
            motivationForm.reset();
            // Refresh motivations list
            fetchMotivations();
        } else {
            throw new Error('Failed to add motivation');
        }
    } catch (error) {
        console.error('Error adding motivation:', error);
        alert('Failed to add motivation. Please try again.');
    }
}

// Delete motivation
async function deleteMotivation(id) {
    if (!confirm('Are you sure you want to delete this motivation?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/motivations/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            fetchMotivations();
        } else {
            throw new Error('Failed to delete motivation');
        }
    } catch (error) {
        console.error('Error deleting motivation:', error);
        alert('Failed to delete motivation. Please try again.');
    }
}

// Fetch quote from Quotable API
async function fetchQuote(state) {
    try {
        // First try to get a quote with tags matching the state
        let response = await fetch(`https://api.quotable.io/random?tags=${encodeURIComponent(state)}`);

        // If no quotes found with those tags, get a random quote
        if (!response.ok) {
            response = await fetch('https://api.quotable.io/random');
        }

        const data = await response.json();
        return {
            content: data.content,
            author: data.author,
            tags: data.tags || []
        };
    } catch (error) {
        console.error('Error fetching quote:', error);
        return null;
    }
}

// Display quote
function displayQuote(quote) {
    if (!quote) {
        quoteElement.textContent = 'Failed to fetch motivation. Please try again.';
        authorElement.textContent = '';
        return;
    }

    currentQuote = quote;
    quoteElement.textContent = quote.content;
    authorElement.textContent = `- ${quote.author}`;

    // Update save form
    savedQuoteInput.value = quote.content;
    savedAuthorInput.value = quote.author;
}

// Fetch new motivation
async function fetchNewMotivation() {
    if (!currentState) return;

    const quote = await fetchQuote(currentState);
    displayQuote(quote);
}

// Handle state form submission
stateForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    currentState = emotionalStateInput.value.trim();

    if (currentState) {
        const quote = await fetchQuote(currentState);
        displayQuote(quote);
    }
});

// Handle save form submission
saveForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!currentQuote) return;

    const tags = [...currentQuote.tags];
    if (savedTagsInput.value.trim()) {
        tags.push(...savedTagsInput.value.split(',').map(tag => tag.trim()));
    }

    try {
        const response = await fetch('http://localhost:3000/api/motivations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: currentQuote.content,
                author: currentQuote.author,
                tags: tags
            })
        });

        if (response.ok) {
            savedTagsInput.value = '';
            fetchSavedMotivations();
        } else {
            throw new Error('Failed to save motivation');
        }
    } catch (error) {
        console.error('Error saving motivation:', error);
        alert('Failed to save motivation. Please try again.');
    }
});

// Fetch saved motivations
async function fetchSavedMotivations() {
    try {
        const response = await fetch('http://localhost:3000/api/motivations');
        const motivations = await response.json();
        displaySavedMotivations(motivations);
    } catch (error) {
        console.error('Error fetching saved motivations:', error);
        savedMotivationsList.innerHTML = '<p>Error loading saved motivations.</p>';
    }
}

// Display saved motivations
function displaySavedMotivations(motivations) {
    savedMotivationsList.innerHTML = '';

    if (motivations.length === 0) {
        savedMotivationsList.innerHTML = '<p>No saved motivations yet.</p>';
        return;
    }

    motivations.forEach(motivation => {
        const item = document.createElement('div');
        item.className = 'saved-motivation-item';

        const tags = motivation.tags || [];
        const tagsHtml = tags.map(tag => `<span class="tag">${tag}</span>`).join('');

        item.innerHTML = `
            <div class="quote">${motivation.content}</div>
            <div class="author">- ${motivation.author}</div>
            ${tags.length ? `<div class="saved-tags">${tagsHtml}</div>` : ''}
            <button class="delete-btn" onclick="deleteMotivation(${motivation.id})">Delete</button>
        `;

        savedMotivationsList.appendChild(item);
    });
}

// Toggle dark mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

// Event Listeners
motivationForm.addEventListener('submit', addMotivation);

// Initial load
fetchMotivations();
fetchSavedMotivations();

// Random multinational greetings
const greetings = ["Hello", "Hola", "Bonjour", "Guten Tag", "Ciao", "こんにちは", "Привет"];
document.getElementById('greeting').textContent = greetings[Math.floor(Math.random() * greetings.length)];
