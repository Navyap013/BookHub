import React, { useState } from 'react';
import { FaComments, FaTimes, FaPaperPlane } from 'react-icons/fa';

const faqAnswers = [
  {
    keywords: ['register', 'sign up', 'account', 'create account'],
    answer:
      'To create an account, click on the Register button in the top-right corner, fill in your name, email, password, and (optionally) select Student with your class, then submit the form.',
  },
  {
    keywords: ['login', 'sign in'],
    answer:
      'To login, click on the Login button in the top-right corner, enter your registered email and password, and click Sign in.',
  },
  {
    keywords: ['order', 'place order', 'checkout', 'buy'],
    answer:
      'To place an order: 1) Browse books and click on a book, 2) Click Add to Cart, 3) Open the Cart page, 4) Click Proceed to Checkout, 5) Fill in your shipping details and confirm the order.',
  },
  {
    keywords: ['track', 'tracking', 'order status'],
    answer:
      'You can track your orders from the My Orders page. Go to the Orders page from the menu, click on an order, and you will see its status, tracking number (if available), and delivery details.',
  },
  {
    keywords: ['pre-kg', 'prekg', 'kids', 'children'],
    answer:
      'The Pre-KG Zone is a colorful, kid-friendly area with big buttons and picture-based books designed for very young learners. You can access it from the navigation bar or Home quick links.',
  },
  {
    keywords: ['student library', 'class', 'ncert', 'textbook'],
    answer:
      'The Student Library contains class-wise academic books from Pre-KG to Class 12. You can filter by class and subject to find the right textbooks and reference materials.',
  },
  {
    keywords: ['recommendation', 'recommended', 'personalized', 'suggest'],
    answer:
      'Recommendations are generated using your order history, favourites, student class (for student accounts), and overall popular trends. You can see them on the Home page under "Recommended for You" and on book detail pages under "You May Also Like".',
  },
  {
    keywords: ['payment', 'razorpay', 'pay', 'card', 'upi'],
    answer:
      'This demo uses Razorpay in test mode. On checkout, choose Razorpay as the payment method and follow the test payment flow. For real production use, you would configure live Razorpay keys in the backend .env file.',
  },
  {
    keywords: ['contact', 'support', 'help', 'email'],
    answer:
      'You can contact support using the Contact page in the footer. Fill out the form with your name, email, subject, and message, and we will get back to you.',
  },
  {
    keywords: ['admin', 'dashboard', 'manage books'],
    answer:
      'Admins can access the Admin Dashboard from the navbar (Admin link). From there, they can manage books, student books, and orders. To become an admin, you need to create an admin user via the backend script or by updating your role in the database.',
  },
];

const getBotReply = (text) => {
  const normalized = text.toLowerCase();

  if (!normalized || normalized.length < 2) {
    return "I'm here to help. You can ask me about registration, orders, student library, recommendations, Pre-KG zone, payments, or admin features.";
  }

  for (const item of faqAnswers) {
    if (item.keywords.some((kw) => normalized.includes(kw))) {
      return item.answer;
    }
  }

  if (normalized.includes('hi') || normalized.includes('hello')) {
    return 'Hello! 👋 How can I help you with BookHub 2.0 today? Try asking about orders, recommendations, or the student library.';
  }

  if (normalized.includes('thank')) {
    return "You're welcome! If you have any more questions, just ask.";
  }

  return "I couldn't find an exact answer to that. Try asking about:\n- How to register or login\n- How to place or track an order\n- What the Student Library or Pre-KG Zone is\n- How recommendations work\n- How to contact support";
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: 'bot',
      text: 'Hi! I am the BookHub Assistant. How can I help you today?',
    },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage = { from: 'user', text: trimmed };
    const botMessage = { from: 'bot', text: getBotReply(trimmed) };

    setMessages((prev) => [...prev, userMessage, botMessage]);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickQuestions = [
    'How do I place an order?',
    'What is the Student Library?',
    'How do recommendations work?',
    'Tell me about the Pre-KG Zone',
    'How do I contact support?',
  ];

  return (
    <>
      {/* Floating chat button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-primary-600 text-white shadow-lg hover:bg-primary-700 focus:outline-none"
      >
        {isOpen ? <FaTimes className="text-xl" /> : <FaComments className="text-xl" />}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-80 md:w-96 bg-white rounded-xl shadow-2xl flex flex-col">
          <div className="px-4 py-3 bg-primary-600 text-white rounded-t-xl flex items-center justify-between">
            <div>
              <p className="font-semibold">BookHub Assistant</p>
              <p className="text-xs text-primary-100">Ask me anything about using BookHub 2.0</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-primary-100 hover:text-white"
            >
              <FaTimes />
            </button>
          </div>

          <div className="flex-1 max-h-80 overflow-y-auto px-4 py-3 space-y-2 text-sm">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.from === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`px-3 py-2 rounded-lg max-w-[80%] whitespace-pre-line ${
                    msg.from === 'user'
                      ? 'bg-primary-600 text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="px-4 pb-2 space-y-2 border-t border-gray-200">
            <div className="flex flex-wrap gap-2 pt-2">
              {quickQuestions.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => {
                    setInput(q);
                    setTimeout(() => handleSend(), 50);
                  }}
                  className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200"
                >
                  {q}
                </button>
              ))}
            </div>
            <div className="flex items-center mb-2">
              <textarea
                rows="1"
                className="flex-1 resize-none border border-gray-300 rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="Type your question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                type="button"
                onClick={handleSend}
                className="bg-primary-600 text-white px-3 h-[40px] rounded-r-lg flex items-center justify-center hover:bg-primary-700"
              >
                <FaPaperPlane />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;


