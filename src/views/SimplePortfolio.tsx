import { useEffect, useMemo, useRef, useState } from "react";
import { animated, useSpring } from "@react-spring/web";
import {
    additionalProjectArray,
    experienceArray,
    featuredProjectArray,
    getAssetUrl,
    profileCopy,
    profileLinks,
    testimonialArray
} from "../content";
import { CompanyMark } from "../components/CompanyMark";
import { AppearanceControls } from "../components/AppearanceControls";
import { SkillCarousel } from "../components/SkillCarousel";
import { useI18n } from "../i18n/I18nProvider";
import { usePrefersReducedMotion } from "../hooks/useMediaQuery";
import { useSettings } from "../store/settingsStore";
import { useView } from "../store/viewStore";
import { Wallpaper } from "../system/Wallpaper";

// -- TYPES
type SectionId =
    | "banner"
    | "skills"
    | "experience"
    | "work"
    | "testimonials"
    | "contact";

// -- CONSTANTS
const SECTION_ID_ARRAY: SectionId[] = [
    "banner",
    "skills",
    "experience",
    "work",
    "testimonials",
    "contact"
];

// -- OPERATIONS
export function SimplePortfolio()
{
    const { t, localize } = useI18n();
    const { parallaxEnabled } = useSettings();
    const { openLanding, openOs } = useView();
    const prefersReducedMotion = usePrefersReducedMotion();
    const profile = localize(profileCopy);
    const careerArray = experienceArray.filter((entry) => entry.track === "career");
    const educationArray = experienceArray.filter((entry) => entry.track === "education");
    const [activeSectionId, setActiveSectionId] = useState<SectionId>("banner");
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);

    const navItemArray = useMemo(() =>
    {
        return [
            { id: "banner" as const, label: t("simpleNavAbout") },
            { id: "skills" as const, label: t("simpleNavSkills") },
            { id: "experience" as const, label: t("simpleNavExperience") },
            { id: "work" as const, label: t("simpleNavWork") },
            { id: "testimonials" as const, label: t("simpleNavTestimonials") },
            { id: "contact" as const, label: t("simpleNavContact") }
        ];
    }, [t]);

    const canParallax = parallaxEnabled && !prefersReducedMotion;

    const [parallaxStyle, parallaxApi] = useSpring(() => ({
        x: 0,
        y: 0,
        scrollY: 0,
        config: { mass: 1, tension: 120, friction: 28 },
        immediate: prefersReducedMotion
    }));

    useEffect(() =>
    {
        function handleScroll()
        {
            const scrollY = window.scrollY;
            setShowScrollTop(scrollY > 480);

            if (canParallax)
            {
                parallaxApi.start({ scrollY, immediate: false });
            }
        }

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });

        return () =>
        {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [canParallax, parallaxApi]);

    useEffect(() =>
    {
        const observer = new IntersectionObserver(
            (entryArray) =>
            {
                const visibleEntry = entryArray
                    .filter((entry) => entry.isIntersecting)
                    .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];

                if (visibleEntry?.target.id)
                {
                    setActiveSectionId(visibleEntry.target.id as SectionId);
                }
            },
            {
                rootMargin: "-25% 0px -55% 0px",
                threshold: [0.15, 0.35, 0.6]
            }
        );

        SECTION_ID_ARRAY.forEach((sectionId) =>
        {
            const element = document.getElementById(sectionId);

            if (element)
            {
                observer.observe(element);
            }
        });

        return () =>
        {
            observer.disconnect();
        };
    }, []);

    function scrollToSection(sectionId: SectionId)
    {
        const element = document.getElementById(sectionId);

        if (!element)
        {
            return;
        }

        setIsMenuOpen(false);
        element.scrollIntoView({
            behavior: prefersReducedMotion ? "auto" : "smooth",
            block: "start"
        });
    }

    useEffect(() =>
    {
        if (!isMenuOpen)
        {
            return;
        }

        function handleKeyDown(event: KeyboardEvent)
        {
            if (event.key === "Escape")
            {
                setIsMenuOpen(false);
            }
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKeyDown);

        return () =>
        {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isMenuOpen]);

    return (
        <div ref={rootRef} className="relative min-h-[100dvh] w-full text-ink dark:text-mist">
            <Wallpaper className="fixed inset-0" />

            <div className="relative z-10 flex w-full flex-col lg:flex-row lg:items-stretch">
                <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-[#E7C8BE]/80 bg-[#FFF8F4]/90 px-3 py-3 backdrop-blur-md dark:border-white/10 dark:bg-black/80 lg:hidden">
                    <button
                        type="button"
                        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-ink dark:text-mist"
                        aria-expanded={isMenuOpen}
                        aria-controls="simple-menu"
                        aria-label={isMenuOpen ? t("simpleMenuClose") : t("simpleMenuOpen")}
                        onClick={() => setIsMenuOpen((currentValue) => !currentValue)}
                    >
                        {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
                    </button>
                    <button
                        type="button"
                        className="inline-flex min-w-0 flex-1 items-center gap-2 rounded-2xl bg-accent px-3 py-2.5 text-left text-base font-semibold text-white shadow-glow"
                        onClick={openOs}
                    >
                        <MonitorIcon />
                        <span className="truncate">{t("simpleHeroCtaOs")}</span>
                    </button>
                </header>
                {isMenuOpen ? (
                    <div className="fixed inset-x-0 bottom-0 top-[4.25rem] z-30 lg:hidden">
                        <button
                            type="button"
                            className="absolute inset-0 bg-black/50"
                            aria-label={t("simpleMenuClose")}
                            onClick={() => setIsMenuOpen(false)}
                        />
                        <div
                            id="simple-menu"
                            className="relative flex h-full w-[min(22rem,88vw)] flex-col overflow-y-auto border-r border-[#E7C8BE]/80 bg-[#FFF8F4] px-4 py-4 dark:border-white/10 dark:bg-black"
                        >
                            <button
                                type="button"
                                className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-base font-semibold text-accent"
                                onClick={openLanding}
                            >
                                <ArrowLeftIcon />
                                <span>{t("simpleBack")}</span>
                            </button>
                            <p className="mt-4 px-2 text-xs font-semibold uppercase tracking-[0.16em] text-slateSoft dark:text-white/45">
                                {t("simpleNavIndex")}
                            </p>
                            <SectionNav
                                itemArray={navItemArray}
                                activeSectionId={activeSectionId}
                                label={t("simpleNavIndex")}
                                onSelect={scrollToSection}
                            />
                            <div className="mt-auto border-t border-[#E7C8BE]/70 pt-3 dark:border-white/10">
                                <AppearanceControls labelMode="always" />
                            </div>
                        </div>
                    </div>
                ) : null}
                <aside className="sticky top-0 z-20 hidden h-[100dvh] w-64 shrink-0 flex-col overflow-hidden border-r border-[#E7C8BE]/80 bg-[#FFF8F4]/80 px-3 py-4 backdrop-blur-md dark:border-white/10 dark:bg-black/60 lg:flex">
                    <button
                        type="button"
                        className="mb-3 flex w-full items-center gap-2 rounded-2xl bg-accent px-3 py-3 text-left text-base font-semibold leading-tight text-white shadow-glow"
                        onClick={openOs}
                    >
                        <MonitorIcon />
                        <span>{t("simpleHeroCtaOs")}</span>
                    </button>
                    <button
                        type="button"
                        className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-base font-semibold text-accent"
                        onClick={openLanding}
                    >
                        <ArrowLeftIcon />
                        <span>{t("simpleBack")}</span>
                    </button>
                    <p className="mt-4 px-2 text-xs font-semibold uppercase tracking-[0.16em] text-slateSoft dark:text-white/45">
                        {t("simpleNavIndex")}
                    </p>
                    <SectionNav
                        itemArray={navItemArray}
                        activeSectionId={activeSectionId}
                        label={t("simpleNavIndex")}
                        onSelect={scrollToSection}
                    />
                    <div className="mt-auto shrink-0 border-t border-[#E7C8BE]/70 pt-3 dark:border-white/10">
                        <AppearanceControls labelMode="always" />
                    </div>
                </aside>

                <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-12 lg:py-8 xl:px-16 min-[1600px]:px-0">
                    <div className="min-[1600px]:grid min-[1600px]:grid-cols-10">
                    <div className="space-y-16 min-[1600px]:col-start-2 min-[1600px]:col-span-8">
                    <section id="banner" className="scroll-mt-24 lg:scroll-mt-6 space-y-5">
                        <animated.div
                            className="overflow-hidden rounded-[1.75rem] border border-[#E7C8BE] bg-white/75 p-5 text-ink shadow-window backdrop-blur-md dark:border-white/10 dark:bg-black/45 dark:text-[#FFF7E8] sm:p-8 lg:p-10"
                            style={{
                                y: parallaxStyle.scrollY.to((value) => (canParallax ? value * -0.04 : 0))
                            }}
                        >
                            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                                <img
                                    src={getAssetUrl(profileLinks.avatar ?? "images/origami.svg")}
                                    alt=""
                                    className="h-32 w-32 rounded-full object-cover ring-2 ring-[#D9772F]/70 sm:h-40 sm:w-40"
                                />
                                <div className="min-w-0">
                                    <p className="inline-flex rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                                        {profile.status}
                                    </p>
                                    <h1 className="mt-3 font-display text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                                        {profile.name}
                                    </h1>
                                    <p className="mt-2 text-base text-accent">
                                        {profile.role}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-6 max-w-4xl space-y-3 text-base leading-relaxed text-ink/80 dark:text-[#FFF7E8]/90">
                                {profile.aboutParagraphArray.map((paragraphText) => (
                                    <p key={paragraphText}>{paragraphText}</p>
                                ))}
                            </div>
                            <div className="mt-6 flex flex-wrap gap-2">
                                <a
                                    className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white"
                                    href={`mailto:${profileLinks.email}`}
                                >
                                    <MailIcon />
                                    {t("simpleEmailCta")}
                                </a>
                                <a
                                    className="inline-flex items-center gap-2 rounded-full bg-black/5 px-4 py-2 text-sm font-semibold dark:bg-white/10"
                                    href={getAssetUrl(profileLinks.resumeEn)}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <FileIcon />
                                    {t("simpleResumeEn")}
                                </a>
                                <a
                                    className="inline-flex items-center gap-2 rounded-full bg-black/5 px-4 py-2 text-sm font-semibold dark:bg-white/10"
                                    href={getAssetUrl(profileLinks.resumePt)}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <FileIcon />
                                    {t("simpleResumePt")}
                                </a>
                            </div>
                        </animated.div>
                    </section>

                    <section id="skills" className="scroll-mt-24 lg:scroll-mt-6 space-y-4">
                        <h2 className="font-display text-2xl font-semibold sm:text-3xl">
                            {t("simpleSkillsTitle")}
                        </h2>
                        <SkillCarousel />
                    </section>

                    <section id="experience" className="scroll-mt-24 lg:scroll-mt-6 space-y-6">
                        <h2 className="font-display text-2xl font-semibold sm:text-3xl">
                            {t("simpleExperienceTitle")}
                        </h2>
                        <div className="relative">
                            <div
                                className="absolute bottom-6 left-[14rem] top-6 hidden w-px bg-accent/35 lg:block"
                                aria-hidden="true"
                            />
                            <ol className="space-y-5">
                                {careerArray.map((entry) =>
                                {
                                    const localized = localize(entry);

                                    return (
                                        <li
                                            key={entry.id}
                                            className="grid items-start gap-3 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-0"
                                        >
                                            <div className="lg:pr-6 lg:pt-4 lg:text-right">
                                                <p className="text-sm font-semibold leading-snug text-accent">
                                                    {localized.period}
                                                </p>
                                                <p className="mt-1 text-xs leading-snug text-slateSoft dark:text-white/55">
                                                    {localized.location}
                                                </p>
                                            </div>
                                            <div className="min-w-0 lg:pl-6">
                                                <ExperienceEntryCard
                                                    companyName={localized.company}
                                                    role={localized.role}
                                                    period={localized.period}
                                                    location={localized.location}
                                                    bulletArray={localized.bullets}
                                                    logo={entry.logo}
                                                    note={entry.concurrentGroup === "sister" ? t("calendarConcurrentNote") : null}
                                                    showSchedule={false}
                                                />
                                            </div>
                                        </li>
                                    );
                                })}
                            </ol>
                        </div>
                        {educationArray.length > 0 ? (
                            <div className="space-y-3">
                                <h3 className="font-display text-xl font-semibold">
                                    {t("simpleEducationTitle")}
                                </h3>
                                {educationArray.map((entry) =>
                                {
                                    const localized = localize(entry);

                                    return (
                                        <ExperienceEntryCard
                                            key={entry.id}
                                            companyName={localized.company}
                                            role={localized.role}
                                            period={localized.period}
                                            location={localized.location}
                                            bulletArray={localized.bullets}
                                            logo={entry.logo}
                                            note={null}
                                            showSchedule={true}
                                        />
                                    );
                                })}
                            </div>
                        ) : null}
                    </section>

                    <section id="work" className="scroll-mt-24 lg:scroll-mt-6 space-y-4">
                        <h2 className="font-display text-2xl font-semibold sm:text-3xl">
                            {t("simpleWorkTitle")}
                        </h2>
                        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 pt-1 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0">
                            {featuredProjectArray.map((project) =>
                            {
                                const localized = localize(project);

                                return (
                                    <ProjectLinkCard
                                        key={project.id}
                                        title={localized.title}
                                        summary={localized.summary}
                                        image={project.image}
                                        url={project.hasPublicUrl ? project.url : null}
                                        visitLabel={t("photosVisit")}
                                    />
                                );
                            })}
                            {additionalProjectArray.map((project) =>
                            {
                                const localized = localize(project);

                                return (
                                    <ProjectLinkCard
                                        key={project.id}
                                        title={localized.title}
                                        summary={localized.summary}
                                        image={project.image}
                                        url={project.hasPublicUrl ? project.url : null}
                                        visitLabel={t("photosVisit")}
                                    />
                                );
                            })}
                        </div>
                    </section>

                    <section id="testimonials" className="scroll-mt-24 lg:scroll-mt-6 space-y-4">
                        <h2 className="font-display text-2xl font-semibold sm:text-3xl">
                            {t("simpleTestimonialsTitle")}
                        </h2>
                        <div className="space-y-3">
                            {testimonialArray.map((testimonial) =>
                            {
                                const localized = localize(testimonial);

                                return (
                                    <blockquote
                                        key={testimonial.id}
                                        className="rounded-2xl border border-line/80 bg-white/85 p-4 shadow-soft transition duration-200 hover:-translate-y-1 hover:border-accent/60 hover:shadow-glow dark:border-white/10 dark:bg-black/55"
                                    >
                                        <div className="flex gap-3">
                                            <img
                                                src={getAssetUrl(testimonial.image)}
                                                alt=""
                                                className="h-12 w-12 rounded-full object-cover"
                                            />
                                            <div>
                                                <p className="whitespace-pre-line text-base leading-relaxed text-slateSoft dark:text-white/75">
                                                    “{localized.quote}”
                                                </p>
                                                <footer className="mt-2 text-xs">
                                                    <p className="font-semibold">{localized.name}</p>
                                                    <p className="text-slateSoft dark:text-white/55">
                                                        {localized.role}
                                                    </p>
                                                </footer>
                                            </div>
                                        </div>
                                    </blockquote>
                                );
                            })}
                        </div>
                    </section>

                    <section id="contact" className="scroll-mt-24 lg:scroll-mt-6 space-y-4 pb-16">
                        <h2 className="font-display text-2xl font-semibold sm:text-3xl">
                            {t("simpleContactTitle")}
                        </h2>
                        <div className="rounded-2xl border border-line/80 bg-white/85 p-5 shadow-soft transition duration-200 hover:-translate-y-1 hover:border-accent/60 hover:shadow-glow dark:border-white/10 dark:bg-black/55">
                            <p className="text-base text-slateSoft dark:text-white/70">
                                {profile.statusMessage}
                            </p>
                            <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
                                <a className="text-accent" href={`mailto:${profileLinks.email}`}>
                                    {profileLinks.email}
                                </a>
                                <a
                                    className="text-accent"
                                    href={profileLinks.github}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    GitHub
                                </a>
                                <a
                                    className="text-accent"
                                    href={profileLinks.linkedin}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    LinkedIn
                                </a>
                                {profileLinks.whatsapp ? (
                                    <a
                                        className="text-accent"
                                        href={profileLinks.whatsapp}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        WhatsApp
                                    </a>
                                ) : null}
                            </div>
                        </div>
                    </section>
                    </div>
                    </div>
                </main>
            </div>

            {showScrollTop ? (
                <button
                    type="button"
                    className="fixed bottom-5 right-5 z-30 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white shadow-glow"
                    onClick={() => scrollToSection("banner")}
                >
                    {t("simpleScrollTop")}
                </button>
            ) : null}
        </div>
    );
}

// ~~
function SectionNav({
    itemArray,
    activeSectionId,
    label,
    onSelect
}: {
    itemArray: Array<{ id: SectionId; label: string }>;
    activeSectionId: SectionId;
    label: string;
    onSelect: (sectionId: SectionId) => void;
})
{
    return (
        <nav className="mt-3 min-h-0 flex-1 overflow-y-auto" aria-label={label}>
            <ol className="space-y-1">
                {itemArray.map((item, itemIndex) => (
                    <li key={item.id}>
                        <button
                            type="button"
                            className={`flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left text-base leading-none transition ${
                                activeSectionId === item.id
                                    ? "bg-accent font-semibold text-white"
                                    : "text-slateSoft hover:bg-white/80 dark:text-white/70 dark:hover:bg-white/10"
                            }`}
                            onClick={() => onSelect(item.id)}
                        >
                            <span className={`w-7 shrink-0 font-mono text-sm leading-none ${
                                activeSectionId === item.id ? "text-white/80" : "text-accent"
                            }`}>
                                {String(itemIndex + 1).padStart(2, "0")}
                            </span>
                            <span className="leading-none">{item.label}</span>
                        </button>
                    </li>
                ))}
            </ol>
        </nav>
    );
}

// ~~
function MenuIcon()
{
    return (
        <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
            <path
                d="M4 7h16M4 12h16M4 17h16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
            />
        </svg>
    );
}

// ~~
function CloseIcon()
{
    return (
        <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
            <path
                d="M6 6l12 12M18 6L6 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
            />
        </svg>
    );
}

// ~~
function ExperienceEntryCard({
    companyName,
    role,
    period,
    location,
    bulletArray,
    logo,
    note,
    showSchedule
}: {
    companyName: string;
    role: string;
    period: string;
    location: string;
    bulletArray: string[];
    logo: string | null;
    note: string | null;
    showSchedule: boolean;
})
{
    return (
        <article className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-3 gap-y-3 rounded-2xl border border-line/80 bg-white/85 p-4 shadow-soft transition duration-200 hover:-translate-y-1 hover:border-accent/60 hover:shadow-glow dark:border-white/10 dark:bg-black/55">
            <CompanyMark
                companyName={companyName}
                logo={logo}
                sizeClassName="h-10 w-10"
            />
            <div className="min-w-0">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <div>
                        <p className="font-semibold">{companyName}</p>
                        <p className="text-sm text-accent">{role}</p>
                    </div>
                    {showSchedule ? (
                        <div className="text-left text-xs text-slateSoft sm:text-right dark:text-white/55">
                            <p>{period}</p>
                            {location.length > 0 ? <p>{location}</p> : null}
                        </div>
                    ) : null}
                </div>
            </div>
            <ExperienceBulletList bulletArray={bulletArray} />
            {note ? (
                <p className="col-start-2 text-xs text-accent">{note}</p>
            ) : null}
        </article>
    );
}

// ~~
function ExperienceBulletList({ bulletArray }: { bulletArray: string[] })
{
    return (
        <ul className="col-span-2 space-y-1.5 text-base leading-relaxed text-slateSoft dark:text-white/70">
            {bulletArray.map((bulletText) => (
                <li
                    key={bulletText}
                    className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-3"
                >
                    <span
                        className="mt-[0.45rem] h-1.5 w-1.5 justify-self-center rounded-full bg-accent"
                        aria-hidden="true"
                    />
                    <span>{bulletText}</span>
                </li>
            ))}
        </ul>
    );
}

// ~~
function ArrowLeftIcon()
{
    return (
        <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden="true">
            <path
                d="M19 12H5M11 6l-6 6 6 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

// ~~
function MonitorIcon()
{
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" aria-hidden="true">
            <rect x="3" y="4" width="18" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <path d="M8 20h8M12 16v4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
    );
}

// ~~
function MailIcon()
{
    return (
        <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden="true">
            <rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <path d="M4 7l8 6 8-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// ~~
function FileIcon()
{
    return (
        <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden="true">
            <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M14 3v5h5M8 13h8M8 17h6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
    );
}

// ~~
function ProjectLinkCard({
    title,
    summary,
    image,
    url,
    visitLabel
}: {
    title: string;
    summary: string;
    image: string | null;
    url: string | null;
    visitLabel: string;
})
{
    const className = "flex w-[85%] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-line/80 bg-white/85 shadow-soft transition duration-200 hover:-translate-y-1 hover:border-accent/60 hover:shadow-glow dark:border-white/10 dark:bg-black/55 lg:w-auto";
    const content = (
        <>
            {image ? (
                <img
                    src={getAssetUrl(image)}
                    alt=""
                    className="h-36 w-full object-cover"
                    loading="lazy"
                />
            ) : null}
            <div className="flex flex-1 flex-col p-4">
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-2 flex-1 text-base text-slateSoft dark:text-white/70">
                    {summary}
                </p>
                {url ? (
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-accent">
                        {visitLabel}
                        <ArrowUpRightIcon />
                    </span>
                ) : null}
            </div>
        </>
    );

    if (url)
    {
        return (
            <a
                className={className}
                href={url}
                target="_blank"
                rel="noreferrer"
            >
                {content}
            </a>
        );
    }

    return (
        <article className={className}>
            {content}
        </article>
    );
}

// ~~
function ArrowUpRightIcon()
{
    return (
        <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden="true">
            <path
                d="M7 17L17 7M9 7h8v8"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
