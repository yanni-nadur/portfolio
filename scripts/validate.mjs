import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// -- CONSTANTS
const scriptDirectoryPath = path.dirname(fileURLToPath(import.meta.url));
const rootPath = path.resolve(scriptDirectoryPath, "..");

const requiredFileArray = [
    "index.html",
    "src/main.tsx",
    "src/App.tsx",
    "src/content/projects.ts",
    "src/content/experience.ts",
    "src/content/skills.ts",
    "src/content/testimonials.ts",
    "src/content/ui.ts",
    "src/content/profile.ts",
    "public/files/resume-en.pdf",
    "public/files/resume-pt.pdf",
    "public/images/origami.svg",
    ".github/workflows/deploy.yml"
];

const featuredProjectIdArray = [
    "kongsberg"
];

const caseStudyKeyArray = [
    "title",
    "category",
    "summary",
    "overview",
    "role",
    "challenge",
    "approach",
    "architecture",
    "results",
    "technologies"
];

let exitCode = 0;

// -- FUNCTIONS
function fail(messageText)
{
    console.error("FAIL:", messageText);
    exitCode = 1;
}

function pass(messageText)
{
    console.log("PASS:", messageText);
}

function assert(condition, messageText)
{
    if (condition)
    {
        pass(messageText);
    }
    else
    {
        fail(messageText);
    }
}

function readSource(relativePath)
{
    return fs.readFileSync(path.join(rootPath, relativePath), "utf8");
}

function countIdOccurrences(sourceText, idArray)
{
    return idArray.filter((idText) => sourceText.includes(`id: "${idText}"`)).length;
}

function extractQuotedValues(sourceText, propertyName)
{
    const pattern = new RegExp(`${propertyName}:\\s*"([^"]+)"`, "g");
    const valueArray = [];
    let matchResult = pattern.exec(sourceText);

    while (matchResult)
    {
        valueArray.push(matchResult[1]);
        matchResult = pattern.exec(sourceText);
    }

    return valueArray;
}

function extractUiKeys(sourceText, languageCode)
{
    const startMarker = `${languageCode}: {`;
    const startIndex = sourceText.indexOf(startMarker);

    if (startIndex < 0)
    {
        return [];
    }

    let depth = 0;
    let bodyStartIndex = -1;

    for (let index = startIndex; index < sourceText.length; index += 1)
    {
        const character = sourceText[index];

        if (character === "{")
        {
            depth += 1;

            if (depth === 1)
            {
                bodyStartIndex = index + 1;
            }
        }
        else if (character === "}")
        {
            depth -= 1;

            if (depth === 0 && bodyStartIndex >= 0)
            {
                const blockText = sourceText.slice(bodyStartIndex, index);
                const keyArray = [];
                const keyPattern = /^\s{8}(\w+):/gm;
                let keyMatch = keyPattern.exec(blockText);

                while (keyMatch)
                {
                    keyArray.push(keyMatch[1]);
                    keyMatch = keyPattern.exec(blockText);
                }

                return keyArray;
            }
        }
    }

    return [];
}

function validateAssetPath(relativePath, labelText)
{
    if (!relativePath)
    {
        return;
    }

    const absolutePath = path.join(rootPath, "public", relativePath);
    assert(fs.existsSync(absolutePath), `${labelText} exists (${relativePath})`);
}

// -- STATEMENTS
console.log("Validating portfolio project...\n");

requiredFileArray.forEach((relativePath) =>
{
    assert(fs.existsSync(path.join(rootPath, relativePath)), `${relativePath} exists`);
});

const htmlText = readSource("index.html");
assert(htmlText.includes('lang="en"'), "HTML default language is English");
assert(htmlText.includes("og:title"), "Open Graph title meta exists");
assert(htmlText.includes("/src/main.tsx"), "Vite entry is referenced");
assert(!htmlText.includes("../portfolio/"), "HTML avoids legacy ../portfolio/ paths");

