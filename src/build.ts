import { writeFile, mkdir } from "fs/promises";
import { fetchPortfolioData } from "./github.js";

const USERNAME = process.env.PORTFOLIO_USERNAME || "NullMeDev";
const TOKEN = process.env.PORTFOLIO_TOKEN || "";

if (!TOKEN) {
  console.error("Missing PORTFOLIO_TOKEN env var");
  process.exit(1);
}

const outDir = "public";

async function run() {
  await mkdir(outDir, { recursive: true });
  const data = await fetchPortfolioData(USERNAME, TOKEN);
  await writeFile(`${outDir}/data.json`, JSON.stringify(data, null, 2));
  console.log("Wrote public/data.json");
}

run();