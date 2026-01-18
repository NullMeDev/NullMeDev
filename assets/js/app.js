const OWNER = "NullMeDev";
const SITE = {
  name: "NullMeDev",
  bio: "Full-stack developer with expertise in systems programming, web development, and automation. Passionate about building secure, efficient, and innovative solutions across multiple programming languages.",
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
  ["PowerShell", "sky"], ["HTML", "rose"], ["CSS", "lavender"],
  ["Shell", "mint"], ["Ruby", "rose"]
]);

const LANG_EMOJIS = new Map([
  ["Rust", "🦀"], ["Go", "🔷"], ["Python", "🐍"],
  ["TypeScript", "💎"], ["JavaScript", "⚡"], ["C#", "🎯"],
  ["PowerShell", "⚙️"], ["HTML", "🌐"], ["CSS", "🎨"],
  ["Shell", "🐚"], ["Ruby", "💎"]
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
    pink: "#fce7f3", lavender: "#ede9fe", mint: "#d1fae5",
    sky: "#dbeafe", peach: "#fed7aa", rose: "#ffe4e6"
  };
  dot.style.background = map[colorName] || "#f3f4f6";
  dot.style.border = "1px solid rgba(0,0,0,0.08)";
  dot.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)";
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
  const title = el("h1", null, `✨ ${SITE.name} ✨`);
  const bio = el("div", "subtitle", SITE.bio);
  
  // Add decorative emoji elements
  const decorTop = el("div");
  decorTop.style.position = "absolute";
  decorTop.style.top = "20px";
  decorTop.style.left = "50%";
  decorTop.style.transform = "translateX(-50%)";
  decorTop.style.fontSize = "24px";
  decorTop.style.opacity = "0.6";
  decorTop.textContent = "🌟 💫 ⭐";
  
  const contacts = el("div", "pills");
  contacts.appendChild(pill(`📧 ${SITE.email}`));
  contacts.appendChild(pill(`📍 ${SITE.location}`));
  contacts.appendChild(pill(`🌐 ${SITE.website}`));
  
  wrap.appendChild(decorTop);
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
    
    // Add emoji based on language using shared map
    const emoji = LANG_EMOJIS.get(f.lang) || "✨";
    
    const nameWrap = el("div");
    nameWrap.style.display = "flex";
    nameWrap.style.alignItems = "center";
    nameWrap.style.gap = "8px";
    nameWrap.style.marginBottom = "8px";
    
    const emojiSpan = el("span");
    emojiSpan.textContent = emoji;
    emojiSpan.style.fontSize = "1.5rem";
    
    const name = el("div", null, f.name);
    name.style.fontWeight = "700";
    name.style.fontSize = "1.1rem";
    
    nameWrap.appendChild(emojiSpan);
    nameWrap.appendChild(name);
    
    const meta = el("div", "badges");
    const color = LANG_COLORS.get(f.lang) || "mint";
    meta.appendChild(iconDot(color));
    meta.appendChild(badge(f.lang, color));
    if (f.note) meta.appendChild(badge(f.note, "pink"));
    c.appendChild(nameWrap);
    c.appendChild(meta);
    if (f.url && !f.private) {
      const link = el("div", "muted", "✅ Public repository");
      link.style.marginTop = "8px";
      c.style.cursor = "pointer";
      c.addEventListener("click", () => window.open(f.url, "_blank"));
      c.appendChild(link);
    } else {
      const link = el("div", "muted", "🔒 Not publicly accessible");
      link.style.marginTop = "8px";
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
  
  // Use shared emoji mapping
  const emoji = LANG_EMOJIS.get(p.language) || "📦";
  
  // Title with better styling and emoji
  const titleWrap = el("div");
  titleWrap.style.marginBottom = "10px";
  titleWrap.style.display = "flex";
  titleWrap.style.alignItems = "center";
  titleWrap.style.gap = "8px";
  
  const emojiSpan = el("span");
  emojiSpan.textContent = emoji;
  emojiSpan.style.fontSize = "1.3rem";
  
  const title = el("div", null, p.name);
  title.style.fontWeight = "700";
  title.style.fontSize = "1.15rem";
  title.style.color = "var(--ink)";
  
  titleWrap.appendChild(emojiSpan);
  titleWrap.appendChild(title);
  
  // Add private badge if private
  if (p.private) {
    const privateBadge = el("span", "badge pink");
    privateBadge.textContent = "🔒 Private";
    privateBadge.style.marginLeft = "8px";
    privateBadge.style.fontSize = "0.75rem";
    titleWrap.appendChild(privateBadge);
  }
  
  // Description with better handling
  const descText = p.description || (p.private ? "Private project showcasing programming capabilities" : "Exploring new ideas and concepts");
  const desc = el("div", "muted", descText);
  desc.style.marginBottom = "14px";
  desc.style.lineHeight = "1.6";
  
  // Metadata badges
  const meta = el("div", "badges");
  const color = LANG_COLORS.get(p.language) || "mint";
  meta.appendChild(iconDot(color));
  if (p.language) meta.appendChild(badge(p.language, color));
  if (typeof p.stars === "number" && p.stars > 0) meta.appendChild(badge(`⭐ ${p.stars}`, "sky"));
  if (p.views14d && typeof p.views14d.count === "number" && p.views14d.count > 0)
    meta.appendChild(badge(`👁️ ${p.views14d.count}`, "lavender"));
  if (p.views14d && typeof p.views14d.uniques === "number" && p.views14d.uniques > 0)
    meta.appendChild(badge(`👥 ${p.views14d.uniques}`, "peach"));
  
  c.appendChild(titleWrap);
  c.appendChild(desc);
  c.appendChild(meta);

  const isClickable = !p.private && p.hasReadme && p.html_url;
  if (isClickable) {
    c.style.cursor = "pointer";
    c.addEventListener("click", () => window.open(p.html_url, "_blank"));
    const link = el("div", "muted");
    link.style.marginTop = "10px";
    link.style.fontSize = "0.85rem";
    link.style.fontWeight = "550";
    link.textContent = "→ View on GitHub";
    c.appendChild(link);
  } else if (p.private) {
    const mut = el("div", "muted");
    mut.style.marginTop = "10px";
    mut.style.fontSize = "0.85rem";
    mut.textContent = "🔒 Private repository";
    c.appendChild(mut);
  }
  return c;
}