const projectsText = readSource("src/content/projects.ts");
const experienceText = readSource("src/content/experience.ts");
const skillsText = readSource("src/content/skills.ts");
const testimonialsText = readSource("src/content/testimonials.ts");
const uiText = readSource("src/content/ui.ts");
const profileText = readSource("src/content/profile.ts");
const packageText = readSource("package.json");

assert(
    countIdOccurrences(projectsText, featuredProjectIdArray) === 1,
    "featured project exists"
);
assert(projectsText.includes("additionalProjectArray"), "additional projects export exists");
assert(
    (projectsText.match(/id: "notco"|id: "nordic-batteries"|id: "karen-oliveira"|id: "nantes-mello"|id: "solon"/g) || []).length === 5,
    "additional projects exist"
);

const contentTextPathArray = [
    "src/content/projects.ts",
    "src/content/experience.ts",
    "src/content/skills.ts",
    "src/content/testimonials.ts",
    "src/content/ui.ts",
    "src/content/profile.ts",
    "package.json",
    "README.md"
];
contentTextPathArray.forEach((relativePath) =>
{
    const contentText = readSource(relativePath);
    assert(!contentText.includes("\u2014"), `${relativePath} has no em dash`);
    assert(!contentText.includes("\u2013"), `${relativePath} has no en dash`);
});

const experienceIdArray = extractQuotedValues(experienceText, "id");
assert(experienceIdArray.length >= 4, "experience entries exist");

const expectedSkillGroupIdArray = [
    "frontend",
    "backend",
    "ai",
    "databases",
    "payments",
    "architecture",
    "cloud",
    "quality"
];
expectedSkillGroupIdArray.forEach((groupId) =>
{
    assert(skillsText.includes(`id: "${groupId}"`), `skill group exists: ${groupId}`);
});
assert(skillsText.includes("trackArray:"), "skill groups expose trackArray");
assert(skillsText.includes("audioPresetId:"), "skill groups expose audio presets");
assert(skillsText.includes("languageSkillArray"), "language skills remain outside music tracks");

const frontendPlaylistPath = path.join(rootPath, "frontend_lofi_playlist.json");
assert(fs.existsSync(frontendPlaylistPath), "frontend_lofi_playlist.json exists");
const frontendPlaylist = JSON.parse(fs.readFileSync(frontendPlaylistPath, "utf8"));
assert(frontendPlaylist.albumId === "frontend", "frontend playlist albumId is frontend");
assert(frontendPlaylist.codec === "opus", "frontend playlist codec is opus");
assert(frontendPlaylist.container === "ogg", "frontend playlist container is ogg");
assert(frontendPlaylist.fallback === null, "frontend playlist has no codec fallback");
assert(Array.isArray(frontendPlaylist.tracks), "frontend playlist exposes tracks");
assert(frontendPlaylist.tracks.length === 8, "frontend playlist has eight original Frontend tracks");

const missingFrontendAudioPathArray = [];
frontendPlaylist.tracks.forEach((track) =>
{
    assert(typeof track.skillId === "string" && track.skillId.length > 0, "frontend track has skillId");
    assert(typeof track.file === "string" && track.file.endsWith(".ogg"), `frontend track ${track.skillId} uses .ogg`);
    assert(
        skillsText.includes(`"${track.skillId}"`),
        `skills.ts includes frontend track ${track.skillId}`
    );
    const audioRelativePath = `public/audio/skillwave/frontend/${track.file}`;
    if (!fs.existsSync(path.join(rootPath, audioRelativePath)))
    {
        missingFrontendAudioPathArray.push(audioRelativePath);
    }
});

if (missingFrontendAudioPathArray.length > 0)
{
    fail(
        `missing Skillwave frontend audio files (not substituted):\n  - ${missingFrontendAudioPathArray.join("\n  - ")}`
    );
}
else
{
    console.log("OK: all eight original Frontend Vol. 01 Ogg Opus files are present");
}

