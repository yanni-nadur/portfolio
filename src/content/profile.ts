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
            "I'm a Full Stack & AI Software Engineer with over six years of experience building web applications, backend systems, and scalable digital products. Throughout my career, I've worked with technologies such as React, Next.js, Angular, TypeScript, Node.js, and C#/.NET, contributing to every stage of development, from architecture and implementation to deployment and continuous improvement.",
            "I've worked on projects across different industries, including marketplaces, payment platforms, inventory management systems, and applications with complex business requirements. I enjoy understanding how different parts of a system fit together, designing APIs, integrating services, and building reliable, efficient, and maintainable solutions. I have experience with microservices, distributed architectures, cloud infrastructure, and performance optimization. I've also been developing AI-powered applications using LLMs, working with AI agents, model routing, contextual memory, web search, and real-time streaming, while using AI tools to improve my development workflow.",
            "What I enjoy most about software engineering is the combination of technical challenges, creativity, and problem-solving. I value understanding the bigger picture, collaborating with others, and contributing to decisions that make a product better. I believe great software goes beyond writing code. It requires thoughtful architecture, clear communication, continuous learning, and decisions that balance technical quality with business needs. My goal is to keep growing as an engineer and contribute to building products that make a meaningful difference for the people who use them."
        ],
        initials: "YN"
    },
    pt: {
        name: "Yanni Nadur",
        role: "Engenheiro de Software Full Stack & IA",
        status: "Disponível",
        statusMessage: "Aberto a novas oportunidades",
        aboutParagraphArray: [
            "Sou Engenheiro de Software Full Stack e IA, com mais de seis anos de experiência no desenvolvimento de aplicações web, sistemas backend e produtos digitais escaláveis. Ao longo da minha carreira, trabalhei com tecnologias como React, Next.js, Angular, TypeScript, Node.js e C#/.NET, participando de todas as etapas do desenvolvimento, desde a definição da arquitetura e implementação até a implantação e evolução contínua das aplicações.",
            "Já atuei em projetos de diferentes áreas, incluindo marketplaces, plataformas de pagamento, sistemas de gestão de estoque e aplicações com regras de negócio complexas. Gosto de entender como as diferentes partes de um sistema se conectam, desenvolver APIs, integrar serviços e construir soluções confiáveis, eficientes e fáceis de manter. Tenho experiência com microsserviços, arquiteturas distribuídas, infraestrutura em nuvem e otimização de desempenho. Também venho desenvolvendo soluções com inteligência artificial e LLMs, trabalhando com agentes de IA, roteamento de modelos, memória contextual, busca na web e streaming em tempo real, além de utilizar ferramentas de IA para otimizar meu processo de desenvolvimento.",
            "O que mais gosto na engenharia de software é a combinação de desafios técnicos, criatividade e resolução de problemas. Valorizo entender o contexto de cada projeto, colaborar com outras pessoas e participar das decisões que tornam um produto melhor. Acredito que desenvolver um bom software vai além de escrever código: envolve arquitetura bem planejada, comunicação clara, aprendizado contínuo e escolhas que equilibrem qualidade técnica com as necessidades do negócio. Meu objetivo é continuar evoluindo como profissional e contribuir para a criação de produtos que realmente façam a diferença para quem os utiliza."
        ],
        initials: "YN"
    }
};
