document.addEventListener('DOMContentLoaded', () => {

    // --- Configuración de Firebase ---
    // ¡AHORA CON TUS DATOS REALES!
    const firebaseConfig = {
        apiKey: "AIzaSyDnlihbVXzkiMcc-FHlPTsRAchJscZwM8I", // Tu clave real
        authDomain: "foro-futbol-1be89.firebaseapp.com",
        databaseURL: "https://foro-futbol-1be89-default-rtdb.firebaseio.com", // AÑADÍ ESTA LÍNEA, ES MUY IMPORTANTE
        projectId: "foro-futbol-1be89",
        storageBucket: "foro-futbol-1be89.firebasestorage.app", // Esto realmente es firebasestorage.app
        messagingSenderId: "713724178280",
        appId: "1:713724178280:web:73fe43ab11e50272e4b0dd"
    };

    // Inicializar Firebase
    firebase.initializeApp(firebaseConfig);
    const database = firebase.database();

    // --- Elementos del DOM ---
    const pantallaLogin = document.getElementById('pantalla-login');
    const pantallaChat = document.getElementById('pantalla-chat');
    const loginForm = document.getElementById('login-form');
    const clubSelect = document.getElementById('club-select');
    const usernameInput = document.getElementById('username-input');
    const clubChatTitle = document.getElementById('club-chat-title');
    const chatMessages = document.getElementById('chat-messages');
    const messageForm = document.getElementById('message-form');
    const messageInput = document.getElementById('message-input');
    const salirBtn = document.getElementById('salir-btn');

    // --- Estado de la aplicación ---
    let username = '';
    let selectedClub = '';
    let chatRef;

    // --- Lógica de la aplicación (sin cambios aquí) ---
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const chosenUsername = usernameInput.value.trim();
        const chosenClub = clubSelect.value;
        if (chosenUsername && chosenClub) {
            username = chosenUsername;
            selectedClub = chosenClub;
            const clubId = selectedClub.replace(/\s+/g, '-');
            chatRef = database.ref(`chats/${clubId}`);
            pantallaLogin.classList.add('hidden');
            pantallaChat.classList.remove('hidden');
            clubChatTitle.textContent = `Chat de Aficionados del ${selectedClub}`;
            listenForMessages();
        }
    });

    messageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const messageText = messageInput.value.trim();
        if (messageText && chatRef) {
            const newMessage = {
                sender: username,
                text: messageText,
                timestamp: firebase.database.ServerValue.TIMESTAMP
            };
            chatRef.push(newMessage);
            messageInput.value = '';
        }
    });

    salirBtn.addEventListener('click', () => {
        if (chatRef) {
            chatRef.off();
        }
        pantallaChat.classList.add('hidden');
        pantallaLogin.classList.remove('hidden');
        username = '';
        selectedClub = '';
        usernameInput.value = '';
        chatMessages.innerHTML = '';
    });

    function listenForMessages() {
        chatMessages.innerHTML = '';
        chatRef.on('child_added', (snapshot) => {
            const message = snapshot.val();
            if (message) {
                displayMessage(message.sender, message.text);
            }
        });
    }

    function displayMessage(sender, text) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        if (sender === username) {
            messageElement.classList.add('my-message');
        } else {
            messageElement.classList.add('other-message');
        }
        const senderElement = document.createElement('strong');
        senderElement.textContent = sender;
        const textElement = document.createElement('p');
        textElement.textContent = text;
        messageElement.appendChild(senderElement);
        messageElement.appendChild(textElement);
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});