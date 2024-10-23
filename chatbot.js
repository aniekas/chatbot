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
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender === 'You' ? 'user' : 'bot');
    messageElement.textContent = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
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
        appendMessage('Bot', data.reply);
    } catch (error) {
        appendMessage('Bot', 'Oops! Something went wrong.'); // User-friendly message
        console.error('Error:', error); // Log the actual error for debugging
    }
}
