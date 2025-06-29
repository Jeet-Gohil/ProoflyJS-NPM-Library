// index.js — This is what devs import when they do: import { initProofly } from 'proofly-js';

export function initProofly({ siteId, userId, relayUrl }) {
  if (!siteId) {
    console.warn('[Proofly] siteId is required.');
    return;
  }

  if (!relayUrl) {
    console.warn('[Proofly] relayUrl is required.');
    return;
  }

  // Dynamically create the Socket.IO script tag if needed
  const socketScript = document.createElement('script');
  socketScript.src = "https://cdn.socket.io/4.7.2/socket.io.min.js";
  socketScript.onload = () => {
    const socket = io('https://relay-server-zatg.onrender.com', { transports: ['websocket'] });

    // Generate or reuse session ID
    let sessionId = sessionStorage.getItem('proofly_session_id');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem('proofly_session_id', sessionId);
    }

    const emitPageView = () => {
      socket.emit('page_view', {
        userId: userId || null,
        siteId,
        sessionId,
        path: window.location.pathname,
        referrer: document.referrer,
        timestamp: new Date().toISOString(),
      });
      console.log('[Proofly] page_view sent:', window.location.pathname);
    };

    const emitClick = (e) => {
      socket.emit('heatmap_event', {
        userId,
        siteId,
        sessionId,
        path: window.location.pathname,
        event_type: 'click',
        x: e.clientX,
        y: e.clientY,
        timestamp: new Date().toISOString(),
      });
    };

    let maxScrollDepth = 0;
    const emitScroll = () => {
      const scrollTop = window.scrollY + window.innerHeight;
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollPercent = Math.round((scrollTop / scrollHeight) * 100);
      if (scrollPercent > maxScrollDepth) {
        maxScrollDepth = scrollPercent;
        socket.emit('heatmap_event', {
          userId,
          siteId,
          sessionId,
          path: window.location.pathname,
          event_type: 'scroll',
          scroll_depth: maxScrollDepth,
          timestamp: new Date().toISOString(),
        });
      }
    };

    socket.on('connect', () => {
      console.log('[Proofly] Connected:', socket.id);
      socket.emit('join_site', siteId);
      emitPageView();
      // SPA navigation hook
      const origPush = history.pushState;
      const origReplace = history.replaceState;
      const handleNav = () => {
        setTimeout(() => {
          emitPageView();
          maxScrollDepth = 0;
        }, 100);
      };
      history.pushState = function () { origPush.apply(this, arguments); handleNav(); };
      history.replaceState = function () { origReplace.apply(this, arguments); handleNav(); };
      window.addEventListener('popstate', handleNav);

      // Click & Scroll listeners
      document.addEventListener('click', emitClick);
      window.addEventListener('scroll', emitScroll);
    });

    socket.on('connect_error', (err) => {
      console.error('[Proofly] Socket connect error:', err);
    });
  };
  document.head.appendChild(socketScript);
}
