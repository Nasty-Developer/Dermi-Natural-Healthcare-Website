import { useEffect, useState } from 'react';
import { Check, Download } from 'lucide-react';

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function InstallAppButton() {
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [installMessage, setInstallMessage] = useState('');
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
    setInstalled(isStandalone);

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
      setInstallMessage('');
    };
    const handleAppInstalled = () => {
      setInstalled(true);
      setInstallPrompt(null);
      setInstallMessage('');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  async function handleInstallClick() {
    if (installed) return;
    if (!installPrompt) {
      setInstallMessage('One-tap installation is not available in this browser.');
      return;
    }

    try {
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setInstalled(true);
        setInstallMessage('');
      } else {
        setInstallMessage('The install prompt was dismissed.');
      }
    } catch (error) {
      console.error('Could not open the browser install prompt:', error);
      setInstallMessage('The browser could not open its install prompt.');
    } finally {
      setInstallPrompt(null);
    }
  }

  return (
    <div className="install-app-action">
      <button
        className="button-outline install-app-button"
        type="button"
        onClick={handleInstallClick}
        aria-describedby={installMessage ? 'install-app-status' : undefined}
        data-testid="button-install-app"
        disabled={installed}
      >
        {installed ? <Check aria-hidden="true" /> : <Download aria-hidden="true" />}
        {installed ? 'App installed' : 'Install our app'}
      </button>
      {installMessage && !installed && (
        <span className="install-app-status" id="install-app-status" role="status">
          {installMessage}
        </span>
      )}
    </div>
  );
}
