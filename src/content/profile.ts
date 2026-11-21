import type { LocalizedPair, ProfileCopy, ProfileLinks } from "./types";

// -- CONSTANTS
export const profileLinks: ProfileLinks = {
    email: "yanninadur@gmail.com",
    github: "https://github.com/yanni-nadur",
    linkedin: "https://linkedin.com/in/yanninaxim",
    whatsapp: "https://wa.me/5511949272576",
    resumeEn: "files/resume-en.pdf",
    resumePt: "files/resume-pt.pdf",
    avatar: "images/avatar.webp"
};

export const profileCopy: LocalizedPair<ProfileCopy> = {
    en: {
        name: "Yanni Nadur",
        role: "Full Stack & AI Software Engineer",
        status: "Available",
        statusMessage: "Open to new opportunities",
        aboutParagraphArray: [
            "I'm a Full Stack & AI Software Engineer with over six years building web apps, backend systems, and scalable digital products. I work with React, Next.js, Angular, TypeScript, Node.js, and C#/.NET across the full lifecycle, from architecture and implementation to deployment.",
            "I've shipped marketplaces, payment platforms, and inventory systems, with focus on APIs, microservices, distributed architecture, cloud infrastructure, and performance. Lately I've been building with LLMs, AI agents, model routing, contextual memory, and real-time streaming.",
            "I care about technical challenges, clear collaboration, and decisions that balance architecture quality with business needs. My goal is to keep growing as an engineer and help build products that matter to the people who use them."
        ],
        initials: "YN"
    },
    pt: {
        name: "Yanni Nadur",
        role: "Engenheiro de Software Full Stack & IA",
        status: "Disponível",
        statusMessage: "Aberto a novas oportunidades",
        aboutParagraphArray: [
            "Sou Engenheiro de Software Full Stack e IA, com mais de seis anos desenvolvendo aplicações web, sistemas backend e produtos digitais escaláveis. Trabalho com React, Next.js, Angular, TypeScript, Node.js e C#/.NET em todo o ciclo, da arquitetura e implementação à implantação.",
            "Já atuei em marketplaces, plataformas de pagamento e gestão de estoque, com foco em APIs, microsserviços, arquiteturas distribuídas, cloud e performance. Também venho construindo soluções com LLMs, agentes de IA, roteamento de modelos, memória contextual e streaming em tempo real.",
            "Gosto de desafios técnicos, colaboração clara e decisões que equilibrem qualidade de arquitetura com as necessidades do negócio. Meu objetivo é continuar evoluindo e ajudar a criar produtos que façam diferença para quem os utiliza."
        ],
        initials: "YN"
    }
};
