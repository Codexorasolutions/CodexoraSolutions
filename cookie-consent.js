// ============================================================
// COOKIE CONSENT
// One shared script for the whole site. Load it in <head> of every
// page (before the Google Analytics snippet on pages that have one).
//
// - Shows a banner on the first visit: Accept all / Reject all / Customize.
// - "Strictly necessary" is always on (reCAPTCHA, security, the choice itself).
// - "Analytics" (Google Analytics + the visitor counter) only runs if allowed.
// - The choice is saved in a first-party cookie for 180 days.
// - Visitors can change their mind anytime via any element with the
//   attribute  data-cookie-settings  (there's one in the footer).
// - Works with Google Consent Mode v2: analytics_storage stays "denied"
//   until the visitor says yes.
//
// Other scripts can ask:  CodexoraConsent.has("analytics")  -> true/false
// and listen for changes: document.addEventListener("codexora:consent", ...)
// ============================================================
(function () {
  var COOKIE_NAME = "codexora_consent";
  var VERSION = 1;          // bump this to ask everyone again (e.g. if you add a new category)
  var DAYS = 180;

  // ---------- Google Consent Mode: default = denied ----------
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }

  // ---------- cookie helpers ----------
  function parse(raw) {
    try {
      var data = JSON.parse(raw);
      return data && data.v === VERSION ? data : null;
    } catch (e) { return null; }
  }

  // The choice is stored in a cookie AND in localStorage. Browsers don't keep
  // cookies for pages opened straight from disk (file://), so the localStorage
  // copy makes sure the banner doesn't come back on every refresh while testing.
  function readCookie() {
    var m = document.cookie.match(new RegExp("(?:^|; )" + COOKIE_NAME + "=([^;]*)"));
    if (m) {
      try { var c = parse(decodeURIComponent(m[1])); if (c) return c; } catch (e) {}
    }
    try { return parse(localStorage.getItem(COOKIE_NAME)); } catch (e) { return null; }
  }

  function writeCookie(data) {
    var secure = location.protocol === "https:" ? "; Secure" : "";
    document.cookie = COOKIE_NAME + "=" + encodeURIComponent(JSON.stringify(data)) +
      "; Max-Age=" + (DAYS * 86400) + "; Path=/; SameSite=Lax" + secure;
    try { localStorage.setItem(COOKIE_NAME, JSON.stringify(data)); } catch (e) {}
  }

  function clearAnalyticsCookies() {
    var host = location.hostname.split(".");
    var domains = ["", location.hostname];
    if (host.length > 2) domains.push("." + host.slice(-2).join("."));
    else domains.push("." + location.hostname);
    document.cookie.split("; ").forEach(function (c) {
      var name = c.split("=")[0];
      if (name === "_ga" || name.indexOf("_ga_") === 0 || name === "_gid" || name.indexOf("_gat") === 0) {
        domains.forEach(function (d) {
          document.cookie = name + "=; Max-Age=0; Path=/" + (d ? "; Domain=" + d : "");
        });
      }
    });
  }

  var saved = readCookie();

  gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: saved && saved.analytics ? "granted" : "denied",
    wait_for_update: 500
  });

  // ---------- public API ----------
  function apply(analytics) {
    gtag("consent", "update", { analytics_storage: analytics ? "granted" : "denied" });
    if (!analytics) clearAnalyticsCookies();
  }

  function save(analytics) {
    var wasAllowed = !!(saved && saved.analytics);
    saved = { v: VERSION, analytics: !!analytics, ts: Date.now() };
    writeCookie(saved);
    apply(saved.analytics);
    closeBanner(true);
    document.dispatchEvent(new CustomEvent("codexora:consent", { detail: { analytics: saved.analytics, changed: wasAllowed !== saved.analytics } }));
  }

  window.CodexoraConsent = {
    has: function (cat) { return cat === "necessary" ? true : !!(saved && saved[cat]); },
    decided: function () { return !!saved; },
    open: function () { openBanner(true); }
  };

  // ---------- UI ----------
  var ICON_COOKIE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2.5a9.5 9.5 0 1 0 9.5 9.5 4.2 4.2 0 0 1-4.6-4.3 4.2 4.2 0 0 1-4.3-4.6 4.2 4.2 0 0 1-.6-.6Z"/><circle cx="8.5" cy="11" r="1" fill="currentColor"/><circle cx="12.5" cy="15.5" r="1" fill="currentColor"/><circle cx="15.8" cy="12.2" r="1" fill="currentColor"/><circle cx="8.8" cy="15.8" r=".6" fill="currentColor"/></svg>';
  var ICON_CHEV = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
  var ICON_CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>';
  var ICON_X = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';

  var STYLE_ID = "cc-style";
  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var s = document.createElement("style");
    s.id = STYLE_ID;
    s.textContent = [
      // card — same language as the site's floating cards
      "#ccBanner{position:fixed;left:24px;bottom:24px;z-index:2100;width:410px;max-width:calc(100vw - 32px);max-height:calc(100vh - 48px);overflow:auto;background:rgba(255,255,255,.92);-webkit-backdrop-filter:blur(18px) saturate(1.4);backdrop-filter:blur(18px) saturate(1.4);color:var(--ink,#0a0f1e);border:1px solid rgba(10,15,30,.08);border-radius:22px;padding:22px;box-shadow:0 24px 70px rgba(10,15,30,.18),0 2px 8px rgba(10,15,30,.06);font-family:'DM Sans',sans-serif;opacity:0;transform:translateY(24px) scale(.96);transform-origin:bottom left;transition:opacity .35s ease,transform .5s cubic-bezier(.34,1.56,.64,1)}",
      "#ccBanner.cc-in{opacity:1;transform:none}",
      "#ccBanner.cc-out{opacity:0;transform:translateY(16px) scale(.97);transition:opacity .25s ease,transform .25s ease}",
      "#ccBanner:focus{outline:none}",
      ".cc-head{display:flex;align-items:center;gap:13px;margin-bottom:12px}",
      ".cc-ico{flex:0 0 auto;width:44px;height:44px;border-radius:13px;background:rgba(0,198,162,.12);color:#00a98b;display:grid;place-items:center}",
      ".cc-ico svg{width:24px;height:24px}",
      "#ccBanner.cc-in .cc-ico svg{animation:cc-wobble 1.1s .45s ease-in-out 1}",
      "@keyframes cc-wobble{0%,100%{transform:rotate(0)}20%{transform:rotate(-16deg)}40%{transform:rotate(12deg)}60%{transform:rotate(-8deg)}80%{transform:rotate(4deg)}}",
      ".cc-title{font-family:'Syne',sans-serif;font-size:1.08rem;font-weight:700;line-height:1.2;margin:0;color:var(--ink,#0a0f1e)}",
      ".cc-sub{display:flex;align-items:center;gap:6px;font-size:.72rem;color:#6b7387;margin-top:3px}",
      ".cc-sub i{width:6px;height:6px;border-radius:50%;background:var(--accent,#00c6a2);box-shadow:0 0 0 3px rgba(0,198,162,.18)}",
      ".cc-x{margin-left:auto;align-self:flex-start;width:30px;height:30px;border-radius:50%;border:none;background:var(--surface,#f4f3ef);color:#4a5268;cursor:pointer;display:none;place-items:center;transition:background .2s,transform .2s}",
      ".cc-x:hover{background:#e9e8e2;transform:rotate(90deg)}",
      ".cc-x svg{width:14px;height:14px}",
      "#ccBanner.cc-reopen .cc-x{display:grid}",
      ".cc-text{font-size:.85rem;line-height:1.65;color:#4a5268;margin:0 0 14px}",
      ".cc-text a{color:#00a98b;font-weight:600;text-decoration:none;border-bottom:1px solid rgba(0,169,139,.35)}",
      ".cc-text a:hover{border-bottom-color:currentColor}",
      // preferences accordion
      ".cc-prefs{display:grid;grid-template-rows:0fr;transition:grid-template-rows .4s cubic-bezier(.4,0,.2,1)}",
      "#ccBanner.cc-open .cc-prefs{grid-template-rows:1fr}",
      ".cc-prefs-in{overflow:hidden;min-height:0}",
      ".cc-cat{border:1px solid rgba(10,15,30,.09);border-radius:14px;margin-bottom:10px;background:#fff;transition:border-color .2s,box-shadow .2s}",
      ".cc-cat:hover{border-color:rgba(0,198,162,.45)}",
      ".cc-cat.cc-on{border-color:rgba(0,198,162,.55);box-shadow:0 0 0 3px rgba(0,198,162,.08)}",
      ".cc-cat-top{display:flex;align-items:center;gap:12px;padding:12px 14px}",
      ".cc-cat-btn{flex:1;display:flex;align-items:center;gap:10px;text-align:left;background:none;border:none;padding:0;cursor:pointer;font:inherit;color:inherit;min-width:0}",
      ".cc-cat-btn strong{display:block;font-size:.86rem;font-weight:600}",
      ".cc-cat-btn small{display:block;font-size:.75rem;color:#6b7387;line-height:1.45;margin-top:2px}",
      ".cc-chev{flex:0 0 auto;width:16px;height:16px;color:#8a93a8;transition:transform .3s}",
      ".cc-cat.cc-exp .cc-chev{transform:rotate(180deg)}",
      ".cc-lock{flex:0 0 auto;font-size:.68rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:#00846c;background:rgba(0,198,162,.12);padding:5px 10px;border-radius:50px}",
      ".cc-details{display:grid;grid-template-rows:0fr;transition:grid-template-rows .3s ease}",
      ".cc-cat.cc-exp .cc-details{grid-template-rows:1fr}",
      ".cc-details>div{overflow:hidden;min-height:0}",
      ".cc-list{list-style:none;margin:0;padding:2px 14px 12px;border-top:1px dashed rgba(10,15,30,.1);padding-top:10px}",
      ".cc-list li{display:flex;justify-content:space-between;gap:10px;font-size:.74rem;color:#4a5268;padding:3px 0}",
      ".cc-list code{font:600 .72rem ui-monospace,SFMono-Regular,Menlo,monospace;background:var(--surface,#f4f3ef);padding:2px 7px;border-radius:6px;color:var(--ink,#0a0f1e)}",
      ".cc-list span{color:#8a93a8;text-align:right}",
      // switch
      ".cc-switch{position:relative;flex:0 0 auto;width:46px;height:26px}",
      ".cc-switch input{position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:pointer;z-index:1}",
      ".cc-switch span{position:absolute;inset:0;border-radius:26px;background:#d5d8e0;transition:background .25s;pointer-events:none}",
      ".cc-switch span::after{content:'';position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:#fff;box-shadow:0 2px 5px rgba(10,15,30,.25);transition:transform .3s cubic-bezier(.34,1.56,.64,1)}",
      ".cc-switch input:checked+span{background:var(--accent,#00c6a2)}",
      ".cc-switch input:checked+span::after{transform:translateX(20px)}",
      ".cc-switch input:focus-visible+span{outline:2px solid var(--ink,#0a0f1e);outline-offset:2px}",
      // buttons — mirror .btn-primary / .btn-outline
      ".cc-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:4px}",
      ".cc-btn{flex:1 1 0;white-space:nowrap;font:600 .85rem 'DM Sans',sans-serif;padding:12px 16px;border-radius:50px;cursor:pointer;border:1.5px solid var(--ink,#0a0f1e);background:transparent;color:var(--ink,#0a0f1e);transition:transform .2s,background .2s,box-shadow .2s,border-color .2s,color .2s}",
      ".cc-btn:hover{transform:translateY(-2px);background:rgba(10,15,30,.05)}",
      ".cc-btn:active{transform:translateY(0)}",
      ".cc-btn.cc-primary{background:var(--ink,#0a0f1e);color:#fff}",
      ".cc-btn.cc-primary:hover{background:var(--accent,#00c6a2);border-color:var(--accent,#00c6a2);color:#04241e;box-shadow:0 8px 24px rgba(0,198,162,.32)}",
      ".cc-btn:focus-visible{outline:2px solid var(--accent,#00c6a2);outline-offset:2px}",
      ".cc-save{display:none;flex-basis:100%;order:-1}",
      "#ccBanner.cc-open .cc-save{display:block}",
      ".cc-more{display:block;margin:12px auto 0;background:none;border:none;font:600 .8rem 'DM Sans',sans-serif;color:#4a5268;cursor:pointer;padding:4px 8px;border-radius:8px}",
      ".cc-more:hover{color:var(--ink,#0a0f1e);text-decoration:underline;text-underline-offset:3px}",
      "#ccBanner.cc-open .cc-more{display:none}",
      // floating re-open button + toast
      "#ccFab{position:fixed;left:20px;bottom:20px;z-index:1500;width:44px;height:44px;border-radius:50%;border:1px solid rgba(10,15,30,.08);background:#fff;color:#00a98b;display:grid;place-items:center;cursor:pointer;box-shadow:0 6px 22px rgba(10,15,30,.14);opacity:0;transform:scale(.6);transition:opacity .3s,transform .4s cubic-bezier(.34,1.56,.64,1),box-shadow .2s}",
      "#ccFab.cc-in{opacity:1;transform:scale(1)}",
      "#ccFab:hover{transform:scale(1.08) rotate(-12deg);box-shadow:0 10px 28px rgba(0,198,162,.3)}",
      "#ccFab svg{width:22px;height:22px}",
      "#ccFab:focus-visible{outline:2px solid var(--accent,#00c6a2);outline-offset:3px}",
      "#ccFab::after{content:attr(data-tip);position:absolute;left:54px;white-space:nowrap;background:var(--ink,#0a0f1e);color:#fff;font:500 .75rem 'DM Sans',sans-serif;padding:6px 11px;border-radius:50px;opacity:0;transform:translateX(-6px);pointer-events:none;transition:.2s}",
      "#ccFab:hover::after,#ccFab:focus-visible::after{opacity:1;transform:none}",
      "#ccToast{position:fixed;left:24px;bottom:78px;z-index:2100;display:flex;align-items:center;gap:9px;background:var(--ink,#0a0f1e);color:#fff;font:500 .83rem 'DM Sans',sans-serif;padding:10px 16px 10px 10px;border-radius:50px;box-shadow:0 12px 34px rgba(10,15,30,.28);opacity:0;transform:translateY(10px);transition:opacity .3s,transform .4s cubic-bezier(.34,1.56,.64,1)}",
      "#ccToast.cc-in{opacity:1;transform:none}",
      "#ccToast b{width:22px;height:22px;border-radius:50%;background:var(--accent,#00c6a2);color:#04241e;display:grid;place-items:center}",
      "#ccToast b svg{width:13px;height:13px}",
      // mobile = bottom sheet
      "@media (max-width:520px){#ccBanner{left:0;right:0;bottom:0;width:100%;max-width:none;border-radius:22px 22px 0 0;padding:20px 18px calc(18px + env(safe-area-inset-bottom));max-height:88vh;transform:translateY(100%);transform-origin:bottom center}#ccBanner.cc-in{transform:none}#ccFab{left:14px;bottom:14px}#ccToast{left:14px;bottom:68px}}",
      "@media (prefers-reduced-motion:reduce){#ccBanner,#ccFab,#ccToast,.cc-prefs,.cc-details,.cc-btn,.cc-switch span::after{transition:none!important}#ccBanner.cc-in .cc-ico svg{animation:none}}"
    ].join("\n");
    document.head.appendChild(s);
  }

  function policyHref() {
    return location.pathname.indexOf("/pages/") !== -1 ? "privacy-policy.html#cookies" : "pages/privacy-policy.html#cookies";
  }

  var lastFocus = null;

  // ----- toast -----
  function toast(msg) {
    var old = document.getElementById("ccToast");
    if (old) old.remove();
    var t = document.createElement("div");
    t.id = "ccToast";
    t.setAttribute("role", "status");
    t.innerHTML = "<b>" + ICON_CHECK + "</b>" + msg;
    document.body.appendChild(t);
    requestAnimationFrame(function () { t.classList.add("cc-in"); });
    setTimeout(function () { t.classList.remove("cc-in"); setTimeout(function () { t.remove(); }, 400); }, 2600);
  }

  // ----- floating "cookie settings" button -----
  // The floating button is turned off: it overlapped the site's "back to top" button.
  // Visitors reopen settings from the footer link instead. Set to true to bring it back.
  var SHOW_FAB = false;
  function showFab() {
    if (!SHOW_FAB || document.getElementById("ccFab") || document.getElementById("ccBanner")) return;
    injectStyles();
    var b = document.createElement("button");
    b.id = "ccFab";
    b.type = "button";
    b.setAttribute("aria-label", "Open cookie settings");
    b.setAttribute("data-tip", "Cookie settings");
    b.innerHTML = ICON_COOKIE;
    document.body.appendChild(b);
    requestAnimationFrame(function () { b.classList.add("cc-in"); });
  }
  function hideFab() {
    var b = document.getElementById("ccFab");
    if (b) b.remove();
  }

  function closeBanner(withToast) {
    var el = document.getElementById("ccBanner");
    if (!el) return;
    el.classList.remove("cc-in");
    el.classList.add("cc-out");
    setTimeout(function () { el.remove(); showFab(); }, 260);
    if (lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (e) {} }
    if (withToast) toast(saved && saved.analytics ? "Preferences saved — thanks!" : "Preferences saved — analytics off");
  }

  function catHTML(id, title, desc, items, control) {
    return '<div class="cc-cat" data-cat="' + id + '">' +
      '<div class="cc-cat-top">' +
        '<button type="button" class="cc-cat-btn" aria-expanded="false" data-exp="' + id + '">' +
          '<span style="flex:1;min-width:0"><strong>' + title + '</strong><small>' + desc + '</small></span>' +
          '<span class="cc-chev">' + ICON_CHEV + '</span>' +
        '</button>' + control +
      '</div>' +
      '<div class="cc-details"><div><ul class="cc-list">' + items + '</ul></div></div>' +
    '</div>';
  }

  function openBanner(reopen) {
    if (document.getElementById("ccBanner")) return;
    injectStyles();
    hideFab();
    lastFocus = document.activeElement;

    var el = document.createElement("div");
    el.id = "ccBanner";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-label", "Cookie preferences");
    el.setAttribute("tabindex", "-1");
    if (reopen) el.classList.add("cc-reopen");

    el.innerHTML =
      '<div class="cc-head">' +
        '<div class="cc-ico">' + ICON_COOKIE + '</div>' +
        '<div><h3 class="cc-title">Your privacy, your choice</h3><div class="cc-sub"><i></i>Codexora Solutions</div></div>' +
        '<button type="button" class="cc-x" data-cc="close" aria-label="Close cookie settings">' + ICON_X + '</button>' +
      '</div>' +
      '<p class="cc-text">We use essential cookies to keep this site running, and — only if you agree — analytics cookies that show us which pages help visitors, so we can make the site better. No ads, no selling data. <a href="' + policyHref() + '">Privacy Policy</a></p>' +
      '<div class="cc-prefs"><div class="cc-prefs-in">' +
        catHTML("necessary", "Strictly necessary", "Keeps forms, security checks and your choice working.",
          '<li><code>codexora_consent</code><span>Your cookie choice · 180 days</span></li>' +
          '<li><code>reCAPTCHA</code><span>Google spam protection · forms</span></li>',
          '<span class="cc-lock">Always on</span>') +
        catHTML("analytics", "Analytics", "Helps us understand how the site is used.",
          '<li><code>_ga, _ga_*</code><span>Google Analytics · up to 2 years</span></li>' +
          '<li><code>codexora_visitor_counted</code><span>Visitor counter · local storage</span></li>',
          '<label class="cc-switch"><input type="checkbox" id="ccAnalytics" aria-label="Allow analytics cookies"><span></span></label>') +
      '</div></div>' +
      '<div class="cc-actions">' +
        '<button type="button" class="cc-btn cc-primary cc-save" data-cc="save">Save my choices</button>' +
        '<button type="button" class="cc-btn" data-cc="reject">Reject all</button>' +
        '<button type="button" class="cc-btn cc-primary" data-cc="accept">Accept all</button>' +
      '</div>' +
      '<button type="button" class="cc-more" data-cc="custom">Customize preferences</button>';

    document.body.appendChild(el);

    var toggle = el.querySelector("#ccAnalytics");
    var analyticsCat = el.querySelector('[data-cat="analytics"]');
    toggle.checked = !!(saved && saved.analytics);
    function syncCat() { analyticsCat.classList.toggle("cc-on", toggle.checked); }
    toggle.addEventListener("change", syncCat);
    syncCat();

    function openPrefs() { el.classList.add("cc-open"); }
    if (reopen) openPrefs();

    el.addEventListener("click", function (e) {
      var exp = e.target.closest("[data-exp]");
      if (exp) {
        var cat = exp.closest(".cc-cat");
        var on = cat.classList.toggle("cc-exp");
        exp.setAttribute("aria-expanded", on ? "true" : "false");
        return;
      }
      var b = e.target.closest("[data-cc]");
      if (!b) return;
      var a = b.getAttribute("data-cc");
      if (a === "accept") save(true);
      else if (a === "reject") save(false);
      else if (a === "custom") openPrefs();
      else if (a === "save") save(toggle.checked);
      else if (a === "close") closeBanner(false);
    });

    el.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      if (saved) closeBanner(false);
      else el.classList.remove("cc-open");
    });

    requestAnimationFrame(function () {
      el.classList.add("cc-in");
      if (reopen) el.focus();
    });
  }

  // "Cookie settings" links anywhere on the site (footer link + floating button)
  document.addEventListener("click", function (e) {
    var t = e.target.closest && e.target.closest("[data-cookie-settings], #ccFab");
    if (!t) return;
    e.preventDefault();
    openBanner(true);
  });

  document.addEventListener("DOMContentLoaded", function () {
    if (saved) showFab();
    else setTimeout(function () { openBanner(false); }, 600);
  });
})();
