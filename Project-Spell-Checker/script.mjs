// Import all the functions from common.mjs
import { 
    getDictionarySize, 
    checkerEngine, 
} from "./common.mjs";

// Custom dictionary for words added by the user
let customDictionary = [];

window.onload = function() {
    const userInput = document.getElementById("userInput");
    const checkButton = document.getElementById("checkButton");
    
    // Clear error messages when user types
    userInput.addEventListener("input", () => {
        clearErrorMessages();
    });
    
    // Check spelling when button is clicked
    checkButton.addEventListener("click", () => {
        performSpellCheck();
    });
    
    console.log(`Dictionary loaded with ${getDictionarySize()} words`);
}

function performSpellCheck() {
    const userInput = document.getElementById("userInput");
    const inputText = userInput.value.trim();
    
    // Clear previous error messages
    clearErrorMessages();
    
    if (!inputText) {
        return; // Don't check if input is empty
    }
    
    // Process the text
    const words = processText(inputText);
    const misspelledWords = checkerEngine(words);
    
    // Filter out words that are in custom dictionary or start with capital letter
    const actualMisspelledWords = misspelledWords.filter(word => {
        const originalWord = findOriginalWord(inputText, word);
        const startsWithCapital = originalWord && originalWord[0] === originalWord[0].toUpperCase() && originalWord[0] !== originalWord[0].toLowerCase();
        return !customDictionary.includes(word) && !startsWithCapital;
    });
    
    if (actualMisspelledWords.length > 0) {
        displayErrors(actualMisspelledWords);
    }
}

// Process text according to requirements
function processText(text) {
    const words = [];
    // Split by whitespace
    const tokens = text.split(/\s+/);
    
    tokens.forEach(token => {
        if (!token) return;
        
        // Handle hyphenated words - split and check each part
        if (token.includes("-")) {
            const parts = token.split("-");
            parts.forEach(part => {
                const cleaned = cleanWord(part);
                if (cleaned) words.push(cleaned);
            });
        } else {
            const cleaned = cleanWord(token);
            if (cleaned) words.push(cleaned);
        }
    });
    
    return words;
}

// Clean word by removing punctuation but keep the word
function cleanWord(word) {
    // Remove punctuation: ,.?!":;
    const cleaned = word.replace(/[,.?!":;]/g, '').toLowerCase();
    return cleaned;
}

// Find original word in text (to check capitalization)
function findOriginalWord(text, lowercaseWord) {
    const tokens = text.split(/\s+/);
    for (const token of tokens) {
        const cleaned = token.replace(/[,.?!":;-]/g, '');
        if (cleaned.toLowerCase() === lowercaseWord) {
            return cleaned;
        }
    }
    return null;
}

function displayErrors(misspelledWords) {
    const container = document.getElementById("UserInputContainer");
    
    // Create error message container if it doesn't exist
    let errorContainer = document.getElementById("errorContainer");
    if (!errorContainer) {
        errorContainer = document.createElement("div");
        errorContainer.id = "errorContainer";
        errorContainer.setAttribute("role", "alert");
        errorContainer.setAttribute("aria-live", "polite");
        container.appendChild(errorContainer);
    }
    
    // Create message
    const message = document.createElement("p");
    message.className = "error-message";
    message.textContent = "The following words are misspelled:";
    errorContainer.appendChild(message);
    
    // Create word list
    const wordList = document.createElement("div");
    wordList.className = "misspelled-words";
    
    misspelledWords.forEach(word => {
        const wordItem = document.createElement("div");
        wordItem.className = "misspelled-word-item";
        
        const wordSpan = document.createElement("span");
        wordSpan.className = "misspelled-word";
        wordSpan.textContent = word;
        
        const addButton = document.createElement("button");
        addButton.className = "add-to-dict-button";
        addButton.textContent = "Add to Dictionary";
        addButton.setAttribute("aria-label", `Add ${word} to dictionary`);
        addButton.onclick = () => addToDictionary(word);
        
        wordItem.appendChild(wordSpan);
        wordItem.appendChild(addButton);
        wordList.appendChild(wordItem);
    });
    
    errorContainer.appendChild(wordList);
}

function clearErrorMessages() {
    const errorContainer = document.getElementById("errorContainer");
    if (errorContainer) {
        errorContainer.remove();
    }
}

function addToDictionary(word) {
    // Add to custom dictionary
    if (!customDictionary.includes(word)) {
        customDictionary.push(word);
    }
    
    // Re-run spell check
    performSpellCheck();
}
