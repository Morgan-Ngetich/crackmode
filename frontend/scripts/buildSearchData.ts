import { generateSearchDataFromMDX } from "@/utils/mdxParser";
import path from "path";

async function main() {
  const docsDirectory = path.join(process.cwd(), "src/components/docs");
  const outputPath = path.join(process.cwd(), "public/assets/searchData.json");

  try {
    await generateSearchDataFromMDX(docsDirectory, outputPath);
    process.exit(0);
  } catch (error) {
    console.error("Failed to build search data:", error);
    process.exit(1);
  }
}

// ESM-compatible check for direct execution
if (process.argv[1] === new URL(import.meta.url).pathname) {
  main();
}

export { main as buildSearchData };