function capabilitiesSection(projects) {
  const sec = section("🚀 Programming Capabilities");
  
  // Analyze projects to extract capabilities
  const langCount = new Map();
  const privateCount = projects.filter(p => p.private).length;
  const publicCount = projects.filter(p => !p.private).length;
  const totalProjects = projects.length;
  
  projects.forEach(p => {
    if (p.language) {
      langCount.set(p.language, (langCount.get(p.language) || 0) + 1);
    }
  });
  
  // Create capabilities summary
  const summary = el("div");
  summary.style.marginBottom = "16px";
  
  const intro = el("div", "muted");
  intro.style.fontSize = "15px";
  intro.style.lineHeight = "1.6";
  intro.textContent = `Portfolio of ${totalProjects} projects (${publicCount} public, ${privateCount} private) demonstrating expertise across multiple programming languages and domains including systems programming, web development, automation, security tools, and infrastructure.`;
  summary.appendChild(intro);
  
  // Language breakdown
  const langBreakdown = el("div");
  langBreakdown.style.marginTop = "12px";
  const langTitle = el("div");
  langTitle.style.fontWeight = "600";
  langTitle.style.marginBottom = "8px";
  langTitle.textContent = "💡 Language Distribution:";
  langBreakdown.appendChild(langTitle);
  
  const langBadges = el("div", "badges");
  const sortedLangs = Array.from(langCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8); // Top 8 languages
  
  sortedLangs.forEach(([lang, count]) => {
    const color = LANG_COLORS.get(lang) || "mint";
    const text = `${lang} (${count} ${count === 1 ? 'project' : 'projects'})`;
    langBadges.appendChild(badge(text, color));
  });
  langBreakdown.appendChild(langBadges);
  summary.appendChild(langBreakdown);
  
  // Key areas of expertise
  const expertise = el("div");
  expertise.style.marginTop = "12px";
  const expTitle = el("div");
  expTitle.style.fontWeight = "600";
  expTitle.style.marginBottom = "8px";
  expTitle.textContent = "🎯 Areas of Expertise:";
  expertise.appendChild(expTitle);
  
  const expertiseList = el("div", "badges");
  const areas = [
    "Systems Programming",
    "Web Development",
    "API Development",
    "Security Tools",
    "Automation & Scripting",
    "Data Processing",
    "CLI Applications",
    "Full-Stack Development"
  ];
  
  areas.forEach(area => {
    expertiseList.appendChild(badge(area, "lavender"));
  });
  expertise.appendChild(expertiseList);
  summary.appendChild(expertise);
  
  sec.root.appendChild(summary);
  return sec.root;
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
    kpiWrap.appendChild(kpiCard("📦 Total Projects", data.projects.length || 0));
    kpiSection.appendChild(kpiWrap);
    container.appendChild(kpiSection);

    // Programming Capabilities
    container.appendChild(capabilitiesSection(data.projects || []));

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
