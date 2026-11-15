import type { AdditionalProject, FeaturedProject } from "./types";

// -- CONSTANTS
export const featuredProjectArray: FeaturedProject[] = [
    {
        id: "kongsberg",
        featured: true,
        hasPublicUrl: true,
        url: "https://kongsbergagenda.no/",
        image: "images/kongsbergimage.webp",
        accent: "#1F3A5F",
        media: {
            sources: [],
            poster: "images/kongsbergimage.webp",
            illustrative: false
        },
        en: {
            title: "Kongsberg Agenda - Event Platform",
            category: "Full Stack / High-Traffic Web / Real-Time Data",
            summary: "An event platform developed during my time at DAYTWO, focused on schedules, data integration, and user-facing experiences.",
            overview: "Kongsberg Agenda is an event platform that surfaces schedules, program information, and related experiences for a high-visibility Norwegian technology and society agenda.",
            role: "At DAYTWO, I contributed as a full-stack software engineer on data integration, event schedules, frontend and backend features, performance optimization, and user-facing experiences. This was collaborative product work - not a solo build of the entire platform.",
            challenge: "Event platforms need timely schedule data, clear presentation, and enough performance headroom to stay responsive when traffic and content updates intensify around program moments.",
            approach: "I worked on integrating and presenting event data, implementing frontend/backend features that supported the agenda experience, and improving performance characteristics of key user-facing flows.",
            architecture: "The platform combines content and schedule data with web experiences tailored for event discovery and program browsing. My contributions sat at the intersection of data integration, feature delivery, and performance-minded frontend/backend work within the DAYTWO team.",
            results: "Delivered and improved event-facing features used in a real public agenda experience, with attention to schedules, integrations, and responsive presentation.",
            technologies: ["JavaScript", "TypeScript", "Craft CMS", "HTML/CSS", "Performance optimization"]
        },
        pt: {
            title: "Kongsberg Agenda - Plataforma de Eventos",
            category: "Full Stack / Web de Alto Tráfego / Dados em Tempo Real",
            summary: "Uma plataforma de eventos desenvolvida durante minha passagem pela DAYTWO, com foco em programação, integração de dados e experiências para o usuário.",
            overview: "A Kongsberg Agenda é uma plataforma de eventos que apresenta programação, informações do programa e experiências relacionadas a uma agenda norueguesa de tecnologia e sociedade com alta visibilidade.",
            role: "Na DAYTWO, atuei como engenheiro de software full stack em integração de dados, programação de eventos, features de frontend e backend, otimização de performance e experiências voltadas ao usuário. Foi um trabalho colaborativo de produto - não a construção solo de toda a plataforma.",
            challenge: "Plataformas de eventos precisam de dados de programação em tempo hábil, apresentação clara e performance suficiente para permanecer responsivas quando tráfego e atualizações de conteúdo se intensificam em momentos do programa.",
            approach: "Trabalhei na integração e apresentação de dados do evento, na implementação de features frontend/backend que sustentavam a experiência da agenda e em melhorias de performance nos fluxos principais para o usuário.",
            architecture: "A plataforma combina conteúdo e dados de programação com experiências web voltadas à descoberta do evento e navegação do programa. Minhas contribuições ficaram na interseção entre integração de dados, entrega de features e trabalho frontend/backend com atenção a performance, dentro do time da DAYTWO.",
            results: "Entreguei e melhorei features voltadas ao evento em uma agenda pública real, com atenção a programação, integrações e apresentação responsiva.",
            technologies: ["JavaScript", "TypeScript", "Craft CMS", "HTML/CSS", "Otimização de performance"]
        }
    }
];

export const additionalProjectArray: AdditionalProject[] = [
    {
        id: "notco",
        hasPublicUrl: true,
        url: "https://notco.com/",
        image: "images/notcoimage.webp",
        en: {
            title: "NotCo",
            summary: "Revolutionizing plant-based food with cutting-edge AI to create sustainable, delicious alternatives for a better future. Frontend implementation and performance-minded delivery as part of the DAYTWO team."
        },
        pt: {
            title: "NotCo",
            summary: "Revolucionando alimentos à base de plantas com IA de ponta para criar alternativas sustentáveis e deliciosas para um futuro melhor. Implementação frontend e entrega com atenção a performance como parte do time da DAYTWO."
        }
    },
    {
        id: "nordic-batteries",
        hasPublicUrl: true,
        url: "https://nordicbatteries.com/",
        image: "images/nordicimage.webp",
        en: {
            title: "Nordic Batteries",
            summary: "Powering sustainable energy solutions with innovative battery technology for a greener, brighter future. Marketing and product web presence with responsive interfaces and CMS-backed content workflows."
        },
        pt: {
            title: "Nordic Batteries",
            summary: "Potencializando soluções de energia sustentável com tecnologia inovadora de baterias para um futuro mais verde e brilhante. Presença web de marketing e produto com interfaces responsivas e fluxos de conteúdo baseados em CMS."
        }
    },
    {
        id: "karen-oliveira",
        hasPublicUrl: true,
        url: "https://nutrikarenoliveira.com.br/",
        image: "images/karenimage.webp",
        en: {
            title: "Nutri Karen Oliveira",
            summary: "Transforming lives through personalized nutrition guidance for health, wellness, and a balanced lifestyle."
        },
        pt: {
            title: "Nutri Karen Oliveira",
            summary: "Transformando vidas por meio de orientação nutricional personalizada para saúde, bem-estar e um estilo de vida equilibrado."
        }
    },
    {
        id: "nantes-mello",
        hasPublicUrl: true,
        url: "https://www.nantesmello.com/",
        image: "images/nantesimage.webp",
        en: {
            title: "Nantes Mello",
            summary: "Personalized and multidisciplinary care for high complexity local and international matters."
        },
        pt: {
            title: "Nantes Mello",
            summary: "Atendimento personalizado e multidisciplinar para questões locais e internacionais de alta complexidade."
        }
    },
    {
        id: "solon",
        hasPublicUrl: true,
        url: "https://soloneiendom.no/",
        image: "images/solonimage.webp",
        en: {
            title: "Solon Eiendom",
            summary: "Building sustainable, high-quality homes that combine modern design with environmental responsibility."
        },
        pt: {
            title: "Solon Eiendom",
            summary: "Construindo casas sustentáveis e de alta qualidade que combinam design moderno com responsabilidade ambiental."
        }
    }
];
