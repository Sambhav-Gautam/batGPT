import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const nocturnalFacts = [
  "Bats are the only mammals capable of sustained flight.",
  "Owls can rotate their heads almost completely around.",
  "Nocturnal animals have enhanced senses to navigate in the dark.",
  "Many insects are attracted to moonlight and stars.",
  "The moon affects many nocturnal behaviors in animals."
];

function App() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [caveMode, setCaveMode] = useState(false);
  const [isNight, setIsNight] = useState(false);
  
  // Ref for the dummy element at the end of the messages list.
  const messagesEndRef = useRef(null);

  // Scroll to the dummy element whenever messages change.
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Check time on component mount
  useEffect(() => {
    const hour = new Date().getHours();
    // Define night time as between 6PM (18) and 6AM (6)
    if (hour >= 18 || hour < 6) {
      setIsNight(true);
      // If it's exactly 6 PM, greet with a nightly wisdom fact.
      if (hour === 18) {
        const randomFact = nocturnalFacts[Math.floor(Math.random() * nocturnalFacts.length)];
        setMessages(prev => [
          ...prev,
          { sender: "BatGPT", text: `Nightly Wisdom: ${randomFact}` }
        ]);
      }
    }
  }, []);
  
  // Handle sending a message from the user
  const handleSendMessage = () => {
    if (!userInput.trim()) return;
    
    // Add the user message to the conversation
    setMessages(prev => [...prev, { sender: "User", text: userInput }]);
    
    // Bot response logic:
    if (isNight) {
      const randomFact = nocturnalFacts[Math.floor(Math.random() * nocturnalFacts.length)];
      setMessages(prev => [
        ...prev,
        { sender: "BatGPT", text: `Nightly Wisdom: ${randomFact}` }
      ]);
    } else {
      setMessages(prev => [
        ...prev,
        { sender: "BatGPT", text: "I'm too sleepy to chat right now. Please come back at night!" }
      ]);
    }
    
    setUserInput("");
  };
  
  // Allow sending message on pressing Enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  // Clear all messages
  const clearChat = () => {
    setMessages([]);
  };
  
  return (
    <div className={`App ${caveMode ? "cave-mode" : ""}`}>
      <header className="App-header">
        <h1>BatGPT – The Nocturnal AI Assistant</h1>
        <div className="header-buttons">
          <button onClick={() => setCaveMode(!caveMode)}>
            {caveMode ? "Disable Cave Mode" : "Enable Cave Mode"}
          </button>
          <button onClick={clearChat}>
            Clear Chat
          </button>
        </div>
      </header>
      
      <main className="chat-container">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender === "BatGPT" ? "bot" : "user"}`}
          >
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
        {/* Dummy div to scroll into view */}
        <div ref={messagesEndRef} />
      </main>
      
      {isNight ? (
        <div className="input-container">
          <input 
            type="text" 
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      ) : (
        <div className="sleepy-message">
          <p>I'm too sleepy to chat right now. Please come back at night.</p>
        </div>
      )}
      
      <footer className="footer">
        <p>This is a fun and non-commercial project.</p>
      </footer>
    </div>
  );
}

export default App;
