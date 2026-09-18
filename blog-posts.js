// ============================================================
// CODEXORA BLOG CONTENT — edit this file only.
// Add a new post by copying an object below and changing the
// values. Newest posts show first automatically (sorted by date).
//
// Fields:
//   id       - unique short id, no spaces (used internally)
//   category - "news" | "update" | "offer"
//   title    - post title
//   date     - "YYYY-MM-DD" (controls sort order + display)
//   excerpt  - 1-2 line summary shown on the card
//   body     - full text shown when someone clicks "Read more"
//              (separate paragraphs with \n\n)
//   expires  - OPTIONAL, "YYYY-MM-DD", only for offers.
//              Shows a countdown / "Expired" badge automatically.
// ============================================================

const BLOG_POSTS = [
  {
    id: "welcome-blog",
    category: "news",
    title: "We've launched our Blog & Updates page",
    date: "2026-09-18",
    excerpt: "From now on, all Codexora Solutions news, feature updates, and offers will be posted right here.",
    body: "We've launched this page so you can always find the latest news, product updates, and limited-time offers from Codexora Solutions in one place.\n\nBookmark this page — we'll be posting regularly as we ship new features and run new offers for schools, colleges, shops, and local businesses."
  },
  {
    id: "diwali-offer-2026",
    category: "offer",
    title: "Diwali Special — 20% off all School & College Websites",
    date: "2026-09-15",
    excerpt: "Book a new school or college website before the offer ends and save 20% on our standard package.",
    body: "To celebrate the festive season, we're offering 20% off our standard School & College Website package for any project booked before the offer ends.\n\nThis includes the full site build, admissions/enquiry form, photo gallery, and one round of revisions. Message us on WhatsApp to lock in the discount.",
    expires: "2026-10-30"
  },
  {
    id: "maintenance-plans-update",
    category: "update",
    title: "New: Monthly Maintenance Plans",
    date: "2026-09-05",
    excerpt: "We now offer ongoing monthly maintenance plans — content updates, backups, and small fixes handled for you.",
    body: "Several clients asked for an easy way to keep their site updated after launch, so we've introduced monthly maintenance plans.\n\nEach plan covers content updates (new notices, images, staff/product changes), regular backups, uptime checks, and small bug fixes — so you don't have to touch any code yourself. Contact us for pricing based on your site size."
  }
];
