import type { LanguageSkill, SkillGroup, SkillTrack } from "./types";

// -- FUNCTIONS
function createTrack(
    id: string,
    iconId: string,
    musicalVariationId: string,
    familiarity: SkillTrack["familiarity"],
    en: SkillTrack["en"],
    pt: SkillTrack["pt"]
): SkillTrack
{
    return {
        id,
        iconId,
        familiarity,
        musicalVariationId,
        en,
        pt
    };
}

// -- CONSTANTS
export const languageSkillArray: LanguageSkill[] = [
    {
        id: "portuguese",
        en: {
            title: "Portuguese",
            level: "Native"
        },
        pt: {
            title: "Português",
            level: "Nativo"
        }
    },
    {
        id: "english",
        en: {
            title: "English",
            level: "Advanced"
        },
        pt: {
            title: "Inglês",
            level: "Avançado"
        }
    }
];

export const skillGroupArray: SkillGroup[] = [
    {
        id: "frontend",
        iconId: "layout",
        audioPresetId: "frontend-keys",
        en: {
            title: "Frontend",
            description: "Vol. 01 - lo-fi by Purrple Cat, mapped to the modern web stack."
        },
        pt: {
            title: "Frontend",
            description: "Vol. 01 - lo-fi de Purrple Cat, mapeado para o stack web moderno."
        },
        trackArray: [
            createTrack(
                "typescript",
                "TypeScript",
                "frontend-typescript",
                "proficient",
                {
                    title: "TypeScript",
                    musicalSubtitle: "Flickering Light in the Dark",
                    description: "Typed application code across frontend and full-stack projects."
                },
                {
                    title: "TypeScript",
                    musicalSubtitle: "Flickering Light in the Dark",
                    description: "Código tipado em projetos frontend e full stack."
                }
            ),
            createTrack(
                "javascript",
                "JavaScript",
                "frontend-javascript",
                "proficient",
                {
                    title: "JavaScript",
                    musicalSubtitle: "Vibin'",
                    description: null
                },
                {
                    title: "JavaScript",
                    musicalSubtitle: "Vibin'",
                    description: null
                }
            ),
            createTrack(
                "react",
                "React",
                "frontend-react",
                "proficient",
                {
                    title: "React",
                    musicalSubtitle: "Coffee Jelly",
                    description: "Component-driven interfaces for scalable web applications."
                },
                {
                    title: "React",
                    musicalSubtitle: "Coffee Jelly",
                    description: "Interfaces baseadas em componentes para aplicações web escaláveis."
                }
            ),
            createTrack(
                "nextjs",
                "Next.js",
                "frontend-nextjs",
                "proficient",
                {
                    title: "Next.js",
                    musicalSubtitle: "3 A.M. Radio",
                    description: null
                },
                {
                    title: "Next.js",
                    musicalSubtitle: "3 A.M. Radio",
                    description: null
                }
            ),
            createTrack(
                "angular",
                "Angular",
                "frontend-angular",
                "proficient",
                {
                    title: "Angular",
                    musicalSubtitle: "Refractions",
                    description: null
                },
                {
                    title: "Angular",
                    musicalSubtitle: "Refractions",
                    description: null
                }
            ),
            createTrack(
                "svelte-5",
                "Svelte 5",
                "frontend-svelte",
                "proficient",
                {
                    title: "Svelte 5",
                    musicalSubtitle: "Aurora",
                    description: null
                },
                {
                    title: "Svelte 5",
                    musicalSubtitle: "Aurora",
                    description: null
                }
            ),
            createTrack(
                "preact",
                "Preact",
                "frontend-preact",
                "proficient",
                {
                    title: "Preact",
                    musicalSubtitle: "Cool Breeze",
                    description: null
                },
                {
                    title: "Preact",
                    musicalSubtitle: "Cool Breeze",
                    description: null
                }
            ),
            createTrack(
                "html-css-tailwind",
                "HTML5",
                "frontend-html-css-tailwind",
                "proficient",
                {
                    title: "HTML5 / CSS3 / Tailwind CSS",
                    musicalSubtitle: "Flourish",
                    description: null
                },
                {
                    title: "HTML5 / CSS3 / Tailwind CSS",
                    musicalSubtitle: "Flourish",
                    description: null
                }
            ),
            createTrack(
                "responsiveness",
                "CSS3",
                "frontend-responsiveness",
                "proficient",
                {
                    title: "Responsiveness",
                    musicalSubtitle: "Windy",
                    description: null
                },
                {
                    title: "Responsividade",
                    musicalSubtitle: "Windy",
                    description: null
                }
            ),
            createTrack(
                "accessibility",
                "HTML5",
                "frontend-accessibility",
                "proficient",
                {
                    title: "Accessibility",
                    musicalSubtitle: "Serendipity",
                    description: null
                },
                {
                    title: "Acessibilidade",
                    musicalSubtitle: "Serendipity",
                    description: null
                }
            ),
            createTrack(
                "seo",
                "HTML5",
                "frontend-seo",
                "proficient",
                {
                    title: "SEO",
                    musicalSubtitle: "Discovery",
                    description: null
                },
                {
                    title: "SEO",
                    musicalSubtitle: "Discovery",
                    description: null
                }
            )
        ]
    },
    {
        id: "backend",
        iconId: "server",
        audioPresetId: "backend-rhodes",
        en: {
            title: "Backend & APIs",
            description: "Vol. 01 - lo-fi by Purrple Cat, mapped to services and APIs."
        },
        pt: {
            title: "Backend & APIs",
            description: "Vol. 01 - lo-fi de Purrple Cat, mapeado para serviços e APIs."
        },
        trackArray: [
            createTrack(
                "csharp-dotnet",
                "C#",
                "backend-csharp-dotnet",
                "proficient",
                {
                    title: "C# / .NET",
                    musicalSubtitle: "After Hours",
                    description: "Backend systems and REST APIs with C#, .NET, and ASP.NET Core."
                },
                {
                    title: "C# / .NET",
                    musicalSubtitle: "After Hours",
                    description: "Sistemas de backend e APIs REST com C#, .NET e ASP.NET Core."
                }
            ),
            createTrack(
                "aspnet-core",
                "ASP.NET Core",
                "backend-aspnet-core",
                "proficient",
                {
                    title: "ASP.NET Core",
                    musicalSubtitle: "Squeaky Computer Chair",
                    description: null
                },
                {
                    title: "ASP.NET Core",
                    musicalSubtitle: "Squeaky Computer Chair",
                    description: null
                }
            ),
            createTrack(
                "entity-framework-core",
                "Entity Framework Core",
                "backend-ef-core",
                "proficient",
                {
                    title: "Entity Framework Core",
                    musicalSubtitle: "The Golden Ratio",
                    description: null
                },
                {
                    title: "Entity Framework Core",
                    musicalSubtitle: "The Golden Ratio",
                    description: null
                }
            ),
            createTrack(
                "nodejs",
                "Node.js",
                "backend-nodejs",
                "proficient",
                {
                    title: "Node.js",
                    musicalSubtitle: "Downtown",
                    description: "Node.js services for APIs and application backends."
                },
                {
                    title: "Node.js",
                    musicalSubtitle: "Downtown",
                    description: "Serviços Node.js para APIs e backends de aplicação."
                }
            ),
            createTrack(
                "fastify",
                "Fastify",
                "backend-fastify",
                "proficient",
                {
                    title: "Fastify",
                    musicalSubtitle: "Chugging Along",
                    description: null
                },
                {
                    title: "Fastify",
                    musicalSubtitle: "Chugging Along",
                    description: null
                }
            ),
            createTrack(
                "nestjs",
                "NestJS",
                "backend-nestjs",
                "proficient",
                {
                    title: "NestJS",
                    musicalSubtitle: "Labyrinth",
                    description: null
                },
                {
                    title: "NestJS",
                    musicalSubtitle: "Labyrinth",
                    description: null
                }
            ),
            createTrack(
                "deno",
                "Deno",
                "backend-deno",
                "proficient",
                {
                    title: "Deno",
                    musicalSubtitle: "Sunlit Shore",
                    description: null
                },
                {
                    title: "Deno",
                    musicalSubtitle: "Sunlit Shore",
                    description: null
                }
            ),
            createTrack(
                "php-laravel",
                "PHP",
                "backend-php-laravel",
                "proficient",
                {
                    title: "PHP / Laravel",
                    musicalSubtitle: "Golden Hour",
                    description: null
                },
                {
                    title: "PHP / Laravel",
                    musicalSubtitle: "Golden Hour",
                    description: null
                }
            ),
            createTrack(
                "rest-swagger-openapi",
                "Swagger",
                "backend-rest-openapi",
                "proficient",
                {
                    title: "REST / Swagger / OpenAPI",
                    musicalSubtitle: "Contact",
                    description: "REST APIs documented and shaped with OpenAPI tooling."
                },
                {
                    title: "REST / Swagger / OpenAPI",
                    musicalSubtitle: "Contact",
                    description: "APIs REST documentadas e estruturadas com OpenAPI."
                }
            )
        ]
    },
    {
        id: "ai",
        iconId: "spark",
        audioPresetId: "ai-pads",
        en: {
            title: "AI & LLMs",
            description: "Vol. 01 - lo-fi by Purrple Cat, mapped to models and agents."
        },
        pt: {
            title: "IA & LLMs",
            description: "Vol. 01 - lo-fi de Purrple Cat, mapeado para modelos e agentes."
        },
        trackArray: [
            createTrack(
                "llms",
                "OpenRouter",
                "ai-llms",
                "proficient",
                {
                    title: "LLMs",
                    musicalSubtitle: "Otherworldly",
                    description: "LLM-powered applications and AI-assisted workflows."
                },
                {
                    title: "LLMs",
                    musicalSubtitle: "Otherworldly",
                    description: "Aplicações com LLMs e fluxos assistidos por IA."
                }
            ),
            createTrack(
                "openai-openrouter",
                "OpenRouter",
                "ai-openai-openrouter",
                "proficient",
                {
                    title: "OpenAI / OpenRouter",
                    musicalSubtitle: "Nexus",
                    description: null
                },
                {
                    title: "OpenAI / OpenRouter",
                    musicalSubtitle: "Nexus",
                    description: null
                }
            ),
            createTrack(
                "model-routing",
                "OpenRouter",
                "ai-model-routing",
                "proficient",
                {
                    title: "Model routing",
                    musicalSubtitle: "Paradox",
                    description: null
                },
                {
                    title: "Roteamento de modelos",
                    musicalSubtitle: "Paradox",
                    description: null
                }
            ),
            createTrack(
                "contextual-memory",
                "Claude",
                "ai-contextual-memory",
                "proficient",
                {
                    title: "Contextual memory",
                    musicalSubtitle: "Remember",
                    description: null
                },
                {
                    title: "Memória contextual",
                    musicalSubtitle: "Remember",
                    description: null
                }
            ),
            createTrack(
                "web-search",
                "OpenRouter",
                "ai-web-search",
                "proficient",
                {
                    title: "Web search",
                    musicalSubtitle: "Exploration",
                    description: null
                },
                {
                    title: "Busca web",
                    musicalSubtitle: "Exploration",
                    description: null
                }
            ),
            createTrack(
                "sse-streaming",
                "OpenRouter",
                "ai-sse-streaming",
                "proficient",
                {
                    title: "SSE streaming",
                    musicalSubtitle: "Time Loop",
                    description: null
                },
                {
                    title: "Streaming SSE",
                    musicalSubtitle: "Time Loop",
                    description: null
                }
            ),
            createTrack(
                "ai-image",
                "Claude",
                "ai-image-generation",
                "proficient",
                {
                    title: "AI image generation / editing",
                    musicalSubtitle: "Transformation",
                    description: null
                },
                {
                    title: "Geração / edição de imagens por IA",
                    musicalSubtitle: "Transformation",
                    description: null
                }
            )
        ]
    },
    {
        id: "databases",
        iconId: "database",
        audioPresetId: "databases-piano",
        en: {
            title: "Databases",
            description: "Vol. 01 - lo-fi by Purrple Cat, mapped to data stores and modeling."
        },
        pt: {
            title: "Bancos de Dados",
            description: "Vol. 01 - lo-fi de Purrple Cat, mapeado para dados e modelagem."
        },
        trackArray: [
            createTrack(
                "postgresql",
                "PostgreSQL",
                "databases-postgresql",
                "proficient",
                {
                    title: "PostgreSQL",
                    musicalSubtitle: "Ancient Trees",
                    description: null
                },
                {
                    title: "PostgreSQL",
                    musicalSubtitle: "Ancient Trees",
                    description: null
                }
            ),
            createTrack(
                "sql-server",
                "MySQL",
                "databases-sql-server",
                "proficient",
                {
                    title: "SQL Server",
                    musicalSubtitle: "Skyscrapers",
                    description: null
                },
                {
                    title: "SQL Server",
                    musicalSubtitle: "Skyscrapers",
                    description: null
                }
            ),
            createTrack(
                "mysql",
                "MySQL",
                "databases-mysql",
                "proficient",
                {
                    title: "MySQL",
                    musicalSubtitle: "Calm Waters",
                    description: null
                },
                {
                    title: "MySQL",
                    musicalSubtitle: "Calm Waters",
                    description: null
                }
            ),
            createTrack(
                "mongodb",
                "MongoDB",
                "databases-mongodb",
                "proficient",
                {
                    title: "MongoDB",
                    musicalSubtitle: "Turbulence",
                    description: null
                },
                {
                    title: "MongoDB",
                    musicalSubtitle: "Turbulence",
                    description: null
                }
            ),
            createTrack(
                "supabase-rls",
                "Supabase",
                "databases-supabase-rls",
                "proficient",
                {
                    title: "Supabase / RLS",
                    musicalSubtitle: "Under the Canopy",
                    description: null
                },
                {
                    title: "Supabase / RLS",
                    musicalSubtitle: "Under the Canopy",
                    description: null
                }
            ),
            createTrack(
                "sql-modeling-optimization",
                "PostgreSQL",
                "databases-sql-modeling",
                "proficient",
                {
                    title: "SQL modeling & query optimization",
                    musicalSubtitle: "Fragments",
                    description: null
                },
                {
                    title: "Modelagem e otimização de consultas SQL",
                    musicalSubtitle: "Fragments",
                    description: null
                }
            )
        ]
    },
    {
        id: "payments",
        iconId: "payment",
        audioPresetId: "payments-jazz",
        en: {
            title: "Payments & Integrations",
            description: "Vol. 01 - lo-fi by Purrple Cat, mapped to checkout and integrations."
        },
        pt: {
            title: "Pagamentos & Integrações",
            description: "Vol. 01 - lo-fi de Purrple Cat, mapeado para checkout e integrações."
        },
        trackArray: [
            createTrack(
                "stripe-checkout",
                "Stripe Checkout",
                "payments-stripe-checkout",
                "proficient",
                {
                    title: "Stripe Checkout",
                    musicalSubtitle: "Corner Store",
                    description: null
                },
                {
                    title: "Stripe Checkout",
                    musicalSubtitle: "Corner Store",
                    description: null
                }
            ),
            createTrack(
                "stripe-connect",
                "Stripe Checkout",
                "payments-stripe-connect",
                "proficient",
                {
                    title: "Stripe Connect",
                    musicalSubtitle: "Crossroads",
                    description: null
                },
                {
                    title: "Stripe Connect",
                    musicalSubtitle: "Crossroads",
                    description: null
                }
            ),
            createTrack(
                "commissions-payouts",
                "Stripe Checkout",
                "payments-commissions",
                "proficient",
                {
                    title: "Commissions & payouts",
                    musicalSubtitle: "Message in a Bottle",
                    description: null
                },
                {
                    title: "Comissões e repasses",
                    musicalSubtitle: "Message in a Bottle",
                    description: null
                }
            ),
            createTrack(
                "webhooks",
                "Stripe Checkout",
                "payments-webhooks",
                "proficient",
                {
                    title: "Webhooks",
                    musicalSubtitle: "Pitter Patter",
                    description: null
                },
                {
                    title: "Webhooks",
                    musicalSubtitle: "Pitter Patter",
                    description: null
                }
            ),
            createTrack(
                "erpnext",
                "ERPNext",
                "payments-erpnext",
                "proficient",
                {
                    title: "ERPNext",
                    musicalSubtitle: "Artifact",
                    description: null
                },
                {
                    title: "ERPNext",
                    musicalSubtitle: "Artifact",
                    description: null
                }
            ),
            createTrack(
                "external-apis",
                "OpenAPI",
                "payments-external-apis",
                "proficient",
                {
                    title: "External APIs",
                    musicalSubtitle: "Distant Ships",
                    description: null
                },
                {
                    title: "APIs externas",
                    musicalSubtitle: "Distant Ships",
                    description: null
                }
            ),
            createTrack(
                "inventory",
                "ERPNext",
                "payments-inventory",
                "proficient",
                {
                    title: "Inventory",
                    musicalSubtitle: "Shopping Spree",
                    description: null
                },
                {
                    title: "Estoque",
                    musicalSubtitle: "Shopping Spree",
                    description: null
                }
            ),
            createTrack(
                "idempotency-concurrency",
                "Stripe Checkout",
                "payments-idempotency",
                "proficient",
                {
                    title: "Idempotency & concurrency",
                    musicalSubtitle: "Going in Circles",
                    description: null
                },
                {
                    title: "Idempotência e concorrência",
                    musicalSubtitle: "Going in Circles",
                    description: null
                }
            )
        ]
    },
    {
        id: "architecture",
        iconId: "layers",
        audioPresetId: "architecture-minimal",
        en: {
            title: "Architecture",
            description: "Vol. 01 - lo-fi by Purrple Cat, mapped to structure and boundaries."
        },
        pt: {
            title: "Arquitetura",
            description: "Vol. 01 - lo-fi de Purrple Cat, mapeado para estrutura e limites."
        },
        trackArray: [
            createTrack(
                "microservices",
                "Docker",
                "architecture-microservices",
                "proficient",
                {
                    title: "Microservices",
                    musicalSubtitle: "Intertwined",
                    description: "Microservice-oriented and distributed system design."
                },
                {
                    title: "Microsserviços",
                    musicalSubtitle: "Intertwined",
                    description: "Design orientado a microsserviços e sistemas distribuídos."
                }
            ),
            createTrack(
                "solid-clean-architecture",
                "NestJS",
                "architecture-solid-clean",
                "proficient",
                {
                    title: "SOLID / Clean Architecture",
                    musicalSubtitle: "Creation",
                    description: "Applied SOLID, Clean Architecture, and related design patterns."
                },
                {
                    title: "SOLID / Clean Architecture",
                    musicalSubtitle: "Creation",
                    description: "Aplicação de SOLID, Clean Architecture e design patterns relacionados."
                }
            ),
            createTrack(
                "layered-architecture",
                "NestJS",
                "architecture-layered",
                "proficient",
                {
                    title: "Layered architecture",
                    musicalSubtitle: "Elevated",
                    description: null
                },
                {
                    title: "Arquitetura em camadas",
                    musicalSubtitle: "Elevated",
                    description: null
                }
            ),
            createTrack(
                "bff",
                "Node.js",
                "architecture-bff",
                "proficient",
                {
                    title: "BFF",
                    musicalSubtitle: "Window Seat",
                    description: null
                },
                {
                    title: "BFF",
                    musicalSubtitle: "Window Seat",
                    description: null
                }
            ),
            createTrack(
                "micro-frontends",
                "React",
                "architecture-micro-frontends",
                "proficient",
                {
                    title: "Micro Frontends",
                    musicalSubtitle: "Convergence",
                    description: null
                },
                {
                    title: "Micro Frontends",
                    musicalSubtitle: "Convergence",
                    description: null
                }
            ),
            createTrack(
                "event-driven",
                "RabbitMQ",
                "architecture-event-driven",
                "proficient",
                {
                    title: "Event-driven systems",
                    musicalSubtitle: "Meteorites",
                    description: "Event-driven architectures and asynchronous processing."
                },
                {
                    title: "Sistemas orientados a eventos",
                    musicalSubtitle: "Meteorites",
                    description: "Arquiteturas orientadas a eventos e processamento assíncrono."
                }
            ),
            createTrack(
                "messaging-async",
                "RabbitMQ",
                "architecture-messaging",
                "proficient",
                {
                    title: "Messaging & async processing",
                    musicalSubtitle: "Satellite",
                    description: "Messaging with RabbitMQ, SNS/SQS, and async workflows."
                },
                {
                    title: "Mensageria e processamento assíncrono",
                    musicalSubtitle: "Satellite",
                    description: "Mensageria com RabbitMQ, SNS/SQS e fluxos assíncronos."
                }
            ),
            createTrack(
                "dependency-injection",
                "NestJS",
                "architecture-di",
                "proficient",
                {
                    title: "Dependency injection",
                    musicalSubtitle: "Fading",
                    description: null
                },
                {
                    title: "Injeção de dependência",
                    musicalSubtitle: "Fading",
                    description: null
                }
            )
        ]
    },
    {
        id: "cloud",
        iconId: "cloud",
        audioPresetId: "cloud-ambient",
        en: {
            title: "Cloud & DevOps",
            description: "Vol. 01 - lo-fi by Purrple Cat, mapped to cloud and delivery."
        },
        pt: {
            title: "Cloud & DevOps",
            description: "Vol. 01 - lo-fi de Purrple Cat, mapeado para nuvem e entrega."
        },
        trackArray: [
            createTrack(
                "aws",
                "Docker",
                "cloud-aws",
                "proficient",
                {
                    title: "AWS EC2 / ECS / S3 / RDS / Lambda",
                    musicalSubtitle: "Flying",
                    description: "Hands-on AWS work across compute, storage, data, and serverless."
                },
                {
                    title: "AWS EC2 / ECS / S3 / RDS / Lambda",
                    musicalSubtitle: "Flying",
                    description: "Experiência prática com AWS em compute, storage, dados e serverless."
                }
            ),
            createTrack(
                "azure",
                "Docker",
                "cloud-azure",
                "proficient",
                {
                    title: "Azure",
                    musicalSubtitle: "Luminous",
                    description: null
                },
                {
                    title: "Azure",
                    musicalSubtitle: "Luminous",
                    description: null
                }
            ),
            createTrack(
                "docker",
                "Docker",
                "cloud-docker",
                "proficient",
                {
                    title: "Docker",
                    musicalSubtitle: "Cardboard Box Adventure",
                    description: null
                },
                {
                    title: "Docker",
                    musicalSubtitle: "Cardboard Box Adventure",
                    description: null
                }
            ),
            createTrack(
                "kubernetes",
                "Kubernetes",
                "cloud-kubernetes",
                "proficient",
                {
                    title: "Kubernetes",
                    musicalSubtitle: "Constellations",
                    description: null
                },
                {
                    title: "Kubernetes",
                    musicalSubtitle: "Constellations",
                    description: null
                }
            ),
            createTrack(
                "github-actions-cicd",
                "GitHub Actions",
                "cloud-github-actions",
                "proficient",
                {
                    title: "GitHub Actions / CI/CD",
                    musicalSubtitle: "Trying Something New",
                    description: null
                },
                {
                    title: "GitHub Actions / CI/CD",
                    musicalSubtitle: "Trying Something New",
                    description: null
                }
            ),
            createTrack(
                "rabbitmq",
                "RabbitMQ",
                "cloud-rabbitmq",
                "familiar",
                {
                    title: "RabbitMQ",
                    musicalSubtitle: "Changes",
                    description: null
                },
                {
                    title: "RabbitMQ",
                    musicalSubtitle: "Changes",
                    description: null
                }
            ),
            createTrack(
                "sns-sqs",
                "RabbitMQ",
                "cloud-sns-sqs",
                "familiar",
                {
                    title: "SNS / SQS",
                    musicalSubtitle: "Cosmic Echoes",
                    description: null
                },
                {
                    title: "SNS / SQS",
                    musicalSubtitle: "Cosmic Echoes",
                    description: null
                }
            )
        ]
    },
    {
        id: "quality",
        iconId: "quality",
        audioPresetId: "quality-vinyl",
        en: {
            title: "Quality & Tools",
            description: "Vol. 01 - lo-fi by Purrple Cat, mapped to testing and craft tools."
        },
        pt: {
            title: "Qualidade & Ferramentas",
            description: "Vol. 01 - lo-fi de Purrple Cat, mapeado para testes e ferramentas."
        },
        trackArray: [
            createTrack(
                "jest",
                "Jest",
                "quality-jest",
                "proficient",
                {
                    title: "Jest",
                    musicalSubtitle: "Treat Time",
                    description: null
                },
                {
                    title: "Jest",
                    musicalSubtitle: "Treat Time",
                    description: null
                }
            ),
            createTrack(
                "vitest",
                "Vitest",
                "quality-vitest",
                "proficient",
                {
                    title: "Vitest",
                    musicalSubtitle: "Saturday Morning",
                    description: null
                },
                {
                    title: "Vitest",
                    musicalSubtitle: "Saturday Morning",
                    description: null
                }
            ),
            createTrack(
                "cypress",
                "Cypress",
                "quality-cypress",
                "proficient",
                {
                    title: "Cypress",
                    musicalSubtitle: "Downpour",
                    description: null
                },
                {
                    title: "Cypress",
                    musicalSubtitle: "Downpour",
                    description: null
                }
            ),
            createTrack(
                "automated-testing",
                "Jest",
                "quality-automated-testing",
                "proficient",
                {
                    title: "Unit / integration / E2E testing",
                    musicalSubtitle: "Frosted Evergreen",
                    description: "Automated testing across unit, integration, and end-to-end layers."
                },
                {
                    title: "Testes unitários / integração / E2E",
                    musicalSubtitle: "Frosted Evergreen",
                    description: "Testes automatizados em camadas unitária, integração e ponta a ponta."
                }
            ),
            createTrack(
                "structured-logging",
                "Datadog",
                "quality-structured-logging",
                "proficient",
                {
                    title: "Structured logging",
                    musicalSubtitle: "Foggy Window",
                    description: null
                },
                {
                    title: "Logs estruturados",
                    musicalSubtitle: "Foggy Window",
                    description: null
                }
            ),
            createTrack(
                "cloudwatch-datadog",
                "Datadog",
                "quality-observability",
                "familiar",
                {
                    title: "CloudWatch / Datadog",
                    musicalSubtitle: "Night Owls",
                    description: null
                },
                {
                    title: "CloudWatch / Datadog",
                    musicalSubtitle: "Night Owls",
                    description: null
                }
            ),
            createTrack(
                "git",
                "GitHub Actions",
                "quality-git",
                "proficient",
                {
                    title: "Git",
                    musicalSubtitle: "A Short Walk With You",
                    description: null
                },
                {
                    title: "Git",
                    musicalSubtitle: "A Short Walk With You",
                    description: null
                }
            ),
            createTrack(
                "ai-dev-tools",
                "Cursor",
                "quality-ai-tools",
                "proficient",
                {
                    title: "Cursor / Claude / Copilot / Codex",
                    musicalSubtitle: "Loading Screen",
                    description: "AI-assisted development with modern coding agents and copilots."
                },
                {
                    title: "Cursor / Claude / Copilot / Codex",
                    musicalSubtitle: "Loading Screen",
                    description: "Desenvolvimento assistido por IA com agentes e copilots modernos."
                }
            ),
            createTrack(
                "wordpress-craft",
                "WordPress",
                "quality-cms",
                "proficient",
                {
                    title: "WordPress / Craft CMS",
                    musicalSubtitle: "Spring Showers",
                    description: null
                },
                {
                    title: "WordPress / Craft CMS",
                    musicalSubtitle: "Spring Showers",
                    description: null
                }
            )
        ]
    }
];
