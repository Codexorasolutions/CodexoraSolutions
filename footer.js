// SINGLE SHARED FOOTER — edit the HTML below and every page updates.
// No server/fetch needed: works when pages are opened directly (file://) too.
// Works from both the site root (index.html) and pages/*.html because it
// builds relative links based on where the current page lives.
document.addEventListener("DOMContentLoaded", () => {
  const mount = document.getElementById("site-footer");
  if (!mount) return;

  const inPages = location.pathname.includes("/pages/");
  const root = inPages ? "../" : "";       // path back up to the site root
  const pages = inPages ? "" : "pages/";   // path down into /pages

  mount.outerHTML = `
<footer>
  <div class="footer-top">
    <div class="footer-brand">
      <a href="${root}index.html" class="logo" aria-label="Codexora Solutions home">
        <img src="${root}logofoot.png" alt="Codexora Solutions">
      </a>
      <p>Affordable, modern websites for schools, colleges, shops, and local businesses across India.</p>
    </div>
    <div class="footer-col">
      <h4>Services</h4>
      <ul>
        <li><a href="${pages}services.html">School Websites</a></li>
        <li><a href="${pages}services.html">College Portals</a></li>
        <li><a href="${pages}services.html">Shop Pages</a></li>
        <li><a href="${pages}services.html">Maintenance</a></li>
        <li><a href="${pages}blog.html">Blogs</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Company</h4>
      <ul>
        <li><a href="${pages}about.html">About Us</a></li>
        <li><a href="${pages}faq.html">FAQs</a></li>
        <li><a href="${pages}pricing.html">Pricing</a></li>
        <li><a href="${pages}privacy-policy.html">Privacy Policy</a></li>
        <li><a href="${pages}terms-conditions.html">Terms &amp; Conditions</a></li>
        <li><a href="https://client-login-portal-gilt.vercel.app">Client Login</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Contact</h4>
      <div class="footer-social">
        <a href="https://wa.me/919628802518" target="_blank" rel="noopener" aria-label="Chat on WhatsApp" title="WhatsApp">
          <svg viewBox="0 0 24 24"><path d="M12 2C6.5 2 2 6.4 2 11.9c0 1.9.5 3.6 1.5 5.2L2 22l5.1-1.4c1.5.8 3.2 1.3 4.9 1.3 5.5 0 10-4.4 10-9.9S17.5 2 12 2Zm0 18c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-2.9-.2-.3A7.9 7.9 0 0 1 4 11.9C4 7.5 7.6 4 12 4s8 3.5 8 7.9-3.6 8.1-8 8.1Zm4.4-6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1-.7-.3-1.5-.8-2.1-1.5-.5-.5-.8-1-.9-1.2-.1-.2 0-.4.1-.5.1-.1.2-.3.4-.4.1-.1.2-.3.2-.4.1-.2 0-.3 0-.5-.1-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.2-1 .9-1 2.3 0 1.4 1 2.7 1.1 2.9.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 1.9-1.3.2-.6.2-1.2.2-1.3-.1-.1-.3-.2-.5-.3Z"/></svg>
        </a>
        <a href="mailto:CodexoraSolutions@gmail.com" aria-label="Email us" title="hello@codexorasolutions.in">
          <svg viewBox="0 0 24 24"><path d="M2 5.5A2.5 2.5 0 0 1 4.5 3h15A2.5 2.5 0 0 1 22 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 18.5v-13Zm2.2.3 7.4 6 7.2-6H4.2ZM20 7.4l-7.2 6a1 1 0 0 1-1.3 0L4 7.4v11.1c0 .3.2.5.5.5h15c.3 0 .5-.2.5-.5V7.4Z"/></svg>
        </a>
        <a href="https://www.instagram.com/codexorasolutions" target="_blank" rel="noopener" aria-label="Instagram" title="Instagram">
          <svg viewBox="0 0 24 24"><path d="M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8Zm4 3.5A4.5 4.5 0 1 1 7.5 13 4.5 4.5 0 0 1 12 8.5Zm0 2A2.5 2.5 0 1 0 14.5 13 2.5 2.5 0 0 0 12 10.5Zm4.8-3.6a1.05 1.05 0 1 1-1.05 1.05 1.05 1.05 0 0 1 1.05-1.05Z"/></svg>
        </a>
        <a href="https://www.linkedin.com/company/codexorasolutions" target="_blank" rel="noopener" aria-label="LinkedIn" title="LinkedIn">
          <svg viewBox="0 0 24 24"><path d="M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM3 9.9h4v10.6H3V9.9Zm7 0h3.8v1.45h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.55 4.78 5.87v6.23h-4v-5.52c0-1.32-.02-3-1.83-3-1.84 0-2.12 1.4-2.12 2.9v5.62h-4V9.9Z"/></svg>
        </a>
      </div>
    </div>
  </div>
  <div class="footer-bottom">
    <span>© 2026 Codexora Solutions. All rights reserved.</span>
    <span id="visitor-count" class="visitor-badge" title="Total site visits">
      <span class="visitor-dot"></span>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5c-7.6 0-11 6.2-11 7 0 .8 3.4 7 11 7s11-6.2 11-7c0-.8-3.4-7-11-7Zm0 11.5A4.5 4.5 0 1 1 12 7.5a4.5 4.5 0 0 1 0 9Zm0-7A2.5 2.5 0 1 0 12 14a2.5 2.5 0 0 0 0-4.5Z"/></svg>
      <span class="visitor-label">Visitors :</span>
      <span class="visitor-num">—</span>
    </span>
    <span>Made with ❤️ for small businesses</span>
  </div>
  <style>
    .visitor-badge {
      display: inline-flex; align-items: center; gap: .45rem;
      padding: .32rem .8rem .32rem .65rem;
      border-radius: 999px;
      background: linear-gradient(135deg, rgba(0,198,162,.16), rgba(0,198,162,.04));
      border: 1px solid rgba(0,198,162,.35);
      color: #00c6a2;
      font-size: .78rem; font-weight: 600; letter-spacing: .01em;
      line-height: 1;
    }
    .visitor-badge svg { width: 14px; height: 14px; fill: currentColor; flex: 0 0 auto; opacity: .9; }
    .visitor-badge .visitor-label { color: rgba(0,198,162,.85); font-weight: 500; }
    .visitor-badge .visitor-num { color: #fff; font-weight: 700; }
    .visitor-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: #00c6a2; box-shadow: 0 0 6px 1px rgba(0,198,162,.7);
      flex: 0 0 auto;
      animation: visitor-pulse 1.8s ease-in-out infinite;
    }
    @keyframes visitor-pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: .35; transform: scale(.7); }
    }
    @media (max-width: 640px) {
      .footer-bottom { gap: .8rem; }
    }
  </style>
</footer>`;

  // Fill in the visitor count (CountAPI — free, no-signup hit counter).
  // One shared key across every page = a running total of page loads
  // for the whole site.
  const counterNumEl = document.querySelector("#visitor-count .visitor-num");
  if (counterNumEl) {
    fetch("https://countapi.mileshilliard.com/api/v1/hit/codexorasolutions_in_total_visitors")
      .then((res) => res.json())
      .then((data) => {
        const n = parseInt(data.value, 10);
        counterNumEl.textContent = isNaN(n) ? data.value : n.toLocaleString();
      })
      .catch(() => {
        counterNumEl.textContent = "—";
      });
  }
});
