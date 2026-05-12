import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';

// Inline Telegram glyph (lucide-react doesn't ship Telegram).
const TelegramIcon = ({ className = 'h-4 w-4' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.7L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
  </svg>
);

// Public Telegram channel URL. Hardcoded so the link is always visible; an
// admin can override the displayed value via Settings → Platform → Telegram
// channel URL (the override is fetched from /api/settings/public below).
const DEFAULT_TELEGRAM_URL = 'https://t.me/planprep4u';

const Footer: React.FC = () => {
  const [telegramUrl, setTelegramUrl] = useState<string>(DEFAULT_TELEGRAM_URL);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get('/settings/public');
        if (!cancelled) {
          const url = res.data?.data?.telegram_channel_url;
          if (url && typeof url === 'string' && url.trim()) {
            setTelegramUrl(url.trim());
          }
        }
      } catch {
        // Settings unavailable — keep the hardcoded default URL.
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between text-sm text-gray-600 flex-wrap gap-2">
          <div>© {new Date().getFullYear()} PlanPrep4u. All rights reserved.</div>
          <div className="flex items-center flex-wrap gap-4">
            <a href="/privacy" className="hover:text-primary-600">Privacy Policy</a>
            <a href="/terms" className="hover:text-primary-600">Terms of Service</a>
            <a href="/help" className="hover:text-primary-600">Support</a>
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 font-medium"
              title="Join our Telegram channel"
            >
              <TelegramIcon className="h-4 w-4" />
              Telegram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
