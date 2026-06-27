import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, X, Maximize2, Minimize2, Copy, RefreshCw, Sparkles, Zap } from 'lucide-react';
import { callAIStreaming, callAI } from '../../services/aiAgent';
import ToolCard from './ToolCard';

const C = {
  bg:'#020C18', surface:'#060F1E', card:'#091828', elevated:'#0C2038',
  border:'rgba(0,190,255,0.12)', borderHi:'rgba(0,205,255,0.35)',
  cyan:'#00C8FF', orange:'#FF7A2E', green:'#00FF85',
  yellow:'#FFD600', red:'#FF4566', purple:'#A855F7',
  textPrimary:'#C8E4F4', textSecondary:'#3C6882', textMuted:'#1A3550'
};
const raj = { fontFamily: "'Rajdhani',sans-serif" };
const mono = { fontFamily: "'JetBrains Mono',monospace" };

// Very simple markdown parser
const parseMarkdown = (text) => {
  if (!text) return null;
  let parsed = text;
  // Bold
  parsed = parsed.replace(/\*\*(.*?)\*\*/g, '<strong style="color: #C8E4F4">$1</strong>');
  // Inline Code
  parsed = parsed.replace(/`(.*?)`/g, '<code style="background: rgba(0,200,255,0.1); padding: 2px 4px; border-radius: 4px; font-family: \'JetBrains Mono\', monospace; color: #00C8FF">$1</code>');
  // Headers
  parsed = parsed.replace(/### (.*?)\n/g, '<h3 style="font-family: \'Rajdhani\', sans-serif; color: #00C8FF; margin: 12px 0 6px 0; font-size: 16px">$1</h3>\n');
  // Bullet points
  parsed = parsed.replace(/^- (.*?)(\n|$)/gm, '<li style="margin-bottom: 4px; list-style-type: none"><span style="color:#A855F7; margin-right: 8px">•</span>$1</li>');
  
  return <div dangerouslySetInnerHTML={{ __html: parsed.replace(/\n/g, '<br/>') }} />;
};

export default function AIChat({ page, isOpen, onClose, isFullscreen, onToggleFullscreen }) {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('nexus_ai_messages');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [pipelineState, setPipelineState] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('nexus_ai_messages', JSON.stringify(messages.slice(-20)));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);
    setPipelineState('Analyzing');

    setMessages(prev => [...prev, { role: 'assistant', content: '', streaming: true }]);

    try {
      let currentText = '';
      await callAIStreaming(newMessages.map(m => ({ role: m.role, content: m.content })), page, null, (chunk) => {
        currentText += chunk;
        if (currentText.length > 50) setPipelineState('Planning');
        if (currentText.length > 150) setPipelineState('Validating');
        
        setMessages(prev => {
          const newArr = [...prev];
          newArr[newArr.length - 1].content = currentText;
          return newArr;
        });
      });
      
      setMessages(prev => {
        const newArr = [...prev];
        newArr[newArr.length - 1].streaming = false;
        return newArr;
      });
    } catch (err) {
      console.warn("Streaming failed, falling back to basic call", err);
      const res = await callAI(newMessages.map(m => ({ role: m.role, content: m.content })), page, null);
      setMessages(prev => {
        const newArr = [...prev];
        newArr[newArr.length - 1].content = res;
        newArr[newArr.length - 1].streaming = false;
        return newArr;
      });
    }

    setIsTyping(false);
    setPipelineState('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = () => {
    setMessages([]);
    localStorage.removeItem('nexus_ai_messages');
  };

  const wrapperStyle = isFullscreen ? {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(2,12,24,0.95)', backdropFilter: 'blur(20px)',
    zIndex: 100, display: 'flex', flexDirection: 'column'
  } : {
    position: 'absolute', bottom: '20px', right: '20px',
    width: '400px', height: '600px',
    background: 'rgba(6,15,30,0.9)', backdropFilter: 'blur(16px)',
    border: `1px solid ${C.purple}40`, borderRadius: '12px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.5), 0 0 30px rgba(168,85,247,0.1)',
    zIndex: 100, display: 'flex', flexDirection: 'column',
    overflow: 'hidden'
  };

  return (
    <div style={wrapperStyle} className="animate-fade-up">
      {/* Header */}
      <div style={{
        padding: '16px 20px', borderBottom: `1px solid ${C.purple}30`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: `linear-gradient(90deg, ${C.purple}10, transparent)`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px', background: `${C.purple}20`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 0 10px ${C.purple}40`
          }}>
            <Sparkles size={18} color={C.purple} />
          </div>
          <div>
            <div style={{ ...raj, fontSize: '18px', fontWeight: 700, color: C.textPrimary }}>NEXUS <span style={{ color: C.purple }}>AI</span></div>
            <div style={{ ...mono, fontSize: '10px', color: C.purple, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span className="status-dot" style={{ background: C.purple, width: '6px', height: '6px', animation: 'pulse 1.5s infinite' }}></span>
              ACTIVE ({page.toUpperCase()})
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={handleClear} style={{ background: 'none', border: 'none', color: C.textSecondary, cursor: 'pointer', padding: '4px' }}>
            <RefreshCw size={16} />
          </button>
          <button onClick={onToggleFullscreen} style={{ background: 'none', border: 'none', color: C.textSecondary, cursor: 'pointer', padding: '4px' }}>
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: C.textSecondary, cursor: 'pointer', padding: '4px' }}>
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {messages.length === 0 ? (
          <div style={{ margin: 'auto', textAlign: 'center', maxWidth: '300px' }}>
            <Bot size={48} color={C.purple} style={{ marginBottom: '16px', opacity: 0.8 }} />
            <div style={{ ...raj, fontSize: '20px', fontWeight: 600, color: C.textPrimary, marginBottom: '8px' }}>How can I assist?</div>
            <div style={{ ...mono, fontSize: '12px', color: C.textSecondary, lineHeight: 1.5 }}>
              I can analyze global routes, predict weather disruptions, and optimize swarm paths.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '24px' }}>
              <button onClick={() => setInput('Analyze current global risk factors')} className="btn-secondary" style={{ padding: '8px', fontSize: '13px' }}>Analyze global risk factors</button>
              <button onClick={() => setInput('/route from Shanghai to Rotterdam')} className="btn-secondary" style={{ padding: '8px', fontSize: '13px' }}>Optimize Shanghai → Rotterdam</button>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} style={{
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: isFullscreen ? '70%' : '85%',
              display: 'flex', gap: '12px',
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'
            }}>
              {msg.role === 'assistant' && (
                <div style={{
                  width: '28px', height: '28px', borderRadius: '6px', background: `${C.purple}20`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '4px'
                }}>
                  <Bot size={14} color={C.purple} />
                </div>
              )}
              <div style={{
                background: msg.role === 'user' ? `${C.cyan}15` : 'rgba(255,255,255,0.03)',
                border: `1px solid ${msg.role === 'user' ? `${C.cyan}40` : C.borderHi}`,
                padding: '12px 16px',
                borderRadius: '8px',
                borderTopRightRadius: msg.role === 'user' ? 0 : '8px',
                borderTopLeftRadius: msg.role === 'assistant' ? 0 : '8px',
                color: C.textPrimary,
                ...raj, fontSize: '15px', lineHeight: 1.5,
                position: 'relative',
                boxShadow: msg.role === 'user' ? `0 4px 12px ${C.cyan}10` : 'none'
              }}>
                {msg.role === 'assistant' ? parseMarkdown(msg.content) : msg.content}
                {msg.streaming && <span className="typing-dot" style={{ display: 'inline-block', marginLeft: '4px', background: C.purple }}></span>}
              </div>
            </div>
          ))
        )}
        
        {isTyping && pipelineState && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', alignSelf: 'flex-start', paddingLeft: '40px' }}>
            <div style={{ ...mono, fontSize: '10px', color: C.purple }}>{pipelineState}</div>
            <div style={{ display: 'flex', gap: '4px' }}>
              <span className="typing-dot" style={{ background: C.purple }}></span>
              <span className="typing-dot" style={{ background: C.purple, animationDelay: '0.2s' }}></span>
              <span className="typing-dot" style={{ background: C.purple, animationDelay: '0.4s' }}></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '16px 20px', borderTop: `1px solid ${C.border}` }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          background: 'rgba(0,0,0,0.2)', border: `1px solid ${C.borderHi}`,
          borderRadius: '8px', padding: '8px 12px',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
        }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Aero-Sea Nexus AI..."
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              color: C.textPrimary, ...raj, fontSize: '15px', resize: 'none', height: '24px',
              paddingTop: '2px'
            }}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            style={{
              background: input.trim() && !isTyping ? C.purple : 'rgba(255,255,255,0.1)',
              border: 'none', borderRadius: '6px', width: '32px', height: '32px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: input.trim() && !isTyping ? 'pointer' : 'default',
              transition: 'all 0.2s'
            }}
          >
            <Send size={14} color={input.trim() && !isTyping ? '#fff' : C.textSecondary} />
          </button>
        </div>
        <div style={{ ...mono, fontSize: '9px', color: C.textMuted, marginTop: '8px', textAlign: 'center' }}>
          Shift+Enter for newline. AI can make mistakes.
        </div>
      </div>
    </div>
  );
}
