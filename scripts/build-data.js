/* Data builder for NullMeDev portfolio
   - Lists repos (public and private) using a PAT
   - Filters by valid README
   - Excludes certain repos by name
   - Pulls traffic views for last 14 days
   - Produces data/portfolio.json for the site
*/
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dataDir = path.join(root, "data");
await fs.mkdir(dataDir, { recursive: true });

const OWNER = "NullMeDev";
const token = process.env.GH_PAT || process.env.GITHUB_TOKEN;
if (!token) {
  console.error("Missing GH_PAT (preferred) or GITHUB_TOKEN env. Add GH_PAT as a repository secret.");
  process.exit(1);
}

const headers = {
  "Authorization": `token ${token}`,
  "User-Agent": "NullMeDev-Portfolio-Action",
  "Accept": "application/vnd.github+json"
};

const excludeByName = new Set([
  "ESETGen", "SKBasedChecker", "OpenBullet", "NullNamso", "VPSPanel"
]);

const expectedWithReadme = 27; // sanity check target per request

async function gh(url) {
  const res = await fetch(url, { headers });
  if (res.status === 204) return null;
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`GitHub API ${res.status} ${url} ${msg}`);
  }
  return res.json();
}

async function paginate(url) {
  let results = [];
  let next = url;
  while (next) {
    const res = await fetch(next, { headers });
    if (!res.ok) throw new Error(`GitHub API ${res.status} ${next}`);
    const data = await res.json();
    results = results.concat(data);
    const link = res.headers.get("link") || "";
    const m = link.match(/<([^>]+)>;\s*rel="next"/);
    next = m ? m[1] : null;
  }
  return results;
}

async function hasReadme(owner, repo) {
  const url = `https://api.github.com/repos/${owner}/${repo}/readme`;
  const res = await fetch(url, { headers });
  if (res.status === 200) return true;
  if (res.status === 404) return false;
  // other statuses treated as false, but logged
  console.warn(`Unexpected status for readme ${owner}/${repo}: ${res.status}`);
  return false;
}

async function trafficViews(owner, repo) {
  const url = `https://api.github.com/repos/${owner}/${repo}/traffic/views`;
  const res = await fetch(url, { headers });
  if (res.status === 200) {
    const j = await res.json();
    return { count: j.count || 0, uniques: j.uniques || 0 };
  } else if (res.status === 204 || res.status === 404 || res.status === 403) {
    return { count: 0, uniques: 0 };
  } else {
    console.warn(`Traffic API ${owner}/${repo} status ${res.status}`);
    return { count: 0, uniques: 0 };
  }
}

async function main() {
  // List repos for the authenticated user including private
  const repos = await paginate("https://api.github.com/user/repos?per_page=100&affiliation=owner&sort=pushed");
  // Filter and transform
  const items = [];
  for (const r of repos) {
    if (r.owner?.login !== OWNER) continue;
    if (excludeByName.has(r.name)) continue;

    const readme = await hasReadme(OWNER, r.name);
    if (!readme) continue;

    const views = await trafficViews(OWNER, r.name);
    const item = {
      name: r.name,
      description: r.description,
      private: !!r.private,
      hasReadme: true,
      html_url: r.private ? null : r.html_url,
      language: r.language,
      stars: r.stargazers_count || 0,
      views14d: { count: views.count, uniques: views.uniques }
    };
    items.push(item);
  }

  // Totals
  const totals = items.reduce((acc, it) => {
    acc.views14d += (it.views14d?.count || 0);
    acc.uniques14d += (it.views14d?.uniques || 0);
    return acc;
  }, { views14d: 0, uniques14d: 0 });

  const data = {
    generatedAt: new Date().toISOString(),
    owner: OWNER,
    featured: [
      { name: "Skylock", lang: "Rust", private: true, url: null, note: "Private" },
      { name: "Noxhime", lang: "TypeScript", private: false, url: `https://github.com/${OWNER}/Noxhime` },
      { name: "EMILY", lang: "Go", private: false, url: `https://github.com/${OWNER}/EMILY` },
      { name: "LUMA", lang: "Go", private: false, url: `https://github.com/${OWNER}/LUMA` },
      { name: "ESETGen", lang: "Python", private: false, url: null, note: "Contributing factor (no README)" }
    ],
    projects: items,
    totals
  };

  const out = path.join(dataDir, "portfolio.json");
  await fs.writeFile(out, JSON.stringify(data, null, 2), "utf8");
  console.log(`Wrote ${out} with ${items.length} projects, totals views=${totals.views14d}, uniques=${totals.uniques14d}`);

  if (items.length !== expectedWithReadme) {
    console.warn(`Warning: expected ${expectedWithReadme} repos with README but found ${items.length}. This is informational.`);
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
