const fs = require("fs");
const path = require("path");

const colorMap = {
  "dark:bg-indigo-50": "dark:bg-neutral-900",
  "dark:bg-indigo-100": "dark:bg-neutral-800",
  "dark:bg-indigo-200": "dark:bg-neutral-700",
  "dark:bg-indigo-300": "dark:bg-neutral-600",
  "dark:bg-indigo-400": "dark:bg-neutral-500",
  "dark:bg-indigo-500": "dark:bg-neutral-400",
  "dark:bg-indigo-600": "dark:bg-stone-600",
  "dark:bg-indigo-700": "dark:bg-stone-700",
  "dark:bg-indigo-800": "dark:bg-stone-800",
  "dark:bg-indigo-900": "dark:bg-neutral-800",
  "dark:bg-indigo-950": "dark:bg-neutral-900",

  "dark:hover:bg-indigo-50": "dark:hover:bg-neutral-800",
  "dark:hover:bg-indigo-100": "dark:hover:bg-neutral-700",
  "dark:hover:bg-indigo-200": "dark:hover:bg-neutral-600",
  "dark:hover:bg-indigo-300": "dark:hover:bg-neutral-500",
  "dark:hover:bg-indigo-400": "dark:hover:bg-neutral-400",
  "dark:hover:bg-indigo-500": "dark:hover:bg-neutral-300",
  "dark:hover:bg-indigo-600": "dark:hover:bg-amber-600",
  "dark:hover:bg-indigo-700": "dark:hover:bg-amber-500",
  "dark:hover:bg-indigo-800": "dark:hover:bg-amber-400",
  "dark:hover:bg-indigo-900": "dark:hover:bg-neutral-700",

  "dark:active:bg-indigo-50": "dark:active:bg-neutral-700",
  "dark:active:bg-indigo-100": "dark:active:bg-neutral-600",
  "dark:active:bg-indigo-200": "dark:active:bg-neutral-500",
  "dark:active:bg-indigo-300": "dark:active:bg-neutral-400",
  "dark:active:bg-indigo-400": "dark:active:bg-neutral-300",
  "dark:active:bg-indigo-500": "dark:active:bg-neutral-200",
  "dark:active:bg-indigo-600": "dark:active:bg-amber-500",
  "dark:active:bg-indigo-700": "dark:active:bg-amber-400",
  "dark:active:bg-indigo-800": "dark:active:bg-amber-300",
  "dark:active:bg-indigo-900": "dark:active:bg-neutral-600",

  "dark:focus:ring-indigo-300": "dark:focus:ring-amber-500",
  "dark:focus:ring-indigo-700": "dark:focus:ring-amber-400",
  "dark:ring-indigo-300": "dark:ring-amber-500",
  "dark:ring-indigo-700": "dark:ring-amber-400",

  "dark:text-indigo-300": "dark:text-neutral-300",
  "dark:text-indigo-400": "dark:text-neutral-400",
  "dark:text-indigo-500": "dark:text-neutral-400",
};

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  let changed = false;

  Object.entries(colorMap).forEach(([old, newColor]) => {
    if (content.includes(old)) {
      content = content.replace(new RegExp(old, "g"), newColor);
      changed = true;
    }
  });

  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated: ${filePath}`);
  }
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (
      stat.isDirectory() &&
      !file.startsWith(".") &&
      file !== "node_modules"
    ) {
      processDirectory(filePath);
    } else if (
      file.endsWith(".tsx") ||
      file.endsWith(".ts") ||
      file.endsWith(".jsx") ||
      file.endsWith(".js")
    ) {
      replaceInFile(filePath);
    }
  });
}

processDirectory("./app");
console.log("Color replacement complete!");
