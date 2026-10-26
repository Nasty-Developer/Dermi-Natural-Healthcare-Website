import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowUp, Bot, ChevronDown, RotateCcw, Sparkles, Trash2, X } from 'lucide-react';
import { getGlowAIResponse } from '@/lib/glowai-local';
import './glow-ai-chat.css';

type ChatRole = 'user' | 'assistant';
type ChatMessage = { id: string; role: ChatRole; content: string };

const welcomeMessage = "Hello, I'm GlowAI. I can help you find products and share the names, sizes, and ingredients listed on this site. I don't provide medical advice or personalized treatment plans.";
const quickActions = ['Build My Routine', 'Find a Product', 'Explain Ingredients', 'Acne Care', 'Brightening', 'Sunscreen'];
const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export function GlowAIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([{ id: 'welcome', role: 'assistant', content: welcomeMessage }]);
  const [draft, setDraft] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [retryText, setRetryText] = useState('');
  const [hasStarted, setHasStarted] = useState(false);
  const busyRef = useRef(false);
  const replySequenceRef = useRef(0);
  const messagesRef = useRef(messages);
  const scrollRef = useRef<HTMLDivElement>(null);
  const composerRef = useRef<HTMLTextAreaElement>(null);

  messagesRef.current = messages;

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized, isGenerating, error]);

  useEffect(() => {
    if (isOpen && !isMinimized) composerRef.current?.focus();
  }, [isOpen, isMinimized]);

  const requestReply = useCallback(async (userText: string, existingAssistantId?: string) => {
    if (busyRef.current) return;
    busyRef.current = true;
    setIsGenerating(true);
    setError('');
    setRetryText(userText);
    setHasStarted(true);
    const replySequence = ++replySequenceRef.current;
    const assistantId = existingAssistantId ?? makeId();
    if (!existingAssistantId) {
      setMessages((current) => [...current, { id: assistantId, role: 'assistant', content: '' }]);
    } else {
      setMessages((current) => current.map((message) => message.id === assistantId ? { ...message, content: '' } : message));
    }

    try {
      await new Promise<void>((resolve) => window.setTimeout(resolve, 180));
      if (replySequence !== replySequenceRef.current) return;
      const response = getGlowAIResponse(userText);
      setMessages((current) => current.map((message) => message.id === assistantId
        ? { ...message, content: response }
        : message));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'GlowAI could not reply just now. Please try again.');
    } finally {
      if (replySequence === replySequenceRef.current) {
        busyRef.current = false;
        setIsGenerating(false);
      }
    }
  }, []);

  const sendMessage = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed || busyRef.current) return;
    setDraft('');
    setError('');
    setHasStarted(true);
    const userMessage: ChatMessage = { id: makeId(), role: 'user', content: trimmed };
    const conversation = [...messagesRef.current, userMessage];
    messagesRef.current = conversation;
    setMessages(conversation);
    void requestReply(trimmed);
  }, [requestReply]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage(draft);
  };

  const retry = () => {
    if (!retryText || busyRef.current) return;
    const current = messagesRef.current;
    const lastAssistant = [...current].reverse().find((message) => message.role === 'assistant' && message.id !== 'welcome');
    void requestReply(retryText, lastAssistant?.id);
  };

  const clearChat = () => {
    replySequenceRef.current += 1;
    busyRef.current = false;
    setIsGenerating(false);
    setError('');
    setRetryText('');
    setDraft('');
    setHasStarted(false);
    const reset = [{ id: 'welcome', role: 'assistant' as const, content: welcomeMessage }];
    messagesRef.current = reset;
    setMessages(reset);
  };

  const closeChat = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  return (
    <div className="glowai-widget" data-testid="glowai-widget">
      {isOpen && !isMinimized && (
        <section className="glowai-panel" role="dialog" aria-label="GlowAI skincare assistant" aria-modal="false" data-testid="glowai-panel">
          <header className="glowai-header">
            <div className="glowai-brand-mark" aria-hidden="true"><Sparkles size={17} strokeWidth={1.7} /></div>
            <div className="glowai-heading">
              <strong>GlowAI</strong>
              <span><i /> Here to help you explore</span>
            </div>
            <div className="glowai-header-actions">
              <button className="glowai-icon-button" type="button" aria-label="Clear chat" title="Clear chat" onClick={clearChat} data-testid="glowai-clear-chat"><Trash2 size={16} /></button>
              <button className="glowai-icon-button" type="button" aria-label="Minimize GlowAI" title="Minimize" onClick={() => setIsMinimized(true)} data-testid="glowai-minimize"><ChevronDown size={19} /></button>
              <button className="glowai-icon-button" type="button" aria-label="Close GlowAI" title="Close" onClick={closeChat} data-testid="glowai-close"><X size={17} /></button>
            </div>
          </header>

          <div className="glowai-context-note"><span>DERMI NATURAL HEALTHCARE</span><span>GLETSY · NEUTOGLOW</span></div>
          <div className="glowai-messages" ref={scrollRef} role="log" aria-live="polite" aria-relevant="additions text" data-testid="glowai-messages">
            {messages.map((message) => (
              <div className={`glowai-message-row glowai-message-${message.role}`} key={message.id} data-testid={`glowai-message-${message.role}-${message.id}`}>
                {message.role === 'assistant' && <span className="glowai-avatar" aria-hidden="true"><Sparkles size={13} /></span>}
                <p className="glowai-bubble">{message.content}</p>
              </div>
            ))}
            {isGenerating && !messages[messages.length - 1]?.content && (
              <div className="glowai-message-row glowai-message-assistant" role="status" aria-label="GlowAI is typing" data-testid="glowai-typing">
                <span className="glowai-avatar" aria-hidden="true"><Sparkles size={13} /></span>
                <div className="glowai-typing-bubble"><i /><i /><i /></div>
              </div>
            )}
            {error && (
              <div className="glowai-error" role="alert" data-testid="glowai-error">
                <span>{error}</span>
                <button type="button" onClick={retry} disabled={isGenerating} data-testid="glowai-retry"><RotateCcw size={13} /> Try again</button>
              </div>
            )}
          </div>

          {!hasStarted && (
            <div className="glowai-quick-actions" aria-label="Suggested questions" data-testid="glowai-quick-actions">
              {quickActions.map((action) => (
                <button key={action} type="button" onClick={() => sendMessage(action)} disabled={isGenerating} data-testid={`glowai-action-${action.toLowerCase().replaceAll(' ', '-')}`}>{action}</button>
              ))}
            </div>
          )}

          <form className="glowai-composer" onSubmit={handleSubmit} data-testid="glowai-composer">
            <label className="glowai-sr-only" htmlFor="glowai-input">Ask GlowAI about the catalog</label>
            <textarea
              id="glowai-input"
              ref={composerRef}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  if (draft.trim() && !isGenerating) sendMessage(draft);
                }
              }}
              placeholder="Ask about products or ingredients…"
              rows={1}
              disabled={isGenerating}
              maxLength={1200}
              data-testid="glowai-input"
            />
            <button className="glowai-send" type="submit" aria-label="Send message" disabled={!draft.trim() || isGenerating} data-testid="glowai-send">
              <ArrowUp size={18} strokeWidth={2.2} />
            </button>
          </form>
          <footer className="glowai-footnote"><span><Bot size={12} /> Product information, thoughtfully explained</span><span>Not medical advice</span></footer>
        </section>
      )}

      {isOpen && isMinimized && (
        <div className="glowai-minimized" data-testid="glowai-minimized">
          <span className="glowai-minimized-icon"><Sparkles size={15} /></span>
          <span>GlowAI <small>Ready when you are</small></span>
          <button type="button" aria-label="Restore GlowAI" onClick={() => setIsMinimized(false)} data-testid="glowai-restore"><ChevronDown size={17} /></button>
          <button type="button" aria-label="Close GlowAI" onClick={closeChat} data-testid="glowai-minimized-close"><X size={16} /></button>
        </div>
      )}

      {!isOpen && (
        <button
          className="glowai-launcher"
          type="button"
          aria-label="Open GlowAI skincare assistant"
          aria-expanded={false}
          onClick={() => { setIsOpen(true); setIsMinimized(false); }}
          data-testid="glowai-launcher"
        >
          <Sparkles className="glowai-launcher-icon" size={21} strokeWidth={1.7} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

export default GlowAIChat;
