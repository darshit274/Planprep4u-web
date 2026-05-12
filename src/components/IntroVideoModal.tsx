import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { XMarkIcon, PlayCircleIcon } from '@heroicons/react/24/outline';
import { api } from '../services/api';

const SESSION_KEY = 'planprep4u_intro_video_dismissed';

// Decide how to render the video. Direct file URLs (.mp4/.webm/.ogg/.mov)
// need a <video> element — browsers download them when stuffed into an iframe.
// Hosted embeds (YouTube/Vimeo) want an <iframe>.
type Playback =
  | { kind: 'file'; src: string; mime: string }
  | { kind: 'iframe'; src: string };

function classifyVideoUrl(url: string): Playback {
  try {
    const u = new URL(url, window.location.origin);
    const pathname = u.pathname.toLowerCase();
    const extMatch = pathname.match(/\.([a-z0-9]+)(?:$|[?#])/);
    const ext = extMatch ? extMatch[1] : '';

    const directExtToMime: Record<string, string> = {
      mp4: 'video/mp4',
      m4v: 'video/x-m4v',
      webm: 'video/webm',
      ogg: 'video/ogg',
      ogv: 'video/ogg',
      mov: 'video/quicktime',
    };
    if (directExtToMime[ext]) {
      return { kind: 'file', src: u.toString(), mime: directExtToMime[ext] };
    }

    // YouTube watch / share → embed
    if (u.hostname === 'youtu.be') {
      return { kind: 'iframe', src: `https://www.youtube.com/embed/${u.pathname.replace(/^\//, '')}` };
    }
    if (u.hostname.endsWith('youtube.com')) {
      if (u.pathname === '/watch' && u.searchParams.get('v')) {
        return { kind: 'iframe', src: `https://www.youtube.com/embed/${u.searchParams.get('v')}` };
      }
      if (u.pathname.startsWith('/embed/')) {
        return { kind: 'iframe', src: u.toString() };
      }
    }

    // Fallback — try iframe; if the host serves a downloadable response the
    // browser will surface that. Most hosted players (Vimeo, Loom) work here.
    return { kind: 'iframe', src: u.toString() };
  } catch {
    return { kind: 'iframe', src: url };
  }
}

const IntroVideoModal: React.FC = () => {
  const navigate = useNavigate();
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Always show the modal on first visit, regardless of whether a video URL
    // has been configured. If no URL is set we show a placeholder card —
    // the client wanted the gate in place from day one.
    const flag = sessionStorage.getItem(SESSION_KEY);
    console.log('[intro-video] sessionStorage flag:', flag);
    if (flag === '1') return;
    setOpen(true);

    let cancelled = false;
    (async () => {
      try {
        const res = await api.get('/settings/public');
        if (cancelled) return;
        const url = res.data?.data?.signup_intro_video_url;
        if (url && typeof url === 'string' && url.trim()) {
          setVideoUrl(url.trim());
        }
      } catch {
        // Public settings unavailable — fall through to placeholder card.
      } finally {
        if (!cancelled) setSettingsLoaded(true);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (!open) return null;

  const dismiss = () => {
    sessionStorage.setItem(SESSION_KEY, '1');
    setOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-60" />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-4 sm:p-6">
          <button
            onClick={dismiss}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
            aria-label="Close"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>

          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
            What we offer
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Take a minute to see what PlanPrep4u gives you before you sign up.
          </p>

          <div className="aspect-video w-full overflow-hidden rounded-lg bg-black mb-4 flex items-center justify-center">
            {videoUrl ? (() => {
              const pb = classifyVideoUrl(videoUrl);
              if (pb.kind === 'file') {
                // Direct video file (e.g. an MP4 uploaded by the admin).
                // controls + autoPlay + muted so it actually starts in browsers
                // that block sound-on autoplay. playsInline keeps it inline on iOS.
                return (
                  <video
                    src={pb.src}
                    controls
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full"
                  >
                    Your browser does not support embedded video.
                  </video>
                );
              }
              return (
                <iframe
                  src={pb.src}
                  title="PlanPrep4u introduction"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              );
            })() : (
              // Placeholder card shown until an admin sets the real intro video
              // in Admin → Settings → Platform → Signup intro video URL.
              <div className="text-center text-white px-6">
                <PlayCircleIcon className="h-16 w-16 mx-auto mb-3 opacity-60" />
                <p className="text-lg font-semibold mb-1">Welcome to PlanPrep4u</p>
                <p className="text-sm opacity-80">
                  Test series, study materials, and analytics built for serious aspirants.
                </p>
                {settingsLoaded && (
                  <p className="text-xs opacity-50 mt-3">
                    (Intro video coming soon)
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => {
                sessionStorage.setItem(SESSION_KEY, '1');
                navigate('/');
              }}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
            >
              Not now
            </button>
            <button
              onClick={dismiss}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium"
            >
              I want to sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroVideoModal;
