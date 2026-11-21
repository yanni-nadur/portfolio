import { getAssetUrl } from "../../../content";
import type { SkillwaveAlbumCredits, SkillwaveAlbumTrack } from "./types";

// -- CONSTANTS
export const skillwaveAlbumCredits: SkillwaveAlbumCredits = {
    artist: "Purrple Cat",
    artistUrl: "https://purrplecat.com/",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    catalogUrl: "https://www.freelofi.com/",
    requiredAttribution: "Music by Purrple Cat (https://purrplecat.com/), licensed under CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/). Format adaptation: original MP3 transcoded to Ogg/Opus at a target bitrate of 64 kbps."
};

const skillwaveTrackDefinitionArray: Array<{
    skillId: string;
    albumId: string;
    skillName: string;
    title: string;
    sourceAlbum: string;
    durationLabel: string;
    fileName: string;
    relativePath: string;
    originalSelection: boolean;
}> = [
    {
        skillId: "typescript",
        albumId: "frontend",
        skillName: "TypeScript",
        title: "Flickering Light in the Dark",
        sourceAlbum: "Brain Fog",
        durationLabel: "02:22",
        fileName: "typescript.ogg",
        relativePath: "audio/skillwave/frontend/typescript.ogg",
        originalSelection: true
    },
    {
        skillId: "javascript",
        albumId: "frontend",
        skillName: "JavaScript",
        title: "Vibin'",
        sourceAlbum: "Happy Place",
        durationLabel: "01:52",
        fileName: "javascript.ogg",
        relativePath: "audio/skillwave/frontend/javascript.ogg",
        originalSelection: true
    },
    {
        skillId: "react",
        albumId: "frontend",
        skillName: "React",
        title: "Coffee Jelly",
        sourceAlbum: "A Good Book",
        durationLabel: "02:09",
        fileName: "react.ogg",
        relativePath: "audio/skillwave/frontend/react.ogg",
        originalSelection: true
    },
    {
        skillId: "nextjs",
        albumId: "frontend",
        skillName: "Next.js",
        title: "3 A.M. Radio",
        sourceAlbum: "City Nights 3",
        durationLabel: "03:00",
        fileName: "nextjs.ogg",
        relativePath: "audio/skillwave/frontend/nextjs.ogg",
        originalSelection: true
    },
    {
        skillId: "angular",
        albumId: "frontend",
        skillName: "Angular",
        title: "Refractions",
        sourceAlbum: "Multiverse 2",
        durationLabel: "03:10",
        fileName: "angular.ogg",
        relativePath: "audio/skillwave/frontend/angular.ogg",
        originalSelection: true
    },
    {
        skillId: "svelte-5",
        albumId: "frontend",
        skillName: "Svelte 5",
        title: "Aurora",
        sourceAlbum: "Ice Palace",
        durationLabel: "03:01",
        fileName: "svelte-5.ogg",
        relativePath: "audio/skillwave/frontend/svelte-5.ogg",
        originalSelection: true
    },
    {
        skillId: "preact",
        albumId: "frontend",
        skillName: "Preact",
        title: "Cool Breeze",
        sourceAlbum: "Tranquil Trails",
        durationLabel: "02:21",
        fileName: "preact.ogg",
        relativePath: "audio/skillwave/frontend/preact.ogg",
        originalSelection: true
    },
    {
        skillId: "html-css-tailwind",
        albumId: "frontend",
        skillName: "HTML5 / CSS3 / Tailwind CSS",
        title: "Flourish",
        sourceAlbum: "Bloom",
        durationLabel: "02:37",
        fileName: "html-css-tailwind.ogg",
        relativePath: "audio/skillwave/frontend/html-css-tailwind.ogg",
        originalSelection: true
    },
    {
        skillId: "responsiveness",
        albumId: "frontend",
        skillName: "Responsiveness",
        title: "Windy",
        sourceAlbum: "Above the Clouds",
        durationLabel: "02:36",
        fileName: "responsiveness.ogg",
        relativePath: "audio/skillwave/frontend/responsiveness.ogg",
        originalSelection: false
    },
    {
        skillId: "accessibility",
        albumId: "frontend",
        skillName: "Accessibility",
        title: "Serendipity",
        sourceAlbum: "Signs of Life",
        durationLabel: "02:48",
        fileName: "accessibility.ogg",
        relativePath: "audio/skillwave/frontend/accessibility.ogg",
        originalSelection: false
    },
    {
        skillId: "seo",
        albumId: "frontend",
        skillName: "SEO",
        title: "Discovery",
        sourceAlbum: "House in the Woods",
        durationLabel: "02:24",
        fileName: "seo.ogg",
        relativePath: "audio/skillwave/frontend/seo.ogg",
        originalSelection: false
    },
    {
        skillId: "csharp-dotnet",
        albumId: "backend",
        skillName: "C# / .NET",
        title: "After Hours",
        sourceAlbum: "Night Train",
        durationLabel: "03:05",
        fileName: "csharp-dotnet.ogg",
        relativePath: "audio/skillwave/backend/csharp-dotnet.ogg",
        originalSelection: false
    },
    {
        skillId: "aspnet-core",
        albumId: "backend",
        skillName: "ASP.NET Core",
        title: "Squeaky Computer Chair",
        sourceAlbum: "Now or Never",
        durationLabel: "02:25",
        fileName: "aspnet-core.ogg",
        relativePath: "audio/skillwave/backend/aspnet-core.ogg",
        originalSelection: false
    },
    {
        skillId: "entity-framework-core",
        albumId: "backend",
        skillName: "Entity Framework Core",
        title: "The Golden Ratio",
        sourceAlbum: "Just Relax",
        durationLabel: "01:35",
        fileName: "entity-framework-core.ogg",
        relativePath: "audio/skillwave/backend/entity-framework-core.ogg",
        originalSelection: false
    },
    {
        skillId: "nodejs",
        albumId: "backend",
        skillName: "Node.js",
        title: "Downtown",
        sourceAlbum: "City Nights 3",
        durationLabel: "02:43",
        fileName: "nodejs.ogg",
        relativePath: "audio/skillwave/backend/nodejs.ogg",
        originalSelection: false
    },
    {
        skillId: "fastify",
        albumId: "backend",
        skillName: "Fastify",
        title: "Chugging Along",
        sourceAlbum: "Night Train",
        durationLabel: "02:20",
        fileName: "fastify.ogg",
        relativePath: "audio/skillwave/backend/fastify.ogg",
        originalSelection: false
    },
    {
        skillId: "nestjs",
        albumId: "backend",
        skillName: "NestJS",
        title: "Labyrinth",
        sourceAlbum: "Dino Land",
        durationLabel: "04:03",
        fileName: "nestjs.ogg",
        relativePath: "audio/skillwave/backend/nestjs.ogg",
        originalSelection: false
    },
    {
        skillId: "deno",
        albumId: "backend",
        skillName: "Deno",
        title: "Sunlit Shore",
        sourceAlbum: "Pelagic Journey",
        durationLabel: "02:13",
        fileName: "deno.ogg",
        relativePath: "audio/skillwave/backend/deno.ogg",
        originalSelection: false
    },
    {
        skillId: "php-laravel",
        albumId: "backend",
        skillName: "PHP / Laravel",
        title: "Golden Hour",
        sourceAlbum: "Happy Place",
        durationLabel: "03:15",
        fileName: "php-laravel.ogg",
        relativePath: "audio/skillwave/backend/php-laravel.ogg",
        originalSelection: false
    },
    {
        skillId: "rest-swagger-openapi",
        albumId: "backend",
        skillName: "REST / Swagger / OpenAPI",
        title: "Contact",
        sourceAlbum: "Signs of Life",
        durationLabel: "02:37",
        fileName: "rest-openapi.ogg",
        relativePath: "audio/skillwave/backend/rest-openapi.ogg",
        originalSelection: false
    },
    {
        skillId: "llms",
        albumId: "ai",
        skillName: "LLMs",
        title: "Otherworldly",
        sourceAlbum: "Multiverse",
        durationLabel: "03:44",
        fileName: "llms.ogg",
        relativePath: "audio/skillwave/ai/llms.ogg",
        originalSelection: false
    },
    {
        skillId: "openai-openrouter",
        albumId: "ai",
        skillName: "OpenAI / OpenRouter",
        title: "Nexus",
        sourceAlbum: "Multiverse 2",
        durationLabel: "02:49",
        fileName: "openai-openrouter.ogg",
        relativePath: "audio/skillwave/ai/openai-openrouter.ogg",
        originalSelection: false
    },
    {
        skillId: "model-routing",
        albumId: "ai",
        skillName: "Model routing",
        title: "Paradox",
        sourceAlbum: "Multiverse 2",
        durationLabel: "02:38",
        fileName: "model-routing.ogg",
        relativePath: "audio/skillwave/ai/model-routing.ogg",
        originalSelection: false
    },
    {
        skillId: "contextual-memory",
        albumId: "ai",
        skillName: "Contextual memory",
        title: "Remember",
        sourceAlbum: "Memories",
        durationLabel: "03:08",
        fileName: "contextual-memory.ogg",
        relativePath: "audio/skillwave/ai/contextual-memory.ogg",
        originalSelection: false
    },
    {
        skillId: "web-search",
        albumId: "ai",
        skillName: "Web search",
        title: "Exploration",
        sourceAlbum: "City Nights 2",
        durationLabel: "02:10",
        fileName: "web-search.ogg",
        relativePath: "audio/skillwave/ai/web-search.ogg",
        originalSelection: false
    },
    {
        skillId: "sse-streaming",
        albumId: "ai",
        skillName: "SSE streaming",
        title: "Time Loop",
        sourceAlbum: "Night Train",
        durationLabel: "03:24",
        fileName: "sse-streaming.ogg",
        relativePath: "audio/skillwave/ai/sse-streaming.ogg",
        originalSelection: false
    },
    {
        skillId: "ai-image",
        albumId: "ai",
        skillName: "AI image generation / editing",
        title: "Transformation",
        sourceAlbum: "Multiverse 2",
        durationLabel: "02:15",
        fileName: "ai-image-generation.ogg",
        relativePath: "audio/skillwave/ai/ai-image-generation.ogg",
        originalSelection: false
    },
    {
        skillId: "postgresql",
        albumId: "databases",
        skillName: "PostgreSQL",
        title: "Ancient Trees",
        sourceAlbum: "Endless Forest",
        durationLabel: "03:42",
        fileName: "postgresql.ogg",
        relativePath: "audio/skillwave/databases/postgresql.ogg",
        originalSelection: false
    },
    {
        skillId: "sql-server",
        albumId: "databases",
        skillName: "SQL Server",
        title: "Skyscrapers",
        sourceAlbum: "City Nights 3",
        durationLabel: "02:31",
        fileName: "sql-server.ogg",
        relativePath: "audio/skillwave/databases/sql-server.ogg",
        originalSelection: false
    },
    {
        skillId: "mysql",
        albumId: "databases",
        skillName: "MySQL",
        title: "Calm Waters",
        sourceAlbum: "Mellow Skies",
        durationLabel: "02:09",
        fileName: "mysql.ogg",
        relativePath: "audio/skillwave/databases/mysql.ogg",
        originalSelection: false
    },
    {
        skillId: "mongodb",
        albumId: "databases",
        skillName: "MongoDB",
        title: "Turbulence",
        sourceAlbum: "Above the Clouds",
        durationLabel: "03:21",
        fileName: "mongodb.ogg",
        relativePath: "audio/skillwave/databases/mongodb.ogg",
        originalSelection: false
    },
    {
        skillId: "supabase-rls",
        albumId: "databases",
        skillName: "Supabase / RLS",
        title: "Under the Canopy",
        sourceAlbum: "Tranquil Trails",
        durationLabel: "03:21",
        fileName: "supabase-rls.ogg",
        relativePath: "audio/skillwave/databases/supabase-rls.ogg",
        originalSelection: false
    },
    {
        skillId: "sql-modeling-optimization",
        albumId: "databases",
        skillName: "Data modeling / SQL optimization",
        title: "Fragments",
        sourceAlbum: "City Nights 2",
        durationLabel: "02:33",
        fileName: "data-modeling-sql-optimization.ogg",
        relativePath: "audio/skillwave/databases/data-modeling-sql-optimization.ogg",
        originalSelection: false
    },
    {
        skillId: "stripe-checkout",
        albumId: "payments",
        skillName: "Stripe Checkout",
        title: "Corner Store",
        sourceAlbum: "City Nights 3",
        durationLabel: "02:54",
        fileName: "stripe-checkout.ogg",
        relativePath: "audio/skillwave/payments/stripe-checkout.ogg",
        originalSelection: false
    },
    {
        skillId: "stripe-connect",
        albumId: "payments",
        skillName: "Stripe Connect",
        title: "Crossroads",
        sourceAlbum: "Night Train",
        durationLabel: "02:59",
        fileName: "stripe-connect.ogg",
        relativePath: "audio/skillwave/payments/stripe-connect.ogg",
        originalSelection: false
    },
    {
        skillId: "commissions-payouts",
        albumId: "payments",
        skillName: "Commissions / payouts",
        title: "Message in a Bottle",
        sourceAlbum: "Oasis",
        durationLabel: "03:26",
        fileName: "commissions-payouts.ogg",
        relativePath: "audio/skillwave/payments/commissions-payouts.ogg",
        originalSelection: false
    },
    {
        skillId: "webhooks",
        albumId: "payments",
        skillName: "Webhooks",
        title: "Pitter Patter",
        sourceAlbum: "House in the Woods",
        durationLabel: "03:00",
        fileName: "webhooks.ogg",
        relativePath: "audio/skillwave/payments/webhooks.ogg",
        originalSelection: false
    },
    {
        skillId: "erpnext",
        albumId: "payments",
        skillName: "ERPNext",
        title: "Artifact",
        sourceAlbum: "Sands of Time",
        durationLabel: "02:39",
        fileName: "erpnext.ogg",
        relativePath: "audio/skillwave/payments/erpnext.ogg",
        originalSelection: false
    },
    {
        skillId: "external-apis",
        albumId: "payments",
        skillName: "External API integrations",
        title: "Distant Ships",
        sourceAlbum: "Sea of Stars 2",
        durationLabel: "02:55",
        fileName: "external-apis.ogg",
        relativePath: "audio/skillwave/payments/external-apis.ogg",
        originalSelection: false
    },
    {
        skillId: "inventory",
        albumId: "payments",
        skillName: "Inventory / stock control",
        title: "Shopping Spree",
        sourceAlbum: "Snowbound",
        durationLabel: "02:16",
        fileName: "inventory.ogg",
        relativePath: "audio/skillwave/payments/inventory.ogg",
        originalSelection: false
    },
    {
        skillId: "idempotency-concurrency",
        albumId: "payments",
        skillName: "Idempotency / concurrency",
        title: "Going in Circles",
        sourceAlbum: "Endless Forest",
        durationLabel: "03:03",
        fileName: "idempotency-concurrency.ogg",
        relativePath: "audio/skillwave/payments/idempotency-concurrency.ogg",
        originalSelection: false
    },
    {
        skillId: "microservices",
        albumId: "architecture",
        skillName: "Microservices",
        title: "Intertwined",
        sourceAlbum: "Multiverse 2",
        durationLabel: "03:14",
        fileName: "microservices.ogg",
        relativePath: "audio/skillwave/architecture/microservices.ogg",
        originalSelection: false
    },
    {
        skillId: "solid-clean-architecture",
        albumId: "architecture",
        skillName: "SOLID / Clean Architecture",
        title: "Creation",
        sourceAlbum: "Multiverse",
        durationLabel: "03:13",
        fileName: "solid-clean-architecture.ogg",
        relativePath: "audio/skillwave/architecture/solid-clean-architecture.ogg",
        originalSelection: false
    },
    {
        skillId: "layered-architecture",
        albumId: "architecture",
        skillName: "Layered architecture",
        title: "Elevated",
        sourceAlbum: "Sea of Stars 2",
        durationLabel: "03:40",
        fileName: "layered-architecture.ogg",
        relativePath: "audio/skillwave/architecture/layered-architecture.ogg",
        originalSelection: false
    },
    {
        skillId: "bff",
        albumId: "architecture",
        skillName: "BFF",
        title: "Window Seat",
        sourceAlbum: "City Nights 3",
        durationLabel: "02:46",
        fileName: "bff.ogg",
        relativePath: "audio/skillwave/architecture/bff.ogg",
        originalSelection: false
    },
    {
        skillId: "micro-frontends",
        albumId: "architecture",
        skillName: "Micro Frontends",
        title: "Convergence",
        sourceAlbum: "Multiverse 2",
        durationLabel: "03:06",
        fileName: "micro-frontends.ogg",
        relativePath: "audio/skillwave/architecture/micro-frontends.ogg",
        originalSelection: false
    },
    {
        skillId: "event-driven",
        albumId: "architecture",
        skillName: "Event-driven systems",
        title: "Meteorites",
        sourceAlbum: "Sea of Stars",
        durationLabel: "03:03",
        fileName: "event-driven-systems.ogg",
        relativePath: "audio/skillwave/architecture/event-driven-systems.ogg",
        originalSelection: false
    },
    {
        skillId: "messaging-async",
        albumId: "architecture",
        skillName: "Messaging / asynchronous processing",
        title: "Satellite",
        sourceAlbum: "Sea of Stars 2",
        durationLabel: "02:50",
        fileName: "messaging.ogg",
        relativePath: "audio/skillwave/architecture/messaging.ogg",
        originalSelection: false
    },
    {
        skillId: "dependency-injection",
        albumId: "architecture",
        skillName: "Dependency injection",
        title: "Fading",
        sourceAlbum: "Sleep Tight",
        durationLabel: "03:34",
        fileName: "dependency-injection.ogg",
        relativePath: "audio/skillwave/architecture/dependency-injection.ogg",
        originalSelection: false
    },
    {
        skillId: "aws",
        albumId: "cloud",
        skillName: "AWS (EC2 / ECS / S3 / RDS / Lambda)",
        title: "Flying",
        sourceAlbum: "Above the Clouds",
        durationLabel: "02:59",
        fileName: "aws.ogg",
        relativePath: "audio/skillwave/cloud-devops/aws.ogg",
        originalSelection: false
    },
    {
        skillId: "azure",
        albumId: "cloud",
        skillName: "Microsoft Azure",
        title: "Luminous",
        sourceAlbum: "Sea of Stars 2",
        durationLabel: "02:32",
        fileName: "azure.ogg",
        relativePath: "audio/skillwave/cloud-devops/azure.ogg",
        originalSelection: false
    },
    {
        skillId: "docker",
        albumId: "cloud",
        skillName: "Docker",
        title: "Cardboard Box Adventure",
        sourceAlbum: "Cat Nap",
        durationLabel: "02:39",
        fileName: "docker.ogg",
        relativePath: "audio/skillwave/cloud-devops/docker.ogg",
        originalSelection: false
    },
    {
        skillId: "kubernetes",
        albumId: "cloud",
        skillName: "Kubernetes",
        title: "Constellations",
        sourceAlbum: "Sea of Stars 2",
        durationLabel: "02:45",
        fileName: "kubernetes.ogg",
        relativePath: "audio/skillwave/cloud-devops/kubernetes.ogg",
        originalSelection: false
    },
    {
        skillId: "github-actions-cicd",
        albumId: "cloud",
        skillName: "GitHub Actions / CI/CD",
        title: "Trying Something New",
        sourceAlbum: "Now or Never",
        durationLabel: "02:50",
        fileName: "github-actions-ci-cd.ogg",
        relativePath: "audio/skillwave/cloud-devops/github-actions-ci-cd.ogg",
        originalSelection: false
    },
    {
        skillId: "rabbitmq",
        albumId: "cloud",
        skillName: "RabbitMQ",
        title: "Changes",
        sourceAlbum: "Tranquil Trails",
        durationLabel: "03:16",
        fileName: "rabbitmq.ogg",
        relativePath: "audio/skillwave/cloud-devops/rabbitmq.ogg",
        originalSelection: false
    },
    {
        skillId: "sns-sqs",
        albumId: "cloud",
        skillName: "AWS SNS / SQS",
        title: "Cosmic Echoes",
        sourceAlbum: "Multiverse",
        durationLabel: "02:40",
        fileName: "sns-sqs.ogg",
        relativePath: "audio/skillwave/cloud-devops/sns-sqs.ogg",
        originalSelection: false
    },
    {
        skillId: "jest",
        albumId: "quality",
        skillName: "Jest",
        title: "Treat Time",
        sourceAlbum: "Cat Nap",
        durationLabel: "02:08",
        fileName: "jest.ogg",
        relativePath: "audio/skillwave/quality-tools/jest.ogg",
        originalSelection: false
    },
    {
        skillId: "vitest",
        albumId: "quality",
        skillName: "Vitest",
        title: "Saturday Morning",
        sourceAlbum: "Indigo Dreams",
        durationLabel: "01:48",
        fileName: "vitest.ogg",
        relativePath: "audio/skillwave/quality-tools/vitest.ogg",
        originalSelection: false
    },
    {
        skillId: "cypress",
        albumId: "quality",
        skillName: "Cypress",
        title: "Downpour",
        sourceAlbum: "Eye of the Storm",
        durationLabel: "02:37",
        fileName: "cypress.ogg",
        relativePath: "audio/skillwave/quality-tools/cypress.ogg",
        originalSelection: false
    },
    {
        skillId: "automated-testing",
        albumId: "quality",
        skillName: "Unit / integration / E2E tests",
        title: "Frosted Evergreen",
        sourceAlbum: "Ice Palace",
        durationLabel: "02:13",
        fileName: "testing-unit-integration-e2e.ogg",
        relativePath: "audio/skillwave/quality-tools/testing-unit-integration-e2e.ogg",
        originalSelection: false
    },
    {
        skillId: "structured-logging",
        albumId: "quality",
        skillName: "Structured logging",
        title: "Foggy Window",
        sourceAlbum: "Just Relax",
        durationLabel: "03:13",
        fileName: "structured-logging.ogg",
        relativePath: "audio/skillwave/quality-tools/structured-logging.ogg",
        originalSelection: false
    },
    {
        skillId: "cloudwatch-datadog",
        albumId: "quality",
        skillName: "CloudWatch / Datadog",
        title: "Night Owls",
        sourceAlbum: "City Nights 2",
        durationLabel: "02:41",
        fileName: "cloudwatch-datadog.ogg",
        relativePath: "audio/skillwave/quality-tools/cloudwatch-datadog.ogg",
        originalSelection: false
    },
    {
        skillId: "git",
        albumId: "quality",
        skillName: "Git",
        title: "A Short Walk With You",
        sourceAlbum: "Up All Night",
        durationLabel: "01:31",
        fileName: "git.ogg",
        relativePath: "audio/skillwave/quality-tools/git.ogg",
        originalSelection: false
    },
    {
        skillId: "ai-dev-tools",
        albumId: "quality",
        skillName: "Cursor / Claude / Copilot / Codex",
        title: "Loading Screen",
        sourceAlbum: "Nostalgia and Moving On",
        durationLabel: "02:35",
        fileName: "ai-dev-tools.ogg",
        relativePath: "audio/skillwave/quality-tools/ai-dev-tools.ogg",
        originalSelection: false
    },
    {
        skillId: "wordpress-craft",
        albumId: "quality",
        skillName: "WordPress / Craft CMS",
        title: "Spring Showers",
        sourceAlbum: "Bloom",
        durationLabel: "03:02",
        fileName: "wordpress-craft-cms.ogg",
        relativePath: "audio/skillwave/quality-tools/wordpress-craft-cms.ogg",
        originalSelection: false
    }
];