const skillwaveManifestPath = path.join(rootPath, "skillwave_all_65_tracks.json");
assert(fs.existsSync(skillwaveManifestPath), "skillwave_all_65_tracks.json exists");
const skillwaveManifest = JSON.parse(fs.readFileSync(skillwaveManifestPath, "utf8"));
assert(skillwaveManifest.codec === "opus", "Skillwave manifest codec is opus");
assert(skillwaveManifest.container === "ogg", "Skillwave manifest container is ogg");
assert(skillwaveManifest.fallback === null, "Skillwave manifest has no codec fallback");
assert(Array.isArray(skillwaveManifest.albums), "Skillwave manifest exposes albums");
assert(skillwaveManifest.albums.length === 8, "Skillwave has eight albums");

const skillwaveSkillIdRemapMap = {
    "rest-openapi": "rest-swagger-openapi",
    "ai-image-generation": "ai-image",
    "data-modeling-sql-optimization": "sql-modeling-optimization",
    "event-driven-systems": "event-driven",
    messaging: "messaging-async",
    "github-actions-ci-cd": "github-actions-cicd",
    "testing-unit-integration-e2e": "automated-testing",
    "wordpress-craft-cms": "wordpress-craft"
};
const expectedAlbumTrackCountByAlbumIdMap = {
    frontend: 11,
    backend: 9,
    ai: 7,
    databases: 6,
    payments: 8,
    architecture: 8,
    "cloud-devops": 7,
    "quality-tools": 9
};
const missingSkillwaveAudioPathArray = [];
const skillwaveSkillIdSet = new Set();
let skillwaveTrackCount = 0;

skillwaveManifest.albums.forEach((album) =>
{
    assert(typeof album.albumId === "string", "Skillwave album has albumId");
    assert(Array.isArray(album.tracks), `Skillwave album ${album.albumId} exposes tracks`);
    assert(
        album.tracks.length === expectedAlbumTrackCountByAlbumIdMap[album.albumId],
        `Skillwave album ${album.albumId} has ${expectedAlbumTrackCountByAlbumIdMap[album.albumId]} tracks`
    );

    album.tracks.forEach((track) =>
    {
        skillwaveTrackCount += 1;
        const skillId = skillwaveSkillIdRemapMap[track.skillId] ?? track.skillId;
        assert(typeof skillId === "string" && skillId.length > 0, "Skillwave track has skillId");
        assert(!skillwaveSkillIdSet.has(skillId), `Skillwave skillId is unique: ${skillId}`);
        skillwaveSkillIdSet.add(skillId);
        assert(
            skillsText.includes(`"${skillId}"`),
            `skills.ts includes Skillwave track ${skillId}`
        );
        assert(typeof track.file === "string" && track.file.endsWith(".ogg"), `Skillwave track ${skillId} uses .ogg`);
        assert(typeof track.audioPath === "string" && track.audioPath.endsWith(".ogg"), `Skillwave track ${skillId} has audioPath`);
        const audioRelativePath = path.join("public", track.audioPath).replace(/\\/g, "/");
        if (!fs.existsSync(path.join(rootPath, audioRelativePath)))
        {
            missingSkillwaveAudioPathArray.push(audioRelativePath);
        }
    });
});

assert(skillwaveTrackCount === 65, "Skillwave has 65 unique tracks");

if (missingSkillwaveAudioPathArray.length > 0)
{
    fail(
        `missing Skillwave audio files (not substituted):\n  - ${missingSkillwaveAudioPathArray.join("\n  - ")}`
    );
}
else
{
    console.log("OK: all 65 Skillwave Ogg Opus files are present");
}

const skillwaveCatalogText = readSource("src/apps/music/audio/skillwaveCatalog.ts");
assert(skillwaveCatalogText.includes("skillwaveAlbumTrackArray"), "Skillwave catalog exports track array");
assert(skillwaveCatalogText.includes("getAssetUrl"), "Skillwave catalog resolves assets via getAssetUrl");

const musicEngineText = readSource("src/apps/music/audio/SkillwaveAudioEngine.ts");
assert(musicEngineText.includes("HTMLAudioElement"), "Skillwave engine uses HTMLAudioElement");
assert(musicEngineText.includes("canplay"), "Skillwave engine listens for canplay");
assert(!musicEngineText.includes("from \"tone\"") && !musicEngineText.includes("from 'tone'"), "Skillwave engine does not import tone");
assert(!packageText.includes("\"tone\""), "package.json no longer depends on tone");

