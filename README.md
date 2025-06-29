# Proofly JS

**Self-hosted visitor & conversion tracker.**

Track page views, clicks & scrolls on your website — keep your tracking data **private**, store it **locally**, and share your live visitor proof with anyone!

---

## ✨ What is this?

**Proofly JS** lets you:

- 📊 Embed a simple tracker in **any website** (Next.js, Express.js, static HTML, etc.)
- 📡 Send tracking data to your **own Relay server**
- 📁 Store all visits in your **local folder** (`./proofly/visits.json`)
- 👀 Run a local dashboard at `http://localhost:4000` to watch visitors in real-time

No 3rd-party SaaS, no signups — **your site, your data**.

---

## 📦 1️⃣ Install the library

```bash
npm install proofly-js


⚙️ 2️⃣ Add the tracker to your site
➜ Example: Next.js

// pages/_app.tsx
import { useEffect } from 'react';
import { initProofly } from 'proofly-js';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    initProofly({
      siteId: 'YOUR_SITE_ID',
      relayUrl: 'https://your-relay-server.onrender.com',
    });
  }, []);

  return <Component {...pageProps} />;
}


➜ Example: Express.js
In your EJS or HTML template:

html
Copy
Edit
<script type="module">
  import { initProofly } from '/node_modules/proofly-js/index.js';

  initProofly({
    siteId: 'YOUR_SITE_ID',
    relayUrl: 'https://your-relay-server.onrender.com',
  });
</script>


➜ Example: Plain HTML

html
Copy
Edit
<script type="module">
  import { initProofly } from '/node_modules/proofly-js/index.js';

  initProofly({
    siteId: 'YOUR_SITE_ID',
    relayUrl: 'https://your-relay-server.onrender.com',
  });
</script>


Run this command in your project root:
✅ Step 1 — Run the CLI
npx proofly-init

✅ This will:

Prompt you to enter your siteId (for example: my-portfolio)

Auto-create a local-dashboard/ folder with a local Socket.IO + Express server

Auto-create a proofly/ folder with visits.json to store your visitor data locally

The siteId you enter here must match the siteId you use in your initProofly({ siteId, relayUrl }) snippet on your actual website — that’s how your local dashboard knows which site’s traffic to watch!

---

✅ Step 2 — Install & start dashboard

cd local-dashboard
npm install
npm start
Your dashboard will run at: http://localhost:4000

It connects to your Relay server and displays every visit in real-time.

🗂️ 5️⃣ Where your data lives
✅ Visits are saved in ./proofly/visits.json
✅ The local dashboard reads & updates this file
✅ You keep everything — no cloud database needed

⚡ Full usage example
import { initProofly } from 'proofly-js';

initProofly({
  siteId: 'my-portfolio',
  relayUrl: 'https://my-relay.onrender.com',
});
🗂️ Example project structure

my-project/
├── pages/_app.tsx
├── node_modules/
├── local-dashboard/     # created by CLI
├── proofly/visits.json  # auto created
└── ...


🧩 Available CLI commands

Command	Description
npx proofly-init	Creates local-dashboard/ and proofly/visits.json automatically



✅ Ready to go
1️⃣ Embed the tracker
2️⃣ Deploy the Relay server
3️⃣ Run your local dashboard
4️⃣ Show your visitors, keep your data private.


❤️ License

MIT — Self-host forever. No vendor lock-in.
Built for indie devs, freelancers, and privacy lovers.
