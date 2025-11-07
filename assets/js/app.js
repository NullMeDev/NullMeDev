const OWNER = "NullMeDev";
const SITE = {
  name: "NullMeDev",
  bio: "Just here having fun, coming up with some ideas and making them into programs.",
  location: "USA",
  email: "null@nullme.lol",
  website: "https://nullme.lol",
  pagesUrl: "https://nullmedev.github.io/NullMeDev/"
};

// Featured projects: Skylock (private), Noxhime, EMILY, LUMA, ESETGen (contributing factor, no readme)
const FEATURED = [
  { name: "Skylock", lang: "Rust", private: true, url: null, note: "Private" },
  { name: "Noxhime", lang: "TypeScript", private: false, url: `https://github.com/${OWNER}/Noxhime` },
  { name: "EMILY", lang: "Go", private: false, url: `https://github.com/${OWNER}/EMILY` },
  { name: "LUMA", lang: "Go", private: false, url: `https://github.com/${OWNER}/LUMA` },
  { name: "ESETGen", lang: "Python", private: false, url: null, note: "Contributing factor (no README)" }
];

const LANG_COLORS = new Map([
  ["Rust", "peach"], ["Go", "mint"], ["Python", "sky"],
  ["TypeScript", "lavender"], ["JavaScript", "peach"], ["C#", "pink"],
  ["PowerShell", "sky"], ["HTML", "peach"]
]);

function el(tag, className, text) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  if (text) e.textContent = text;
  return e;
}

function pill(text) {
  const p = el("span", "pill", text);
  return p;
}

function badge(text, colorName) {
  const b = el("span", `badge ${colorName || ""}`, text);
  return b;
}

function iconDot(colorName) {
  const dot = el("span");
  dot.style.display = "inline-block";
  dot.style.width = "10px";
  dot.style.height = "10px";
  dot.style.borderRadius = "999px";
  const map = {
    pink: "#ffd5ea", lavender: "#e9dcff", mint: "#d9fff2",
    sky: "#d9f2ff", peach: "#ffe5d1"
  };
  dot.style.background = map[colorName] || "#eee";
  dot.style.border = "1px solid rgba(0,0,0,0.06)";
  return dot;
}

function section(titleText) {
  const s = el("section", "card");
  const t = el("h2", "section-title", titleText);
  s.appendChild(t);
  return { root: s, title: t };
}

function hero() {
  const wrap = el("div", "hero");
  const title = el("h1", null, `🌟 ${SITE.name} 🌟`);
  const bio = el("div", "subtitle", SITE.bio);
  const contacts = el("div", "pills");
  contacts.appendChild(pill(`📧 ${SITE.email}`));
  contacts.appendChild(pill(`📍 ${SITE.location}`));
  contacts.appendChild(pill(`🌐 ${SITE.website}`));
  wrap.appendChild(title);
  wrap.appendChild(bio);
  wrap.appendChild(contacts);
  const actions = el("div", "pills");
  const btn = el("button", "btn", "✨ View All Projects ✨");
  btn.addEventListener("click", () => {
    document.getElementById("all-projects").scrollIntoView({ behavior: "smooth", block: "start" });
  });
  actions.appendChild(btn);
  wrap.appendChild(actions);
  return wrap;
}

function featuredCards() {
  const grid = el("div", "grid");
  FEATURED.forEach(f => {
    const c = el("div", "card");
    const name = el("div", null, f.name);
    name.style.fontWeight = "700";
    name.style.marginBottom = "6px";
    const meta = el("div", "badges");
    const color = LANG_COLORS.get(f.lang) || "mint";
    meta.appendChild(iconDot(color));
    meta.appendChild(badge(f.lang, color));
    if (f.note) meta.appendChild(badge(f.note, "pink"));
    c.appendChild(name);
    c.appendChild(meta);
    if (f.url && !f.private) {
      const link = el("div", "muted", "Public repository");
      c.style.cursor = "pointer";
      c.addEventListener("click", () => window.open(f.url, "_blank"));
      c.appendChild(link);
    } else {
      const link = el("div", "muted", "Not publicly accessible");
      c.appendChild(link);
    }
    grid.appendChild(c);
  });
  return grid;
}

