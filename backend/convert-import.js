const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "backend");

const ALIAS_FOLDERS = [
  "config",
  "cron",
  "middlewares",
  "models",
  "modules",
  "seed",
  "types",
  "utils",
];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (
      fullPath.endsWith(".ts") ||
      fullPath.endsWith(".tsx")
    ) {
      convertImports(fullPath);
    }
  }
}

function convertImports(file) {
  let content = fs.readFileSync(file, "utf8");
  let changed = false;

  content = content.replace(
    /from\s+['"](\.{1,2}\/[^'"]+)['"]/g,
    (match, importPath) => {
      const absolute = path.normalize(
        path.resolve(path.dirname(file), importPath)
      );

      const relativeToBackend = path.relative(ROOT, absolute);

      const firstFolder = relativeToBackend.split(path.sep)[0];

      if (!ALIAS_FOLDERS.includes(firstFolder)) {
        return match;
      }

      changed = true;

      return `from "@/` +
        relativeToBackend.replace(/\\/g, "/") +
        `"`;
    }
  );

  if (changed) {
    fs.writeFileSync(file, content);
    console.log("✔", path.relative(ROOT, file));
  }
}

walk(ROOT);

console.log("\nDone!");