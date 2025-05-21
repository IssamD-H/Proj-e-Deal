/**
 * Proj-e-Deal - Messaging Interface JavaScript
 * Handles conversation list and chat functionality
 */

// DOM Elements
const conversationItems = document.querySelectorAll('.conversation-item');
const messagesList = document.querySelector('.chat-messages');
const messageInput = document.querySelector('.chat-input');
const sendButton = document.querySelector('.chat-send-btn');
const chatArea = document.querySelector('.chat-area');
const emptyChatState = document.querySelector('.empty-state');
const suggestionButtons = document.querySelectorAll('.chat-suggestion');

// Conversation data (would normally come from a backend)
const conversations = [
  {
    id: 1,
    name: 'Jean Dupont',
    project: 'Site e-commerce',
    lastMessage: 'Bonjour, je suis intéressé par votre projet de site e-commerce.',
    time: '10:32',
    date: new Date(),
    unread: true,
    online: false,
    messages: [
      {
        sender: 'them',
        content: 'Bonjour, je suis intéressé par votre projet de site e-commerce.',
        time: '10:32',
        date: new Date()
      }
    ]
  },
  {
    id: 2,
    name: 'Marie Lefevre',
    project: 'Application mobile',
    lastMessage: 'Est-ce que l\'application est compatible iOS et Android ?',
    time: 'Hier',
    date: new Date(Date.now() - 86400000),
    unread: false,
    online: true,
    messages: [
      {
        sender: 'them',
        content: 'Bonjour, j\'ai quelques questions concernant l\'application mobile.',
        time: '14:20',
        date: new Date(Date.now() - 90000000)
      },
      {
        sender: 'me',
        content: 'Bonjour Marie, je suis disponible pour répondre à vos questions.',
        time: '14:45',
        date: new Date(Date.now() - 89000000)
      },
      {
        sender: 'them',
        content: 'Merci ! Tout d\'abord, quel est le délai de livraison estimé ?',
        time: '14:47',
        date: new Date(Date.now() - 88500000)
      },
      {
        sender: 'me',
        content: 'Le délai de livraison est d\'environ 2 semaines après l\'achat.',
        time: '15:02',
        date: new Date(Date.now() - 87000000)
      },
      {
        sender: 'them',
        content: 'Est-ce que l\'application est compatible iOS et Android ?',
        time: 'Hier',
        date: new Date(Date.now() - 86400000)
      }
    ]
  },
  {
    id: 3,
    name: 'Pierre Martin',
    project: 'Blog WordPress',
    lastMessage: 'D\'accord, merci pour les informations !',
    time: 'Mar 18',
    date: new Date(Date.now() - 172800000),
    unread: false,
    online: false,
    messages: [
      {
        sender: 'them',
        content: 'Bonjour, je souhaite en savoir plus sur le blog WordPress.',
        time: '09:15',
        date: new Date(Date.now() - 180000000)
      },
      {
        sender: 'me',
        content: 'Bonjour Pierre, que souhaitez-vous savoir exactement ?',
        time: '09:30',
        date: new Date(Date.now() - 178000000)
      },
      {
        sender: 'them',
        content: 'Est-ce que le thème est personnalisable ?',
        time: '09:45',
        date: new Date(Date.now() - 175000000)
      },
      {
        sender: 'me',
        content: 'Oui, le thème est entièrement personnalisable via l\'interface WordPress ou en modifiant directement le code si vous préférez.',
        time: '10:00',
        date: new Date(Date.now() - 174000000)
      },
      {
        sender: 'them',
        content: 'D\'accord, merci pour les informations !',
        time: 'Mar 18',
        date: new Date(Date.now() - 172800000)
      }
    ]
  }
];

let activeConversation = null;

// Initialize messaging page
function initMessaging() {
  // Set up conversation switching
  initConversationSwitch();
  
  // Set up message sending
  initMessageSending();
  
  // Set up suggested responses
  initSuggestions();
  
  // Show empty state initially or first conversation
  if (emptyChatState && conversationItems.length === 0) {
    showEmptyState();
  } else if (conversationItems.length > 0) {
    // Auto-select first conversation
    conversationItems[0].click();
  }
}

// Handle conversation switching
function initConversationSwitch() {
  conversationItems.forEach(item => {
    item.addEventListener('click', () => {
      // Update active conversation
      conversationItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      
      // Remove unread status if present
      item.classList.remove('unread');
      
      // Get conversation ID
      const conversationId = parseInt(item.getAttribute('data-id'));
      activeConversation = conversations.find(c => c.id === conversationId);
      
      // Update chat area
      updateChatArea();
    });
  });
}

// Handle message sending
function initMessageSending() {
  if (!messageInput || !sendButton) return;
  
  // Send message on button click
  sendButton.addEventListener('click', sendMessage);
  
  // Send message on Enter key
  messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
}

// Send a new message
function sendMessage() {
  if (!messageInput.value.trim() || !activeConversation) return;
  
  const messageContent = messageInput.value.trim();
  const now = new Date();
  
  // Create new message object
  const newMessage = {
    sender: 'me',
    content: messageContent,
    time: formatTime(now),
    date: now
  };
  
  // Add to conversation
  activeConversation.messages.push(newMessage);
  
  // Update UI
  addMessageToUI(newMessage);
  
  // Clear input
  messageInput.value = '';
  
  // Scroll to bottom
  scrollToBottom();
  
  // Simulate a reply after a random delay (1-5 seconds)
  setTimeout(() => {
    simulateReply();
  }, 1000 + Math.random() * 4000);
}

