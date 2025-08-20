/**
 * Wendell's conversation view component
 * Renders the chat interface with lore-appropriate styling
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WendellAI, ConversationContext, WendellResponse } from './AI';

interface WendellConversationProps {
  isOpen: boolean;
  onClose: () => void;
  onTrustChange?: (newLevel: number) => void;
  initialContext?: Partial<ConversationContext>;
}

export const WendellConversation: React.FC<WendellConversationProps> = ({
  isOpen,
  onClose,
  onTrustChange,
  initialContext = {}
}) => {
  const [messages, setMessages] = useState<Array<{
    text: string;
    sender: 'user' | 'wendell';
    tone?: WendellResponse['tone'];
  }>>([]);
  
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [context, setContext] = useState<ConversationContext>({
    knowledge_level: 'novice',
    trust_level: 3,
    locations_visited: [],
    items_encountered: [],
    previous_conversations: [],
    ...initialContext
  });
  
  const ai = useRef(new WendellAI());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Focus input when dialog opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      
      // Initial greeting if first conversation
      if (messages.length === 0) {
        setMessages([{
          text: "Ah, another seeker enters my library. Welcome. I am Wendell, keeper of this repository of knowledge. What brings you to these ancient halls?",
          sender: 'wendell',
          tone: 'welcoming'
        }]);
      }
    }
  }, [isOpen, messages.length]);
  
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const userMessage = inputValue.trim();
    setInputValue('');
    
    // Add user message
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    
    // Show typing indicator
    setIsTyping(true);
    
    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
    
    // Generate AI response
    const response = ai.current.generateResponse(userMessage, context);
    
    // Update context based on response
    const newContext = {
      ...context,
      trust_level: Math.max(0, Math.min(10, context.trust_level + response.trust_change)),
      previous_conversations: [...context.previous_conversations, userMessage]
    };
    
    setContext(newContext);
    onTrustChange?.(newContext.trust_level);
    
    setIsTyping(false);
    setMessages(prev => [...prev, {
      text: response.text,
      sender: 'wendell',
      tone: response.tone
    }]);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const getToneClass = (tone?: WendellResponse['tone']) => {
    const toneClasses = {
      welcoming: 'text-amber-100',
      questioning: 'text-blue-200',
      revealing: 'text-purple-200',
      warning: 'text-orange-200',
      cryptic: 'text-gray-300'
    };
    return toneClasses[tone || 'welcoming'];
  };
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
        role="dialog"
        aria-labelledby="wendell-conversation-title"
        aria-modal="true"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-b from-amber-900/95 to-amber-950/95 border border-amber-600/50 rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 border-b border-amber-600/30 flex items-center justify-between">
            <h2 id="wendell-conversation-title" className="text-xl font-semibold text-amber-100 flex items-center gap-2">
              📚 Conversation with Wendell
              <span className="text-sm font-normal text-amber-300">
                (Trust: {context.trust_level}/10)
              </span>
            </h2>
            <button
              onClick={onClose}
              className="text-amber-400 hover:text-amber-200 text-xl p-1 hover:bg-amber-800/30 rounded transition-colors"
              aria-label="Close conversation"
            >
              ×
            </button>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-blue-50'
                      : `bg-amber-800/60 ${getToneClass(message.tone)} border border-amber-600/30`
                  }`}
                >
                  {message.sender === 'wendell' && (
                    <div className="text-xs text-amber-400 mb-1">Wendell</div>
                  )}
                  <div className="text-sm leading-relaxed">{message.text}</div>
                </div>
              </motion.div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-amber-800/60 text-amber-200 border border-amber-600/30 px-4 py-2 rounded-lg">
                  <div className="text-xs text-amber-400 mb-1">Wendell</div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm">Thinking</span>
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <motion.div
                          key={i}
                          className="w-1 h-1 bg-amber-400 rounded-full"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: i * 0.2
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input */}
          <div className="p-4 border-t border-amber-600/30">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask Wendell about the tower's mysteries..."
                className="flex-1 px-3 py-2 bg-amber-900/50 border border-amber-600/50 rounded text-amber-100 placeholder-amber-400/60 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:bg-amber-800/50 disabled:cursor-not-allowed text-amber-50 rounded font-medium transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WendellConversation;
