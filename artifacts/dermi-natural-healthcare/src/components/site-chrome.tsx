import { useEffect, useRef, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { useLocation } from 'wouter';

/** Keyboard escape hatch at the top of the document. */
export function SkipLink() {
  return (
    <a className="skip-link" href="#main-content">
      Skip to content
    </a>
  );
}

/** Hairline reading-progress indicator pinned under the sticky header. */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      const value = scrollable > 40 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
      setProgress(value);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="scroll-progress" aria-hidden="true">
      <span style={{ transform: `scaleX(${progress.toFixed(4)})` }} />
    </div>
  );
}

/** Small "back to top" control, kept clear of the floating chat buttons. */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 1400);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      type="button"
      className={`back-to-top${visible ? ' is-visible' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
      data-testid="button-back-to-top"
    >
      <ArrowUp size={16} aria-hidden="true" />
      <span>Top</span>
    </button>
  );
}

/** Copy-to-clipboard helper used by the product share control. */
export function useCopyLink() {
  const [state, setState] = useState<'idle' | 'copied' | 'error'>('idle');
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  async function copy(text: string) {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const area = document.createElement('textarea');
        area.value = text;
        area.setAttribute('readonly', '');
        area.style.position = 'fixed';
        area.style.opacity = '0';
        document.body.appendChild(area);
        area.select();
        document.execCommand('copy');
        document.body.removeChild(area);
      }
      setState('copied');
    } catch {
      setState('error');
    }
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState('idle'), 2200);
  }

  return { state, copy };
}

/**
 * On a desktop browser tel: and mailto: often do nothing at all, which reads as
 * a dead button. Every phone and email link now also copies its value and shows
 * a short confirmation, while phones keep the native dialer / mail app.
 */
export function ContactLinkFallback() {
  const [toast, setToast] = useState('');
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    const onClick = async (event: MouseEvent) => {
      const target = (event.target as HTMLElement | null)?.closest?.('a[href^="tel:"], a[href^="mailto:"]') as HTMLAnchorElement | null;
      if (!target) return;
      const href = target.getAttribute('href') || '';
      const isMail = href.startsWith('mailto:');
      const value = href.replace(/^(mailto:|tel:)/, '').split('?')[0];
      if (!value) return;

      let copied = false;
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(value);
          copied = true;
        }
      } catch {
        copied = false;
      }
      setToast(copied ? `${isMail ? 'Email' : 'Phone'} copied: ${value}` : `${isMail ? 'Email' : 'Phone'}: ${value}`);
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setToast(''), 2600);
    };

    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('click', onClick);
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  return (
    <div className={`contact-toast${toast ? ' is-visible' : ''}`} role="status" aria-live="polite" data-testid="contact-toast">
      {toast}
    </div>
  );
}

/**
 * In-page anchor links used to land in the wrong place (the FAQ link overshot by
 * hundreds of pixels once late-loading imagery shifted the page). Every hash link
 * is now handled here: scroll to the target with the sticky header offset, then
 * re-aim twice as the layout settles.
 */
export function InPageAnchors() {
  const [location] = useLocation();

  useEffect(() => {
    const headerOffset = () => {
      const header = document.querySelector<HTMLElement>('.site-header');
      return (header?.getBoundingClientRect().height ?? 82) + 16;
    };

    const aim = (id: string, smooth: boolean) => {
      const el = document.getElementById(id);
      if (!el) return false;
      const target = () => Math.max(0, el.getBoundingClientRect().top + window.scrollY - headerOffset());
      window.scrollTo({ top: target(), behavior: smooth ? 'smooth' : 'auto' });
      window.setTimeout(() => window.scrollTo({ top: target(), behavior: 'auto' }), 450);
      window.setTimeout(() => window.scrollTo({ top: target(), behavior: 'auto' }), 1200);
      return true;
    };

    const onClick = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as HTMLElement | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute('href') || '';
      const hashIndex = href.indexOf('#');
      if (hashIndex < 0) return;
      const id = href.slice(hashIndex + 1);
      if (!id || id === 'main-content') return;
      const path = (href.slice(0, hashIndex) || window.location.pathname).replace(/\/$/, '') || '/';
      const here = window.location.pathname.replace(/\/$/, '') || '/';
      if (path !== here) return; // other page: the router handles it, the effect below aims
      if (!document.getElementById(id)) return;
      event.preventDefault();
      event.stopPropagation();
      window.history.replaceState(null, '', `#${id}`);
      aim(id, true);
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  useEffect(() => {
    if (window.location.hash.length < 2) return;
    const id = window.location.hash.slice(1);
    const el = document.getElementById(id);
    if (!el) return;
    const offset = (document.querySelector<HTMLElement>('.site-header')?.getBoundingClientRect().height ?? 82) + 16;
    const go = () => window.scrollTo({ top: Math.max(0, el.getBoundingClientRect().top + window.scrollY - offset), behavior: 'auto' });
    const first = window.setTimeout(go, 260);
    const second = window.setTimeout(go, 1100);
    return () => { window.clearTimeout(first); window.clearTimeout(second); };
  }, [location]);

  return null;
}
