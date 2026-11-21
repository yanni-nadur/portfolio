import fs from "fs";
import path from "path";

function walk(dir, acc = [])
{
    for (const ent of fs.readdirSync(dir, { withFileTypes: true }))
    {
        const p = path.join(dir, ent.name);
        if (ent.isDirectory())
        {
            walk(p, acc);
        }
        else if (/\.(ts|tsx|js|mjs|html|css)$/.test(ent.name))
        {
            acc.push(p);
        }
    }
    return acc;
}

const ui = fs.readFileSync("src/content/ui.ts", "utf8");
const enMatch = ui.match(/en:\s*\{([\s\S]*?)\n\s*\},\s*pt:/);
const keys = [...enMatch[1].matchAll(/^\s*([A-Za-z0-9_]+):/gm)].map((m) => m[1]);

const files = walk("src").concat(["scripts/validate.mjs", "index.html"]);
const fileTextByPathMap = Object.fromEntries(files.map((f) => [f, fs.readFileSync(f, "utf8")]));
const corpusOutsideUi = Object.entries(fileTextByPathMap)
    .filter(([f]) => !f.replace(/\\/g, "/").endsWith("src/content/ui.ts"))
    .map(([, text]) => text)
    .join("\n");

const unusedKeys = [];
for (const key of keys)
{
    const tCall = new RegExp(`t\\(\\s*["']${key}["']`);
    const uiCopyAccess = new RegExp(`uiCopy\\.(en|pt)\\.${key}\\b`);
    const titleKey = new RegExp(`titleKey:\\s*["']${key}["']`);
    const stringLiteral = new RegExp(`["']${key}["']`);

    const hit =
        tCall.test(corpusOutsideUi)
        || uiCopyAccess.test(corpusOutsideUi)
        || titleKey.test(corpusOutsideUi)
        || stringLiteral.test(corpusOutsideUi);

    if (!hit)
    {
        unusedKeys.push(key);
    }
}

console.log("TOTAL_UI_KEYS", keys.length);
console.log("UNUSED_UI_KEYS", unusedKeys.length);
console.log(unusedKeys.join("\n"));

// skill icons unused vs skills content
const skillIcons = fs.readFileSync("src/content/skillIcons.ts", "utf8");
const iconKeys = [...skillIcons.matchAll(/^\s*"([^"]+)":\s*\{/gm)].map((m) => m[1]);
const skillsText = fs.readFileSync("src/content/skills.ts", "utf8");
const carousel = fs.readFileSync("src/components/SkillCarousel.tsx", "utf8");
const skillCorpus = skillsText + "\n" + carousel;

const unusedIcons = [];
for (const iconKey of iconKeys)
{
    // SkillCarousel splits on " / " and looks up parts; also checks exact names
    if (!skillCorpus.includes(iconKey))
    {
        unusedIcons.push(iconKey);
    }
}
console.log("\nTOTAL_ICON_KEYS", iconKeys.length);
console.log("UNUSED_ICON_KEYS", unusedIcons.length);
console.log(unusedIcons.join("\n"));

// Find exported symbols never imported
const exportPattern = /export (?:async )?function (\w+)|export const (\w+)|export type (\w+)|export \{ ([^}]+) \}/g;
const importNames = new Set();
for (const text of Object.values(fileTextByPathMap))
{
    for (const match of text.matchAll(/import\s+(?:type\s+)?\{([^}]+)\}/g))
    {
        for (const part of match[1].split(","))
        {
            const cleaned = part.trim().split(/\s+as\s+/)[0].trim();
            if (cleaned)
            {
                importNames.add(cleaned);
            }
        }
    }
    for (const match of text.matchAll(/import\s+(\w+)\s+from/g))
    {
        importNames.add(match[1]);
    }
}

const candidates = [];
for (const [filePath, text] of Object.entries(fileTextByPathMap))
{
    if (!filePath.includes(`${path.sep}src${path.sep}`) && !filePath.includes("/src/"))
    {
        continue;
    }
    let match;
    const re = /export (?:async )?function (\w+)|export const (\w+)|export type (\w+)|export \{ ([^}]+) \}/g;
    while ((match = re.exec(text)))
    {
        const names = [];
        if (match[1]) names.push(match[1]);
        if (match[2]) names.push(match[2]);
        if (match[3]) names.push(match[3]);
        if (match[4])
        {
            for (const part of match[4].split(","))
            {
                const cleaned = part.trim().split(/\s+as\s+/)[0].trim();
                if (cleaned) names.push(cleaned);
            }
        }
        for (const name of names)
        {
            if (!importNames.has(name) && name !== "App")
            {
                // Check if used in same file only (local use of export)
                const usagesOutsideDef = Object.entries(fileTextByPathMap)
                    .filter(([f]) => f !== filePath)
                    .some(([, other]) => new RegExp(`\\b${name}\\b`).test(other));
                if (!usagesOutsideDef)
                {
                    candidates.push(`${filePath.replace(/\\/g, "/")} :: ${name}`);
                }
            }
        }
    }
}
console.log("\nEXPORTS_NEVER_REFERENCED_OUTSIDE_FILE");
console.log(candidates.join("\n"));