// -- FUNCTIONS
function parseDurationLabel(durationLabel: string): number
{
    const partArray = durationLabel.split(":");
    if (partArray.length !== 2)
    {
        return 0;
    }

    const minuteCount = Number(partArray[0]);
    const secondCount = Number(partArray[1]);

    if (!Number.isFinite(minuteCount) || !Number.isFinite(secondCount))
    {
        return 0;
    }

    return (minuteCount * 60) + secondCount;
}

function createSkillwaveAlbumTrack(
    definition: (typeof skillwaveTrackDefinitionArray)[number]
): SkillwaveAlbumTrack
{
    return {
        skillId: definition.skillId,
        albumId: definition.albumId,
        skillName: definition.skillName,
        title: definition.title,
        sourceAlbum: definition.sourceAlbum,
        durationLabel: definition.durationLabel,
        durationSecondCount: parseDurationLabel(definition.durationLabel),
        fileName: definition.fileName,
        relativePath: definition.relativePath,
        originalSelection: definition.originalSelection
    };
}

// -- CONSTANTS
export const skillwaveAlbumTrackArray: SkillwaveAlbumTrack[] = skillwaveTrackDefinitionArray.map(
    createSkillwaveAlbumTrack
);

export const skillwavePlayableTrackIdArray = skillwaveAlbumTrackArray.map(
    (track) => track.skillId
);

