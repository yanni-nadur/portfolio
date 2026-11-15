import type { LocalizedPair, ProfileCopy, ProfileLinks } from "./types";

// -- CONSTANTS
export const profileLinks: ProfileLinks = {
    email: "yanninadur@gmail.com",
    github: "https://github.com/yanni-nadur",
    linkedin: "https://linkedin.com/in/yanninaxim",
    whatsapp: "https://wa.me/5511949272576",
    resumeEn: "files/resume-en.pdf",
    resumePt: "files/resume-pt.pdf",
    logo: "images/origami.svg",
    avatar: "images/avatar.webp"
};

export const profileCopy: LocalizedPair<ProfileCopy> = {
    en: {
        name: "Yanni Nadur",
        role: "Senior AI & Full Stack Software Engineer",
        status: "Available",
        statusMessage: "Open to senior full-stack and AI-focused engineering opportunities.",
        aboutParagraphArray: [
            "Senior AI & Full Stack Software Engineer with 6+ years of experience building scalable web applications, backend systems, and REST APIs using React, Next.js, TypeScript, Node.js, C#, .NET, and ASP.NET Core.",
            "Experienced in software architecture, databases, integrations, payment platforms, marketplaces, AI/LLM applications, OpenAI, AI agents, and AI-assisted development. Strong knowledge of microservices, distributed systems, event-driven architectures, messaging (RabbitMQ, SQS/SNS), and asynchronous processing.",
            "Hands-on experience with AWS, Docker, Kubernetes, CI/CD, GitHub Actions, PostgreSQL, MySQL, MongoDB, automated testing, and observability. Apply SOLID, Clean Architecture, DDD, CQRS, and design patterns to build secure, maintainable, and scalable solutions."
        ],
        initials: "YN"
    },
    pt: {
        name: "Yanni Nadur",
        role: "Engenheiro de Software Sênior em IA e Full Stack",
        status: "Disponível",
        statusMessage: "Aberto a oportunidades sênior de full stack e engenharia com foco em IA.",
        aboutParagraphArray: [
            "Engenheiro de Software Sênior em IA e Full Stack, com mais de 6 anos de experiência construindo aplicações web escaláveis, sistemas de backend e APIs REST com React, Next.js, TypeScript, Node.js, C#, .NET e ASP.NET Core.",
            "Experiência em arquitetura de software, bancos de dados, integrações, plataformas de pagamento, marketplaces, aplicações de IA/LLM, OpenAI, agentes de IA e desenvolvimento assistido por IA. Bom domínio de microsserviços, sistemas distribuídos, arquiteturas orientadas a eventos, mensageria (RabbitMQ, SQS/SNS) e processamento assíncrono.",
            "Experiência prática com AWS, Docker, Kubernetes, CI/CD, GitHub Actions, PostgreSQL, MySQL, MongoDB, testes automatizados e observabilidade. Aplico SOLID, Clean Architecture, DDD, CQRS e design patterns para construir soluções seguras, fáceis de manter e escaláveis."
        ],
        initials: "YN"
    }
};
