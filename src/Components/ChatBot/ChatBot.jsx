import React, { useState, useRef, useEffect } from 'react';
import './ChatBot.css';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: 'Hello! I\'m your ForexCard assistant. How can I help you today?'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { type: 'user', content: inputMessage }]);
    setInputMessage('');
    
    // Show typing indicator
    setIsTyping(true);
    
    // Simulate bot response (replace with actual API call later)
    setTimeout(() => {
      const botResponse = getBotResponse(inputMessage);
      setIsTyping(false);
      setMessages(prev => [...prev, { type: 'bot', content: botResponse }]);
    }, 1500);
  };

  const getBotResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Registration related queries
    if (lowerMessage.includes('register') || lowerMessage.includes('sign up') || lowerMessage.includes('create account')) {
      return 'To register for a ForexCard account:\n\n1. Click the "Register" button on the homepage\n2. Fill in your personal details\n3. Provide valid identification documents\n4. Set up your security credentials\n5. Verify your email address\n\nOnce registered, you can apply for a ForexCard.';
    }

    // Login related queries
    if (lowerMessage.includes('login') || lowerMessage.includes('sign in') || lowerMessage.includes('log in')) {
      return 'To login to your ForexCard account:\n\n1. Click the "Login" button on the homepage\n2. Enter your registered email\n3. Enter your password\n4. Click "Login"\n\nIf you forgot your password, use the "Forgot Password" link.';
    }

    // Card application queries
    if (lowerMessage.includes('apply') || lowerMessage.includes('get card') || lowerMessage.includes('new card')) {
      return 'To apply for a ForexCard:\n\n1. Login to your account\n2. Go to "Apply for Card" section\n3. Fill in the application form\n4. Upload required documents\n5. Submit for approval\n\nYour application will be reviewed within 24-48 hours.';
    }

    // Card activation queries
    if (lowerMessage.includes('activate') || lowerMessage.includes('activate card')) {
      return 'To activate your ForexCard:\n\n1. Login to your account\n2. Go to "My Card" section\n3. Click on "Activate Card"\n4. Follow the activation steps\n5. Set your PIN\n\nYour card will be ready to use after activation.';
    }

    // Card blocking queries
    if (lowerMessage.includes('block') || lowerMessage.includes('block card')) {
      return 'To block your ForexCard:\n\n1. Login to your account\n2. Go to "My Card" section\n3. Click on "Block Card"\n4. Confirm the action\n\nYou can unblock your card later if needed.';
    }

    // Transaction related queries
    if (lowerMessage.includes('transaction') || lowerMessage.includes('transfer') || lowerMessage.includes('send money')) {
      return 'To make a transaction:\n\n1. Login to your account\n2. Go to "Payment" section\n3. Select transaction type\n4. Enter recipient details\n5. Enter amount\n6. Confirm transaction\n\nYou can view all transactions in the "Transactions" section.';
    }

    // Balance checking queries
    if (lowerMessage.includes('balance') || lowerMessage.includes('check balance') || lowerMessage.includes('how much')) {
      return 'To check your balance:\n\n1. Login to your account\n2. View balance on dashboard\n3. Or go to "My Cards" section\n\nYou can also check transaction history for detailed balance movements.';
    }

    // Help or general queries
    if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
      return 'I can help you with:\n\n- Registration and Login\n- Card Application\n- Card Activation/Blocking\n- Making Transactions\n- Checking Balance\n- Transaction History\n- Account Settings\n\nWhat would you like to know more about?';
    }

    // Greeting queries
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return 'Hello! How can I assist you with your forex card today? You can ask me about:\n\n- Registration\n- Login\n- Card Operations\n- Transactions\n- Balance\n- Or any other card-related queries';
    }

    // Default response for unknown queries
    return 'I\'m not sure I understand. Could you please rephrase your question? I can help you with:\n\n- How to register\n- How to login\n- How to apply for a card\n- How to activate/block your card\n- How to make transactions\n- How to check your balance\n\nWhat would you like to know?';
  };

  return (
    <div className="chatbot-container">
      {!isOpen && (
        <button className="chatbot-button" onClick={() => setIsOpen(true)}>
          <i className="bi bi-chat-dots"></i>
        </button>
      )}
      
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>
              <i className="bi bi-robot"></i>
              ForexCard Assistant
            </h3>
            <button className="close-button" onClick={() => setIsOpen(false)}>
              <i className="bi bi-x"></i>
            </button>
          </div>
          
          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.type}`}>
                {message.type === 'bot' && (
                  <div className="bot-avatar">
                    <i className="bi bi-robot"></i>
                  </div>
                )}
                <div className="message-content">
                  {message.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="message bot">
                <div className="bot-avatar">
                  <i className="bi bi-robot"></i>
                </div>
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <form className="chatbot-input" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <button type="submit">
              <i className="bi bi-send"></i>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot; 