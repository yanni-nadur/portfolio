import type { ExperienceEntry } from "./types";

// -- CONSTANTS
export const experienceArray: ExperienceEntry[] = [
    {
        id: "synorios-role",
        concurrentGroup: "sister",
        track: "career",
        startDate: "2026-02-01",
        endDate: null,
        logo: "images/companies/synorios.webp",
        en: {
            company: "Synorios",
            role: "Software & AI Engineer",
            period: "February 2026 - Present",
            location: "Miami, FL, United States (Remote)",
            bullets: [
                "Developing a generative AI chat platform with Svelte 5, TypeScript, Node.js/Fastify, and Supabase, integrated with OpenAI and OpenRouter.",
                "Implemented model routing, multilingual intent detection, contextual memory, and SSE streaming.",
                "Optimized web search with prefetching, caching, metrics, and failure handling; built AI image generation/editing with quotas, idempotency, and concurrency controls."
            ]
        },
        pt: {
            company: "Synorios",
            role: "Engenheiro de Software e IA",
            period: "Fevereiro 2026 - Atual",
            location: "Miami, FL, Estados Unidos (Remoto)",
            bullets: [
                "Desenvolvendo uma plataforma de chat com IA generativa usando Svelte 5, TypeScript, Node.js/Fastify e Supabase, integrada a OpenAI e OpenRouter.",
                "Implementei roteamento de modelos, identificação multilíngue de intenções, memória contextual e streaming SSE.",
                "Otimizei a busca web com prefetch, cache, métricas e tratamento de falhas; desenvolvi geração/edição de imagens por IA com cotas, idempotência e controle de concorrência."
            ]
        }
    },
    {
        id: "bamhub-role",
        concurrentGroup: "sister",
        track: "career",
        startDate: "2025-04-01",
        endDate: null,
        logo: "images/companies/bamhub.webp",
        en: {
            company: "BAMHUB | Business Lab",
            role: "Senior Full Stack Software Engineer",
            period: "April 2025 - Present",
            location: "Luxembourg (Remote)",
            bullets: [
                "Developing end-to-end features with React, TypeScript, C#/.NET 8, ASP.NET Core Web API, Entity Framework Core, and PostgreSQL.",
                "Implemented inventory/order management, ERPNext integration, and backend layering (controllers, services, repositories).",
                "Built New Art Fiction marketplace flows with Stripe Checkout/Connect, idempotent webhooks, and Supabase RLS; optimized BAMHUB Business Home booking/availability."
            ]
        },
        pt: {
            company: "BAMHUB | Business Lab",
            role: "Engenheiro de Software Full Stack Sênior",
            period: "Abril 2025 - Atual",
            location: "Luxemburgo (Remoto)",
            bullets: [
                "Desenvolvendo funcionalidades de ponta a ponta com React, TypeScript, C#/.NET 8, ASP.NET Core Web API, Entity Framework Core e PostgreSQL.",
                "Implementei estoque/gestão de pedidos, integração ERPNext e backend em camadas (controllers, serviços, repositórios).",
                "Construí fluxos do marketplace New Art Fiction com Stripe Checkout/Connect, webhooks idempotentes e Supabase RLS; otimizei reservas/disponibilidade do BAMHUB Business Home."
            ]
        }
    },
    {
        id: "daytwo",
        concurrentGroup: null,
        track: "career",
        startDate: "2022-06-01",
        endDate: "2025-03-31",
        logo: "images/companies/daytwo.webp",
        en: {
            company: "DAYTWO",
            role: "Full Stack Software Engineer",
            period: "June 2022 - March 2025",
            location: "Oslo, Norway (Remote)",
            bullets: [
                "Developed apps for international clients with React, Next.js, TypeScript, PHP/Laravel, Craft CMS, and C#/.NET integrations.",
                "Implemented interactive event schedules and real-time updates for Kongsberg Agenda; listings and geolocation for Soloneiendom.",
                "Optimized rendering, caching, and SQL queries - critical pages under one second."
            ]
        },
        pt: {
            company: "DAYTWO",
            role: "Engenheiro de Software Full Stack",
            period: "Junho 2022 - Março 2025",
            location: "Oslo, Noruega (Remoto)",
            bullets: [
                "Desenvolvi aplicações para clientes internacionais com React, Next.js, TypeScript, PHP/Laravel, Craft CMS e integrações C#/.NET.",
                "Implementei agendas interativas e atualizações em tempo real na Kongsberg Agenda; listagens e geolocalização na Soloneiendom.",
                "Otimizei renderização, cache e consultas SQL - páginas críticas em menos de um segundo."
            ]
        }
    },
    {
        id: "futurebrand",
        concurrentGroup: null,
        track: "career",
        startDate: "2021-10-01",
        endDate: "2022-06-30",
        logo: "images/companies/futurebrand.webp",
        en: {
            company: "FutureBrand São Paulo",
            role: "Full Stack Web Developer",
            period: "October 2021 - June 2022",
            location: "São Paulo, SP, Brazil",
            bullets: [
                "Developed React and Next.js interfaces integrated with REST APIs and C#/.NET services, focused on responsive design, accessibility, SEO, and performance.",
                "Led the technical delivery of the Milênio Capital website, including interfaces, integrations, and deployment."
            ]
        },
        pt: {
            company: "FutureBrand São Paulo",
            role: "Desenvolvedor Web Full Stack",
            period: "Outubro 2021 - Junho 2022",
            location: "São Paulo, SP, Brasil",
            bullets: [
                "Desenvolvi interfaces React e Next.js integradas a APIs REST e serviços C#/.NET, com foco em responsividade, acessibilidade, SEO e performance.",
                "Liderei a entrega técnica do site Milênio Capital, incluindo interfaces, integrações e publicação."
            ]
        }
    },
    {
        id: "tinpix",
        concurrentGroup: null,
        track: "career",
        startDate: "2021-06-01",
        endDate: "2021-10-31",
        logo: "images/companies/tinpix.webp",
        en: {
            company: "Tinpix",
            role: "Web Development Intern",
            period: "June 2021 - October 2021",
            location: "São Paulo, SP, Brazil",
            bullets: [
                "Created reusable components using WordPress, React, and JavaScript."
            ]
        },
        pt: {
            company: "Tinpix",
            role: "Estagiário de Desenvolvimento Web",
            period: "Junho 2021 - Outubro 2021",
            location: "São Paulo, SP, Brasil",
            bullets: [
                "Criei componentes reutilizáveis com WordPress, React e JavaScript."
            ]
        }
    },
    {
        id: "aurora",
        concurrentGroup: null,
        track: "career",
        startDate: "2020-05-01",
        endDate: null,
        logo: "images/companies/aurora.webp",
        en: {
            company: "Aurora Dev",
            role: "Freelance Full Stack Developer (Concurrent)",
            period: "May 2020 - Present",
            location: "São Paulo, SP, Brazil (Remote)",
            bullets: [
                "Developing websites and web systems for small and medium-sized businesses - requirements through hosting and maintenance.",
                "Delivered projects with WordPress, HTML, CSS, JavaScript, C#/.NET, PHP, and MySQL, including Nutri Karen Oliveira and Espaço Yoga Somos Um."
            ]
        },
        pt: {
            company: "Aurora Dev",
            role: "Desenvolvedor Full Stack Freelancer (Atuação Paralela)",
            period: "Maio 2020 - Atual",
            location: "São Paulo, SP, Brasil (Remoto)",
            bullets: [
                "Desenvolvendo sites e sistemas web para pequenos e médios negócios - do levantamento de requisitos à hospedagem e manutenção.",
                "Entreguei projetos com WordPress, HTML, CSS, JavaScript, C#/.NET, PHP e MySQL, incluindo Nutri Karen Oliveira e Espaço Yoga Somos Um."
            ]
        }
    },
    {
        id: "intermeio",
        concurrentGroup: null,
        track: "career",
        startDate: "2019-09-01",
        endDate: "2020-01-31",
        logo: null,
        en: {
            company: "Intermeio Soluções de Pagamento",
            role: ".NET Development Intern",
            period: "September 2019 - January 2020",
            location: "São Paulo, SP, Brazil",
            bullets: [
                "Maintained internal C#/.NET payment and finance applications used by more than 100 people.",
                "Integrated REST APIs across approximately six services, optimized SQL queries, and supported testing and issue investigation."
            ]
        },
        pt: {
            company: "Intermeio Soluções de Pagamento",
            role: "Estagiário .NET",
            period: "Setembro 2019 - Janeiro 2020",
            location: "São Paulo, SP, Brasil",
            bullets: [
                "Realizei a manutenção de aplicações internas de pagamentos e finanças em C#/.NET, utilizadas por mais de 100 pessoas.",
                "Integrei APIs REST entre aproximadamente seis serviços, otimizei consultas SQL e apoiei testes e investigação de falhas."
            ]
        }
    },
    {
        id: "unip",
        concurrentGroup: null,
        track: "education",
        startDate: "2019-01-01",
        endDate: "2023-12-31",
        logo: "images/companies/unip.jpg",
        en: {
            company: "Universidade Paulista (UNIP)",
            role: "Bachelor of Science in Computer Science",
            period: "2019 - 2023",
            location: "São Paulo, Brazil",
            bullets: [
                "Equivalent GPA: 3.56/4.0.",
                "Full merit-based scholarship."
            ]
        },
        pt: {
            company: "Universidade Paulista (UNIP)",
            role: "Bacharelado em Ciência da Computação",
            period: "2019 - 2023",
            location: "São Paulo, Brasil",
            bullets: [
                "GPA equivalente: 3,56/4,0.",
                "Bolsa integral por mérito acadêmico."
            ]
        }
    }
];
