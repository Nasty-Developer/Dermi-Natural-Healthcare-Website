import { useEffect, useState } from 'react';
import { Check, Download, X } from 'lucide-react';

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function InstallAppButton() {
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [instructions, setInstructions] = useState('');
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
    setInstalled(isStandalone);

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    };
    const handleAppInstalled = () => {
      setInstalled(true);
      setInstallPrompt(null);
      setHelpOpen(false);
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
      setInstructions(
        /iphone|ipad|ipod/i.test(navigator.userAgent)
          ? 'Tap the Share button in Safari, then choose “Add to Home Screen.”'
          : 'Open your browser menu and choose “Install app” or “Add to Home Screen.”',
      );
      setHelpOpen((open) => !open);
      return;
    }

    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === 'accepted') setInstalled(true);
    setInstallPrompt(null);
  }

  return (
    <div className="install-app-action">
      <button
        className="button-outline install-app-button"
        type="button"
        onClick={handleInstallClick}
        aria-expanded={helpOpen}
        aria-controls="install-app-help"
        data-testid="button-install-app"
        disabled={installed}
      >
        {installed ? <Check aria-hidden="true" /> : <Download aria-hidden="true" />}
        {installed ? 'App installed' : 'Install our app'}
      </button>
      {helpOpen && !installed && (
        <div className="install-help" id="install-app-help" role="status">
          <button
            className="install-help-close"
            type="button"
            aria-label="Close install instructions"
            onClick={() => setHelpOpen(false)}
          >
            <X aria-hidden="true" />
          </button>
          <p>{instructions}</p>
        </div>
      )}
    </div>
  );
}
