async function fetchQuote() {
    try {
        const response = await fetch("https://your-backend-url/quote");
        const data = await response.json();
        document.getElementById("quote").textContent = data.quote;
    } catch (error) {
        document.getElementById("quote").textContent = "Error fetching quote.";
    }
}

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}

// Random multinational greetings
const greetings = ["Hello", "Hola", "Bonjour", "Guten Tag", "Ciao", "こんにちは", "Привет"];
document.getElementById("greeting").textContent = greetings[Math.floor(Math.random() * greetings.length)];
