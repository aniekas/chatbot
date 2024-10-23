const apiKey = // Replace with your OpenAI API key
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

// Event listeners for sending messages
sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (event) => {
   if (event.key === 'Enter') {
       sendMessage();
   }
});

// Function to append messages to the chat box
function appendMessage(sender, message) {
   const messageElement = document.createElement('div');
   messageElement.textContent = `${sender}: ${message}`;
   chatBox.appendChild(messageElement);
   chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
}

// Function to send the user's message
async function sendMessage() {
   const userMessage = userInput.value.trim();
   if (userMessage === '') return;

   appendMessage('You', userMessage);
   userInput.value = '';

   try {
       const response = await getChatbotResponse(userMessage);
       appendMessage('Bad Janet', response); // Use 'Bad Janet' as the chatbot's name
   } catch (error) {
       appendMessage('Bad Janet', 'Ugh, seriously? Error. Obviously.'); // Sarcastic error message
       console.error('Error fetching chatbot response:', error);
   }
}

// Function to fetch the chatbot response from OpenAI API
async function getChatbotResponse(message) {
   const response = await fetch('https://api.openai.com/v1/chat/completions', {
       method: 'POST',
       headers: {
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${apiKey}`
       },
       body: JSON.stringify({
           model: 'gpt-3.5-turbo',
           messages: [
               { 
                   role: 'system', 
                   content: "You are Bad Janet from 'The Good Place.' Respond sarcastically, with a rude and dismissive attitude." 
               },
               { role: 'user', content: message }
           ]
       })
   });

   // Check if the response is ok
   if (!response.ok) {
       const errorData = await response.json();
       console.error('Error response from API:', errorData);
       throw new Error(`HTTP error! Status: ${response.status}`);
   }

   const data = await response.json();
   return data.choices[0].message.content;
}