const skillwaveTrackByIdMap: Record<string, SkillwaveAlbumTrack> = Object.fromEntries(
    skillwaveAlbumTrackArray.map((track) => [track.skillId, track])
);

const skillwaveTrackIdArrayByAlbumIdMap: Record<string, string[]> = {};

skillwaveAlbumTrackArray.forEach((track) =>
{
    const trackIdArray = skillwaveTrackIdArrayByAlbumIdMap[track.albumId] ?? [];
    trackIdArray.push(track.skillId);
    skillwaveTrackIdArrayByAlbumIdMap[track.albumId] = trackIdArray;
});

// -- FUNCTIONS
export function findSkillwaveAlbumTrack(trackId: string): SkillwaveAlbumTrack | null
{
    return skillwaveTrackByIdMap[trackId] ?? null;
}

export function isSkillwavePlayableTrackId(trackId: string): boolean
{
    return Boolean(skillwaveTrackByIdMap[trackId]);
}

export function getSkillwaveTrackUrl(trackId: string): string | null
{
    const track = findSkillwaveAlbumTrack(trackId);

    if (!track)
    {
        return null;
    }

    return getAssetUrl(track.relativePath);
}

export function getSkillwaveAlbumTrackIdArray(albumId: string): string[]
{
    return skillwaveTrackIdArrayByAlbumIdMap[albumId] ?? [];
}

export function isOpusOggPlaybackSupported(): boolean
{
    if (typeof Audio === "undefined")
    {
        return false;
    }

    const audioElement = new Audio();
    const supportText = audioElement.canPlayType('audio/ogg; codecs="opus"')
        || audioElement.canPlayType("audio/ogg");

    return supportText === "probably" || supportText === "maybe";
}
