import type { SkillGroup } from "./types";

// -- CONSTANTS
export const skillGroupArray: SkillGroup[] = [
    {
        id: "frontend",
        en: {
            title: "Frontend",
            items: [
                "TypeScript",
                "JavaScript",
                "React",
                "Next.js",
                "Angular",
                "Svelte 5",
                "Preact",
                "HTML5 / CSS3 / Tailwind CSS"
            ]
        },
        pt: {
            title: "Frontend",
            items: [
                "TypeScript",
                "JavaScript",
                "React",
                "Next.js",
                "Angular",
                "Svelte 5",
                "Preact",
                "HTML5 / CSS3 / Tailwind CSS"
            ]
        }
    },
    {
        id: "backend",
        en: {
            title: "Backend & APIs",
            items: [
                "C# / .NET",
                "ASP.NET Core",
                "Entity Framework Core",
                "Node.js",
                "Fastify",
                "NestJS",
                "Deno",
                "REST / Swagger / OpenAPI"
            ]
        },
        pt: {
            title: "Backend & APIs",
            items: [
                "C# / .NET",
                "ASP.NET Core",
                "Entity Framework Core",
                "Node.js",
                "Fastify",
                "NestJS",
                "Deno",
                "REST / Swagger / OpenAPI"
            ]
        }
    },
    {
        id: "ai",
        en: {
            title: "Artificial Intelligence",
            items: [
                "LLMs",
                "OpenAI / OpenRouter",
                "Model routing",
                "Contextual memory",
                "Web search",
                "SSE streaming",
                "AI image generation / editing"
            ]
        },
        pt: {
            title: "Inteligência Artificial",
            items: [
                "LLMs",
                "OpenAI / OpenRouter",
                "Roteamento de modelos",
                "Memória contextual",
                "Busca web",
                "Streaming SSE",
                "Geração / edição de imagens por IA"
            ]
        }
    },
    {
        id: "data-payments",
        en: {
            title: "Data & Payments",
            items: [
                "PostgreSQL",
                "SQL Server",
                "MySQL",
                "MongoDB",
                "Supabase / RLS",
                "Stripe Checkout / Connect",
                "Idempotency & concurrency",
                "ERPNext"
            ]
        },
        pt: {
            title: "Dados & Pagamentos",
            items: [
                "PostgreSQL",
                "SQL Server",
                "MySQL",
                "MongoDB",
                "Supabase / RLS",
                "Stripe Checkout / Connect",
                "Idempotência & concorrência",
                "ERPNext"
            ]
        }
    },
    {
        id: "devops",
        en: {
            title: "Cloud, Quality & Tools",
            items: [
                "AWS",
                "Docker / Kubernetes",
                "GitHub Actions / CI/CD",
                "Jest / Vitest / Cypress",
                "Structured logging",
                "Cursor / Claude / Copilot / Codex",
                "RabbitMQ / SNS / SQS (familiar)",
                "CloudWatch / Datadog (familiar)"
            ]
        },
        pt: {
            title: "Cloud, Qualidade & Ferramentas",
            items: [
                "AWS",
                "Docker / Kubernetes",
                "GitHub Actions / CI/CD",
                "Jest / Vitest / Cypress",
                "Logs estruturados",
                "Cursor / Claude / Copilot / Codex",
                "RabbitMQ / SNS / SQS (familiaridade)",
                "CloudWatch / Datadog (familiaridade)"
            ]
        }
    },
    {
        id: "additional",
        en: {
            title: "Architecture & Additional",
            items: [
                "SOLID / Clean Architecture",
                "Layered architecture",
                "Event-driven systems",
                "PHP / Laravel",
                "WordPress / Craft CMS",
                "Portuguese (native)",
                "English (advanced)"
            ]
        },
        pt: {
            title: "Arquitetura & Adicional",
            items: [
                "SOLID / Clean Architecture",
                "Arquitetura em camadas",
                "Sistemas orientados a eventos",
                "PHP / Laravel",
                "WordPress / Craft CMS",
                "Português (nativo)",
                "Inglês (avançado)"
            ]
        }
    }
];
