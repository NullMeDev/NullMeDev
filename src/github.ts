import { Octokit } from "octokit";

type Repo = {
  name: string;
  html_url: string;
  stargazers_count: number;
  description: string | null;
  language: string | null;
  fork: boolean;
  created_at: string;
  updated_at: string;
  homepage?: string | null;
};

export async function fetchPortfolioData(username: string, token: string) {
  const octokit = new Octokit({ auth: token });
  const user = await octokit.request("GET /users/{username}", { username });

  const repos: Repo[] = await octokit.paginate("GET /users/{username}/repos", {
    username,
    per_page: 100,
    sort: "updated",
    direction: "desc"
  });

  const ownRepos = repos.filter(r => !r.fork);

  const topRepos = [...ownRepos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 12)
    .map(r => ({
      name: r.name,
      url: r.html_url,
      stars: r.stargazers_count,
      description: r.description || "",
      language: r.language || "",
      homepage: r.homepage || ""
    }));

  const langTotals: Record<string, number> = {};
  for (const r of ownRepos.slice(0, 100)) {
    try {
      const langs = await octokit.request("GET /repos/{owner}/{repo}/languages", {
        owner: username,
        repo: r.name
      });
      const data = langs.data as Record<string, number>;
      for (const [lang, bytes] of Object.entries(data)) {
        langTotals[lang] = (langTotals[lang] || 0) + Number(bytes);
      }
    } catch {}
  }

  const totalBytes = Object.values(langTotals).reduce((a, b) => a + b, 0) || 1;
  const languages = Object.entries(langTotals)
    .map(([name, bytes]) => ({ name, percent: Math.round((bytes / totalBytes) * 1000) / 10 }))
    .sort((a, b) => b.percent - a.percent);

  const starsTop = [...ownRepos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 10)
    .map(r => ({ name: r.name, stars: r.stargazers_count }));

  const byYear: Record<string, number> = {};
  for (const r of ownRepos) {
    const y = new Date(r.created_at).getFullYear().toString();
    byYear[y] = (byYear[y] || 0) + 1;
  }
  const years = Object.keys(byYear).sort();
  const reposPerYear = years.map(y => ({ year: y, count: byYear[y] }));

  const repoList = ownRepos.map(r => ({
    name: r.name,
    url: r.html_url,
    language: r.language || "",
    stars: r.stargazers_count,
    description: r.description || "",
    updated_at: r.updated_at,
    homepage: r.homepage || ""
  }));

  return {
    user: {
      login: user.data.login,
      name: user.data.name || user.data.login,
      avatar_url: user.data.avatar_url,
      bio: user.data.bio || "",
      followers: user.data.followers,
      following: user.data.following,
      public_repos: user.data.public_repos
    },
    languages,
    topRepos,
    starsTop,
    reposPerYear,
    repoList
  };
}