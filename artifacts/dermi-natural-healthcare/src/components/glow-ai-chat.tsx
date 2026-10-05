import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowUp, Bot, ChevronDown, MessageCircle, RotateCcw, Sparkles, Trash2, X } from 'lucide-react';
import './glow-ai-chat.css';

type ChatRole = 'user' | 'assistant';
type ChatMessage = { id: string; role: ChatRole; content: string };
type StreamRecord = { content?: string; done?: boolean; error?: string };

const welcomeMessage = "Hi! 👋 I'm GlowAI, your skincare assistant. I can help you explore our products, understand ingredients, and build a simple skincare routine.";
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
  const abortRef = useRef<AbortController | null>(null);
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

  useEffect(() => () => {
    abortRef.current?.abort();
  }, []);

  const processStream = useCallback(async (response: Response, assistantId: string) => {
    if (!response.body) throw new Error('GlowAI could not start a reply. Please try again.');
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let finished = false;

    const applyRecord = (block: string) => {
      const lines = block.split(/\r?\n/);
      const eventName = lines.find((line) => line.startsWith('event:'))?.slice(6).trim();
      const data = lines.filter((line) => line.startsWith('data:')).map((line) => line.slice(5).trim()).join('\n');
      if (!data) return;
      let record: StreamRecord;
      try {
        record = JSON.parse(data) as StreamRecord;
      } catch {
        return;
      }
      if (eventName === 'error' || record.error) throw new Error(record.error || 'GlowAI ran into a problem. Please try again.');
      if (record.content) {
        setMessages((current) => current.map((message) => message.id === assistantId
          ? { ...message, content: message.content + record.content }
          : message));
      }
      if (record.done) finished = true;
    };

    try {
      while (!finished) {
        const { value, done } = await reader.read();
        buffer += decoder.decode(value, { stream: !done });
        const blocks = buffer.split(/\r?\n\r?\n/);
        buffer = blocks.pop() ?? '';
        for (const block of blocks) applyRecord(block);
        if (done) {
          if (buffer.trim()) applyRecord(buffer);
          break;
        }
      }
    } finally {
      reader.releaseLock();
    }
  }, []);

  const requestReply = useCallback(async (conversation: ChatMessage[], userText: string, existingAssistantId?: string) => {
    if (busyRef.current) return;
    busyRef.current = true;
    setIsGenerating(true);
    setError('');
    setRetryText(userText);
    setHasStarted(true);
    const assistantId = existingAssistantId ?? makeId();
    if (!existingAssistantId) {
      setMessages((current) => [...current, { id: assistantId, role: 'assistant', content: '' }]);
    } else {
      setMessages((current) => current.map((message) => message.id === assistantId ? { ...message, content: '' } : message));
    }

    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const history = conversation
        .filter((message) => message.id !== 'welcome' && message.id !== assistantId)
        .map(({ role, content }) => ({ role, content }));
      const response = await fetch('/api/glowai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
        body: JSON.stringify({ messages: history }),
        signal: controller.signal,
      });
      if (!response.ok) {
        let message = 'GlowAI could not reply just now. Please try again.';
        try {
          const body = await response.json() as { error?: string };
          if (body.error) message = body.error;
        } catch { /* Keep the helpful fallback for non-JSON responses. */ }
        throw new Error(message);
      }
      await processStream(response, assistantId);
    } catch (caught) {
      if (controller.signal.aborted) return;
      setError(caught instanceof Error ? caught.message : 'GlowAI could not reply just now. Please try again.');
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null;
        busyRef.current = false;
        setIsGenerating(false);
      }
    }
  }, [processStream]);

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
    void requestReply(conversation, trimmed);
  }, [requestReply]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage(draft);
  };

  const retry = () => {
    if (!retryText || busyRef.current) return;
    const current = messagesRef.current;
    const lastAssistant = [...current].reverse().find((message) => message.role === 'assistant' && message.id !== 'welcome');
    const conversation = current.filter((message) => message.id !== lastAssistant?.id);
    void requestReply(conversation, retryText, lastAssistant?.id);
  };

  const clearChat = () => {
    abortRef.current?.abort();
    abortRef.current = null;
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
          <span className="glowai-launcher-icon"><Sparkles size={20} strokeWidth={1.8} /></span>
          <span className="glowai-launcher-label">GlowAI</span>
          <MessageCircle className="glowai-launcher-chat-icon" size={14} />
        </button>
      )}
    </div>
  );
}

export default GlowAIChat;
