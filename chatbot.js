// Get DOM elements
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

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

    try {
        const response = await fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: userMessage })
        });

        if (!response.ok) {
            const errorText = await response.text(); // Get error response text for debugging
            console.error('Server Error Response:', errorText); // Log it for debugging
            throw new Error('Error communicating with the server.'); // Throw error to be caught in catch block
        }

        const data = await response.json();
        appendMessage('Bad Janet', data.reply);
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
