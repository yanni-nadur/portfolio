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

export type SkillFamiliarity = "proficient" | "familiar";

export type SkillAudioPresetId =
    | "frontend-keys"
    | "backend-rhodes"
    | "ai-pads"
    | "databases-piano"
    | "payments-jazz"
    | "architecture-minimal"
    | "cloud-ambient"
    | "quality-vinyl";

export type SkillTrackCopy = {
    title: string;
    musicalSubtitle: string | null;
    description: string | null;
};

export type SkillTrack = {
    id: string;
    iconId: string;
    familiarity: SkillFamiliarity;
    musicalVariationId: string;
} & LocalizedPair<SkillTrackCopy>;

export type SkillGroupCopy = {
    title: string;
    description: string;
};

export type SkillGroup = {
    id: string;
    iconId: string;
    audioPresetId: SkillAudioPresetId;
    trackArray: SkillTrack[];
} & LocalizedPair<SkillGroupCopy>;

export type LanguageSkillCopy = {
    title: string;
    level: string;
};

export type LanguageSkill = {
    id: string;
} & LocalizedPair<LanguageSkillCopy>;

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