// Add a message to the chat UI
function addMessageToUI(message) {
  if (!messagesList) return;
  
  // Check if we need a date divider
  const lastMessage = messagesList.querySelector('.message:last-child');
  const needsDateDivider = shouldAddDateDivider(message, lastMessage);
  
  if (needsDateDivider) {
    addDateDivider(message.date);
  }
  
  // Create message element
  const messageEl = document.createElement('div');
  messageEl.className = `message ${message.sender === 'me' ? 'sent' : 'received'}`;
  
  messageEl.innerHTML = `
    <div class="message-bubble">${message.content}</div>
    <div class="message-time">${message.time}</div>
  `;
  
  messagesList.appendChild(messageEl);
}

// Check if we need to add a date divider between messages
function shouldAddDateDivider(newMessage, lastMessageEl) {
  if (!lastMessageEl) return true;
  
  const lastDate = lastMessageEl.getAttribute('data-date');
  if (!lastDate) return true;
  
  const lastMessageDate = new Date(lastDate);
  const newMessageDate = new Date(newMessage.date);
  
  return !isSameDay(lastMessageDate, newMessageDate);
}

// Add a date divider to the chat
function addDateDivider(date) {
  const divider = document.createElement('div');
  divider.className = 'message-date-divider';
  divider.innerHTML = `<span>${formatDate(date)}</span>`;
  messagesList.appendChild(divider);
}

// Update the chat area with the active conversation
function updateChatArea() {
  if (!activeConversation || !messagesList || !chatArea) return;
  
  // Show chat area and hide empty state
  if (emptyChatState) {
    emptyChatState.style.display = 'none';
  }
  chatArea.style.display = 'flex';
  
  // Update user info in header
  const userNameEl = document.querySelector('.chat-user-name');
  const userStatusEl = document.querySelector('.chat-user-status');
  
  if (userNameEl) {
    userNameEl.textContent = activeConversation.name;
  }
  
  if (userStatusEl) {
    userStatusEl.textContent = activeConversation.online ? 'En ligne' : 'Hors ligne';
    userStatusEl.className = `chat-user-status ${activeConversation.online ? 'online' : ''}`;
  }
  
  // Clear messages
  messagesList.innerHTML = '';
  
  // Add messages with date dividers
  let lastDate = null;
  activeConversation.messages.forEach(message => {
    const messageDate = new Date(message.date);
    
    if (!lastDate || !isSameDay(lastDate, messageDate)) {
      addDateDivider(messageDate);
      lastDate = messageDate;
    }
    
    addMessageToUI(message);
  });
  
  // Scroll to bottom
  scrollToBottom();
}

// Show empty state when no conversation is selected
function showEmptyState() {
  if (!emptyChatState || !chatArea) return;
  
  emptyChatState.style.display = 'flex';
  chatArea.style.display = 'none';
}

// Simulate a reply from the conversation partner
function simulateReply() {
  if (!activeConversation) return;
  
  const replies = [
    'D\'accord, merci pour l\'information.',
    'Pouvez-vous m\'en dire plus sur ce point ?',
    'Je comprends, c\'est noté.',
    'Quand pourrions-nous planifier un appel pour en discuter ?',
    'C\'est exactement ce que je cherchais !',
    'Avez-vous d\'autres projets similaires disponibles ?'
  ];
  
  const randomReply = replies[Math.floor(Math.random() * replies.length)];
  const now = new Date();
  
  // Create reply object
  const reply = {
    sender: 'them',
    content: randomReply,
    time: formatTime(now),
    date: now
  };
  
  // Add to conversation
  activeConversation.messages.push(reply);
  
  // Update UI
  addMessageToUI(reply);
  
  // Update conversation list item
  updateConversationItem(activeConversation.id, randomReply, formatTime(now));
  
  // Scroll to bottom
  scrollToBottom();
}

// Update a conversation item in the list
function updateConversationItem(id, message, time) {
  const conversationItem = document.querySelector(`.conversation-item[data-id="${id}"]`);
  if (!conversationItem) return;
  
  const lastMessageEl = conversationItem.querySelector('.conversation-last-message');
  const timeEl = conversationItem.querySelector('.conversation-time');
  
  if (lastMessageEl) {
    lastMessageEl.textContent = message;
  }
  
  if (timeEl) {
    timeEl.textContent = time;
  }
}

// Initialize suggestion buttons
function initSuggestions() {
  suggestionButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (!messageInput) return;
      
      messageInput.value = button.textContent;
      messageInput.focus();
    });
  });
}

// Helper functions
function scrollToBottom() {
  if (messagesList) {
    messagesList.scrollTop = messagesList.scrollHeight;
  }
}

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDate(date) {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (isSameDay(date, today)) {
    return 'Aujourd\'hui';
  } else if (isSameDay(date, yesterday)) {
    return 'Hier';
  } else {
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  }
}

function isSameDay(date1, date2) {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

// Initialize messaging on page load
document.addEventListener('DOMContentLoaded', initMessaging);
