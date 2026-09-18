// ============================================================
// ENTRY OFFER POPUP
// Shows a popup with your current active offer shortly after
// someone lands on the site. Pulls the offer straight from
// blog-posts.js — nothing to duplicate or keep in sync.
//
// - Automatically shows the newest offer whose "expires" date
//   (if any) hasn't passed yet.
// - If there's no active offer in blog-posts.js, nothing shows.
// - Once dismissed, it won't show again for POPUP_COOLDOWN_HOURS
//   (per browser), so returning visitors aren't nagged.
// - To change WHEN it shows or how long the cooldown is, edit
//   the two constants below. Everything else (title, text,
//   expiry date) comes from blog-posts.js.
// ============================================================

const POPUP_DELAY_MS = 1500;      // wait time before popup appears
const POPUP_COOLDOWN_HOURS = 20;  // don't re-show for this many hours after dismissal

(function () {
  if (typeof BLOG_POSTS === "undefined") return;

  function todayISO() {
    return new Date().toISOString().slice(0, 10);
  }

  function activeOffer() {
    const today = todayISO();
    return BLOG_POSTS
      .filter(p => p.category === "offer" && (!p.expires || p.expires >= today))
      .sort((a, b) => b.date.localeCompare(a.date))[0];
  }

  function daysLeftText(offer) {
    if (!offer.expires) return "";
    const days = Math.ceil((new Date(offer.expires + "T00:00:00") - new Date()) / 86400000);
    if (days <= 0) return "Ends today!";
    if (days === 1) return "Ends tomorrow!";
    return `Ends in ${days} days`;
  }

  function alreadyDismissedRecently() {
    const last = localStorage.getItem("codexora_offer_popup_seen");
    if (!last) return false;
    const hoursSince = (Date.now() - Number(last)) / 3600000;
    return hoursSince < POPUP_COOLDOWN_HOURS;
  }

  function dismiss() {
    localStorage.setItem("codexora_offer_popup_seen", String(Date.now()));
    const overlay = document.getElementById("opOverlay");
    if (overlay) overlay.remove();
  }

  function injectStyles() {
    if (document.getElementById("offer-popup-style")) return;
    const style = document.createElement("style");
    style.id = "offer-popup-style";
    style.textContent = `
      #opOverlay { position:fixed; inset:0; background:rgba(10,15,30,.65); backdrop-filter:blur(4px); z-index:2000; display:flex; align-items:center; justify-content:center; padding:5vw; opacity:0; transition:opacity .3s; }
      #opOverlay.op-in { opacity:1; }
      .op-card { background:var(--white,#fff); border-radius:22px; max-width:420px; width:100%; padding:38px 34px; position:relative; text-align:center; transform:translateY(16px) scale(.97); transition:transform .3s; box-shadow:0 20px 60px rgba(0,0,0,.35); }
      #opOverlay.op-in .op-card { transform:translateY(0) scale(1); }
      .op-close { position:absolute; top:14px; right:14px; width:32px; height:32px; border-radius:50%; border:none; background:var(--surface,#f4f3ef); font-size:1.1rem; cursor:pointer; color:#333; }
      .op-badge { display:inline-block; background:rgba(255,107,53,.12); color:var(--accent2,#ff6b35); font-size:.72rem; font-weight:700; letter-spacing:.06em; text-transform:uppercase; padding:6px 14px; border-radius:50px; margin-bottom:14px; }
      .op-card h3 { font-family:'Syne',sans-serif; font-size:1.35rem; font-weight:700; color:var(--ink,#0a0f1e); line-height:1.35; margin-bottom:.7rem; }
      .op-card p { font-size:.9rem; line-height:1.7; color:var(--muted,#8a93a8); margin-bottom:1.1rem; }
      .op-expiry { font-size:.82rem; font-weight:700; color:var(--accent2,#ff6b35); margin-bottom:1.4rem; }
      .op-actions { display:flex; flex-direction:column; gap:.6rem; }
      .op-claim { background:var(--accent,#00c6a2); color:#04241e; font-weight:700; font-size:.9rem; padding:13px; border-radius:50px; border:none; cursor:pointer; text-decoration:none; }
      .op-claim:hover { opacity:.9; }
      .op-later { background:none; border:none; color:var(--muted,#8a93a8); font-size:.82rem; cursor:pointer; padding:4px; }
      @media (max-width:480px){ .op-card { padding:30px 24px; } }
    `;
    document.head.appendChild(style);
  }

  function showPopup(offer) {
    injectStyles();

    const overlay = document.createElement("div");
    overlay.id = "opOverlay";
    overlay.innerHTML = `
      <div class="op-card">
        <button class="op-close" aria-label="Close">&times;</button>
        <span class="op-badge">Limited Offer</span>
        <h3>${offer.title}</h3>
        <p>${offer.excerpt}</p>
        ${offer.expires ? `<div class="op-expiry">⏳ ${daysLeftText(offer)}</div>` : ""}
        <div class="op-actions">
          <a class="op-claim" target="_blank" rel="noopener"
             href="https://wa.me/919628802518?text=${encodeURIComponent("Hi Codexora, I'd like to claim this offer: " + offer.title)}">
            💬 Claim on WhatsApp
          </a>
          <button class="op-later">Maybe later</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add("op-in"));

    overlay.querySelector(".op-close").addEventListener("click", dismiss);
    overlay.querySelector(".op-later").addEventListener("click", dismiss);
    overlay.addEventListener("click", (e) => { if (e.target === overlay) dismiss(); });
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (alreadyDismissedRecently()) return;
    const offer = activeOffer();
    if (!offer) return;
    setTimeout(() => showPopup(offer), POPUP_DELAY_MS);
  });
})();
