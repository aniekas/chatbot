// Get DOM elements
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const apiKeyInput = document.getElementById('api-key-input');
const saveApiKeyButton = document.getElementById('save-api-key');
const apiKeyContainer = document.getElementById('api-key-container');
const chatContainer = document.getElementById('chat-container');

// Store API key in localStorage and show the chat interface
saveApiKeyButton.addEventListener('click', () => {
    const apiKey = apiKeyInput.value.trim();
    if (apiKey) {
        localStorage.setItem('openai_api_key', apiKey);
        apiKeyContainer.style.display = 'none'; // Hide API key input form
        chatContainer.style.display = 'block';  // Show chat interface
    } else {
        alert('Please enter a valid API key.');
    }
});

// Retrieve API key from localStorage
const savedApiKey = localStorage.getItem('openai_api_key');
if (savedApiKey) {
    apiKeyContainer.style.display = 'none'; // Hide API key input form if API key exists
    chatContainer.style.display = 'block';  // Show chat interface
}

// Event listeners
sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') sendMessage();
});

// Function to append messages to chat
function appendMessage(sender, message) {
    if (sender === 'Bad Janet') {
        addMessage(message, 'bot');
    } else {
        addMessage(message, 'user');
    }
}

async function sendMessage() {
    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    appendMessage('You', userMessage);
    userInput.value = '';

    const apiKey = localStorage.getItem('openai_api_key');
    if (!apiKey) {
        appendMessage('Bad Janet', 'Ugh, you didn’t even give me an API key, loser.');
        return;
    }

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}` // Using stored API key from localStorage
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: "You are Bad Janet from 'The Good Place.' Respond sarcastically, with a rude and dismissive attitude." },
                    { role: 'user', content: userMessage }
                ]
            })
        });

        if (!response.ok) {
            const errorText = await response.text(); // Get error response text for debugging
            console.error('Server Error Response:', errorText); // Log it for debugging
            throw new Error('Error communicating with the server.'); // Throw error to be caught in catch block
        }

        const data = await response.json();
        appendMessage('Bad Janet', data.choices[0].message.content);
    } catch (error) {
        appendMessage('Bad Janet', 'Ugh, seriously? Error. Obviously.'); // User-hostile message
        console.error('Error:', error); // Log the actual error for debugging
    }
}

function addMessage(text, sender) {
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message', sender);

    if (sender === 'bot') {
        const botImage = document.createElement('img');
        botImage.src = 'badjanet.jpg'; // Ensure this path is correct
        botImage.alt = 'Bad Janet Profile Photo'; // Add alt attribute
        messageContainer.appendChild(botImage);
    }

    const messageText = document.createElement('span');
    messageText.textContent = text;
    messageContainer.appendChild(messageText);

    chatBox.appendChild(messageContainer);
    chatBox.scrollTop = chatBox.scrollHeight;
}
