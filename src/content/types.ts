// -- TYPES
export type LanguageCode = "en" | "pt";

export type LocalizedPair<T> = {
    en: T;
    pt: T;
};

export type MediaConfig = {
    sources: string[];
    poster: string | null;
    illustrative: boolean;
};

export type FeaturedProjectCopy = {
    title: string;
    category: string;
    summary: string;
    overview: string;
    role: string;
    challenge: string;
    approach: string;
    architecture: string;
    results: string;
    technologies: string[];
};

export type FeaturedProject = {
    id: string;
    featured: true;
    hasPublicUrl: boolean;
    url: string | null;
    image: string | null;
    logo: string | null;
    accent: string;
    media: MediaConfig;
} & LocalizedPair<FeaturedProjectCopy>;

export type AdditionalProjectCopy = {
    title: string;
    summary: string;
};

export type AdditionalProject = {
    id: string;
    hasPublicUrl: boolean;
    url: string | null;
    image: string | null;
    logo: string | null;
    logoInvert?: boolean;
} & LocalizedPair<AdditionalProjectCopy>;

export type ExperienceCopy = {
    company: string;
    role: string;
    period: string;
    location: string;
    bullets: string[];
};

export type ExperienceEntry = {
    id: string;
    concurrentGroup: string | null;
    track: "career" | "education";
    startDate: string;
    endDate: string | null;
    logo: string | null;
} & LocalizedPair<ExperienceCopy>;

export type SkillGroupCopy = {
    title: string;
    items: string[];
};

export type SkillGroup = {
    id: string;
} & LocalizedPair<SkillGroupCopy>;

export type TestimonialCopy = {
    quote: string;
    name: string;
    role: string;
};

export type Testimonial = {
    id: string;
    image: string;
} & LocalizedPair<TestimonialCopy>;

export type ProfileLinks = {
    email: string;
    github: string;
    linkedin: string;
    whatsapp: string | null;
    resumeEn: string;
    resumePt: string;
    logo: string;
    avatar: string | null;
};

export type ProfileCopy = {
    name: string;
    role: string;
    status: string;
    statusMessage: string;
    aboutParagraphArray: string[];
    initials: string;
};

export type UiCopy = Record<string, string>;