const testimonialIdArray = extractQuotedValues(testimonialsText, "id");
assert(testimonialIdArray.length === 5, "five testimonials exist");

const uiEnKeyArray = extractUiKeys(uiText, "en");
const uiPtKeyArray = extractUiKeys(uiText, "pt");
assert(uiEnKeyArray.length > 20, "UI English keys exist");
uiEnKeyArray.forEach((keyName) =>
{
    assert(uiPtKeyArray.includes(keyName), `UI key translated to PT: ${keyName}`);
});

featuredProjectIdArray.forEach((projectId) =>
{
    const projectStartIndex = projectsText.indexOf(`id: "${projectId}"`);
    assert(projectStartIndex >= 0, `featured:${projectId} exists`);

    const nextProjectIndex = featuredProjectIdArray
        .map((otherId) => projectsText.indexOf(`id: "${otherId}"`))
        .filter((index) => index > projectStartIndex)
        .sort((left, right) => left - right)[0] ?? projectsText.length;

    const projectBlock = projectsText.slice(projectStartIndex, nextProjectIndex);

    caseStudyKeyArray.forEach((keyName) =>
    {
        assert(
            projectBlock.includes(`${keyName}:`),
            `featured:${projectId} includes ${keyName}`
        );
    });

    assert(projectBlock.includes("en:"), `featured:${projectId} has en`);
    assert(projectBlock.includes("pt:"), `featured:${projectId} has pt`);
    assert(projectBlock.includes("media:"), `featured:${projectId} has media`);

    if (projectId === "kongsberg")
    {
        assert(projectBlock.includes("hasPublicUrl: true"), `${projectId} has a public URL`);
        assert(projectBlock.includes("images/kongsbergimage.webp"), `${projectId} image path present`);
        validateAssetPath("images/kongsbergimage.webp", `${projectId} image`);
    }
    else
    {
        assert(projectBlock.includes("hasPublicUrl: false"), `${projectId} has no public URL`);
        assert(projectBlock.includes("url: null"), `${projectId} url is null`);
    }
});

[
    "images/notcoimage.webp",
    "images/nordicimage.webp",
    "images/solonimage.webp",
    "images/ulisses.jpeg",
    "images/felipe.jpeg",
    "images/rodolfo.jpeg",
    "files/resume-en.pdf",
    "files/resume-pt.pdf"
].forEach((relativePath) =>
{
    validateAssetPath(relativePath, relativePath);
});

assert(profileText.includes("yanninadur@gmail.com"), "profile email looks valid");
assert(projectsText.includes("karen-oliveira"), "karen project restored");
assert(projectsText.includes("nantes-mello"), "nantes project restored");
assert(fs.existsSync(path.join(rootPath, "public/images/karenimage.webp")), "karen image exists");
assert(fs.existsSync(path.join(rootPath, "public/images/nantesimage.webp")), "nantes image exists");
assert(!fs.existsSync(path.join(rootPath, "public/images/karenimage.png")), "heavy karen png removed");
assert(fs.existsSync(path.join(rootPath, "public/images/nordicimage.webp")), "nordic image converted to webp");
assert(!fs.existsSync(path.join(rootPath, "public/images/nordicimage.jpg")), "nordic jpg removed");

experienceIdArray.forEach((entryId) =>
{
    const blockStart = experienceText.indexOf(`id: "${entryId}"`);
    const blockText = experienceText.slice(blockStart, blockStart + 1200);
    assert(blockText.includes("startDate:"), `experience:${entryId} has startDate`);
    assert(blockText.includes("track:"), `experience:${entryId} has track`);
    assert(blockText.includes("en:"), `experience:${entryId} has en`);
    assert(blockText.includes("pt:"), `experience:${entryId} has pt`);
});

if (exitCode)
{
    console.log("\nValidation finished with failures.");
    process.exit(1);
}

console.log("\nValidation finished successfully.");