function kpiCard(label, value) {
  const k = el("div", "k");
  const v = el("div", null, value.toLocaleString());
  v.style.fontWeight = "800";
  v.style.fontSize = "22px";
  const l = el("div", "muted", label);
  k.appendChild(v);
  k.appendChild(l);
  return k;
}

function projectCard(p) {
  const c = el("div", "card");
  const title = el("div", null, p.name);
  title.style.fontWeight = "700";
  const desc = el("div", "muted", p.description || "No description");
  const meta = el("div", "badges");
  const color = LANG_COLORS.get(p.language) || "mint";
  meta.appendChild(iconDot(color));
  if (p.language) meta.appendChild(badge(p.language, color));
  if (typeof p.stars === "number") meta.appendChild(badge(`⭐ ${p.stars}`, "sky"));
  if (p.views14d && typeof p.views14d.count === "number")
    meta.appendChild(badge(`👁️ ${p.views14d.count}`, "lavender"));
  if (p.views14d && typeof p.views14d.uniques === "number")
    meta.appendChild(badge(`👥 ${p.views14d.uniques}`, "peach"));
  c.appendChild(title);
  c.appendChild(desc);
  c.appendChild(meta);

  const isClickable = !p.private && p.hasReadme && p.html_url;
  if (isClickable) {
    c.style.cursor = "pointer";
    c.addEventListener("click", () => window.open(p.html_url, "_blank"));
  } else {
    const mut = el("div", "muted", "No external link available");
    mut.style.marginTop = "6px";
    c.appendChild(mut);
  }
  return c;
}

async function loadData() {
  try {
    const res = await fetch("data/portfolio.json", { cache: "no-cache" });
    if (!res.ok) throw new Error(`Failed to load data ${res.status}`);
    const data = await res.json();

    const container = el("div", "container");
    const heroBlock = hero();
    container.appendChild(heroBlock);

    // KPI
    const kpiSection = el("div", "card");
    kpiSection.appendChild(el("h2", "section-title", "📊 Site Stats (last 14 days)"));
    const kpiWrap = el("div", "kpi");
    kpiWrap.appendChild(kpiCard("👁️ Total views", data.totals.views14d || 0));
    kpiWrap.appendChild(kpiCard("👥 Unique visitors", data.totals.uniques14d || 0));
    kpiSection.appendChild(kpiWrap);
    container.appendChild(kpiSection);

    // Featured
    const featuredSection = section("⭐ Featured Projects");
    featuredSection.root.appendChild(featuredCards());
    container.appendChild(featuredSection.root);

    // Skills
    const skillsSection = section("💻 Skills & Tech Stack");
    const skills = ["Rust","Go","Python","TypeScript","JavaScript","C#","PowerShell","HTML"];
    const badgesDiv = el("div", "badges");
    skills.forEach(s => {
      const color = LANG_COLORS.get(s) || "mint";
      badgesDiv.appendChild(badge(s, color));
    });
    skillsSection.root.appendChild(badgesDiv);
    container.appendChild(skillsSection.root);

    // All projects (only with valid README)
    const gallery = section("📦 All Projects");
    gallery.root.id = "all-projects";
    const grid = el("div", "grid");
    (data.projects || []).forEach(p => grid.appendChild(projectCard(p)));
    gallery.root.appendChild(grid);
    container.appendChild(gallery.root);

    // Footer
    const footer = el("div", "footer");
    footer.textContent = `© ${new Date().getFullYear()} ${SITE.name} · Contact: ${SITE.email} · Website: ${SITE.website}`;
    container.appendChild(footer);

    document.body.appendChild(container);
  } catch (e) {
    const err = el("div", "container");
    const msg = el("div", "card");
    msg.appendChild(el("h2", "section-title", "Failed to load portfolio"));
    msg.appendChild(el("div", "muted", String(e)));
    err.appendChild(msg);
    document.body.appendChild(err);
  }
}

document.addEventListener("DOMContentLoaded", loadData);
