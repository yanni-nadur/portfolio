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
            const maxScrollY = document.documentElement.scrollHeight - window.innerHeight;
            setShowScrollTop(scrollY > 480);

            if (maxScrollY > 0 && scrollY >= maxScrollY - 48)
            {
                setActiveSectionId("contact");
            }

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
                const maxScrollY = document.documentElement.scrollHeight - window.innerHeight;

                if (maxScrollY > 0 && window.scrollY >= maxScrollY - 48)
                {
                    setActiveSectionId("contact");
                    return;
                }

                const visibleEntry = entryArray
                    .filter((entry) => entry.isIntersecting)
                    .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];

                if (visibleEntry?.target.id)
                {
                    setActiveSectionId(visibleEntry.target.id as SectionId);
                }
            },
            {
                rootMargin: "-20% 0px -45% 0px",
                threshold: [0.1, 0.25, 0.5, 0.75]
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

        setActiveSectionId(sectionId);
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
                        <AnimatedMenuIcon isOpen={isMenuOpen} />
                    </button>
                    <button
                        type="button"
                        className="ml-auto inline-flex w-fit shrink-0 items-center gap-2 rounded-2xl bg-accent px-3 py-2.5 text-left text-sm font-semibold text-white shadow-glow transition duration-200 hover:-translate-y-0.5 hover:bg-accentDeep hover:shadow-[0_0_28px_rgba(217,119,47,0.45)] sm:text-base"
                        onClick={openOs}
                    >
                        <MonitorIcon />
                        <span>{t("simpleHeroCtaOs")}</span>
                    </button>
                </header>
                <div
                    className={`fixed inset-x-0 bottom-0 top-[4.25rem] z-30 lg:hidden ${
                        isMenuOpen ? "pointer-events-auto" : "pointer-events-none"
                    }`}
                    aria-hidden={!isMenuOpen}
                >
                    <button
                        type="button"
                        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ease-out motion-reduce:transition-none ${
                            isMenuOpen ? "opacity-100" : "opacity-0"
                        }`}
                        aria-label={t("simpleMenuClose")}
                        tabIndex={isMenuOpen ? 0 : -1}
                        onClick={() => setIsMenuOpen(false)}
                    />
                    <div
                        id="simple-menu"
                        className={`relative flex h-full w-[min(22rem,88vw)] flex-col overflow-y-auto border-r border-[#E7C8BE]/80 bg-[#FFF8F4] px-4 py-4 shadow-window transition-transform duration-300 ease-out motion-reduce:transition-none dark:border-white/10 dark:bg-black ${
                            isMenuOpen ? "translate-x-0" : "-translate-x-full"
                        }`}
                    >
                        <button
                            type="button"
                            className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-base font-semibold text-accent transition duration-200 hover:translate-x-0.5 hover:bg-accent/10"
                            tabIndex={isMenuOpen ? 0 : -1}
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
                <aside className="sticky top-0 z-20 hidden h-[100dvh] w-64 shrink-0 flex-col overflow-hidden border-r border-[#E7C8BE]/80 bg-[#FFF8F4]/80 px-3 py-4 backdrop-blur-md dark:border-white/10 dark:bg-black/60 lg:flex">
                    <button
                        type="button"
                        className="mb-3 flex w-full items-center gap-2 rounded-2xl bg-accent px-3 py-3 text-left text-base font-semibold leading-tight text-white shadow-glow transition duration-200 hover:-translate-y-0.5 hover:bg-accentDeep hover:shadow-[0_0_28px_rgba(217,119,47,0.45)]"
                        onClick={openOs}
                    >
                        <MonitorIcon />
                        <span>{t("simpleHeroCtaOs")}</span>
                    </button>
                    <button
                        type="button"
                        className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-base font-semibold text-accent transition duration-200 hover:translate-x-0.5 hover:bg-accent/10"
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

                    <ContactSection />
                    </div>
                    </div>
                </main>
            </div>

            {showScrollTop ? (
                <button
                    type="button"
                    className="fixed bottom-20 right-4 z-30 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white shadow-glow transition duration-200 hover:-translate-y-1 hover:bg-accentDeep hover:shadow-[0_0_28px_rgba(217,119,47,0.45)] sm:bottom-6 sm:right-5"
                    onClick={() => scrollToSection("banner")}
                >
                    {t("simpleScrollTop")}
                </button>
            ) : null}
        </div>
    );
}

// ~~
function ContactSection()
{
    const { t } = useI18n();
    const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "fallback">("idle");

    useEffect(() =>
    {
        if (copyStatus === "idle")
        {
            return;
        }

        const timeoutId = window.setTimeout(() =>
        {
            setCopyStatus("idle");
        }, 2200);

        return () =>
        {
            window.clearTimeout(timeoutId);
        };
    }, [copyStatus]);

    async function handleCopyEmail()
    {
        try
        {
            if (navigator.clipboard?.writeText)
            {
                await navigator.clipboard.writeText(profileLinks.email);
                setCopyStatus("copied");
                return;
            }
        }
        catch
        {
            // Fall through to the manual fallback path.
        }

        window.prompt(t("simpleCopyEmailFallback"), profileLinks.email);
        setCopyStatus("fallback");
    }

    const headlineText = t("simpleContactHeadline");
    const accentText = t("simpleContactHeadlineAccent");
    const accentIndex = headlineText.toLocaleLowerCase().lastIndexOf(accentText.toLocaleLowerCase());
    const headlineBefore = accentIndex >= 0 ? headlineText.slice(0, accentIndex) : headlineText;
    const headlineAccent = accentIndex >= 0
        ? headlineText.slice(accentIndex, accentIndex + accentText.length)
        : "";
    const headlineAfter = accentIndex >= 0
        ? headlineText.slice(accentIndex + accentText.length)
        : "";

    const secondaryActionClassName = "inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl border border-black/10 bg-black/[0.03] px-5 py-3 text-sm font-semibold text-ink transition duration-200 hover:-translate-y-0.5 hover:border-accent/60 hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:border-white/20 dark:bg-white/5 dark:text-[#FFF7E8] dark:hover:border-[#F2C14B]/70 dark:hover:text-[#F2C14B] sm:w-auto";

    return (
        <section id="contact" className="scroll-mt-24 lg:scroll-mt-6 flex min-h-[70vh] flex-col pb-8 pt-2">
            <div className="max-w-3xl">
                <div className="flex flex-wrap items-center gap-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/70 dark:text-[#FFF7E8]/75">
                        {t("simpleContactTitle")}
                    </p>
                    <span className="inline-flex rounded-full border border-accent/35 bg-accent/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-accent">
                        {t("simpleContactAvailability")}
                    </span>
                </div>

                <h2 className="mt-4 font-display text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-[1.12] tracking-tight text-ink dark:text-[#FFF7E8]">
                    {headlineBefore}
                    {headlineAccent ? (
                        <span className="text-accent dark:text-[#F2C14B]">{headlineAccent}</span>
                    ) : null}
                    {headlineAfter}
                </h2>

                <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink/90 dark:text-[#FFF7E8] sm:text-lg">
                    {t("simpleContactIntro")}
                </p>

                <div className="mt-8 flex w-full max-w-2xl flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <a
                        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-accent px-5 py-3 text-sm font-semibold text-white shadow-soft transition duration-200 hover:-translate-y-0.5 hover:bg-accentDeep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:w-auto"
                        href={`mailto:${profileLinks.email}`}
                    >
                        <MailIcon />
                        {t("simpleEmailCta")}
                    </a>
                    {profileLinks.whatsapp ? (
                        <a
                            className={secondaryActionClassName}
                            href={profileLinks.whatsapp}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <WhatsappIcon />
                            {t("simpleWhatsappCta")}
                        </a>
                    ) : null}
                    <a
                        className={secondaryActionClassName}
                        href={profileLinks.linkedin}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <LinkedinGlyphIcon />
                        {t("simpleLinkedinCta")}
                    </a>
                </div>

                <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-3 text-sm text-ink dark:text-[#FFF7E8]">
                    <a
                        className="inline-flex items-center gap-1.5 font-medium transition hover:text-accent"
                        href={profileLinks.github}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <GithubGlyphIcon />
                        {t("contactsGithub")}
                    </a>
                    <span className="hidden text-ink/30 dark:text-white/35 sm:inline" aria-hidden="true">
                        ·
                    </span>
                    <a
                        className="inline-flex items-center gap-1.5 font-medium transition hover:text-accent"
                        href={getAssetUrl(profileLinks.resumeEn)}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <FileIcon />
                        {t("simpleResumeEn")}
                    </a>
                    <a
                        className="inline-flex items-center gap-1.5 font-medium transition hover:text-accent"
                        href={getAssetUrl(profileLinks.resumePt)}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <FileIcon />
                        {t("simpleResumePt")}
                    </a>
                    <span className="hidden text-ink/30 dark:text-white/35 sm:inline" aria-hidden="true">
                        ·
                    </span>
                    <button
                        type="button"
                        className="inline-flex items-center gap-1.5 font-medium transition hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                        onClick={handleCopyEmail}
                    >
                        <CopyIcon />
                        {copyStatus === "copied" ? t("simpleCopyEmailDone") : t("simpleCopyEmail")}
                    </button>
                </div>

                <p
                    className={`mt-2 min-h-4 text-xs text-accent transition-opacity duration-200 ${
                        copyStatus === "idle" ? "opacity-0" : "opacity-100"
                    }`}
                    aria-live="polite"
                >
                    {copyStatus === "copied"
                        ? t("simpleCopyEmailDone")
                        : copyStatus === "fallback"
                            ? t("simpleCopyEmailFallback")
                            : "\u00A0"}
                </p>
            </div>

            <footer className="mt-auto border-t border-line/50 pt-6 dark:border-white/10">
                <p className="text-xs text-ink/55 dark:text-[#FFF7E8]/55">
                    {t("simpleFooter")}
                </p>
            </footer>
        </section>
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
function AnimatedMenuIcon({ isOpen }: { isOpen: boolean })
{
    const barClassName = "absolute left-0 h-0.5 w-5 rounded-full bg-current transition duration-300 ease-out motion-reduce:transition-none";

    return (
        <span className="relative block h-5 w-5" aria-hidden="true">
            <span
                className={`${barClassName} top-[3px] origin-center ${
                    isOpen ? "translate-y-[7px] rotate-45" : ""
                }`}
            />
            <span
                className={`${barClassName} top-[9px] ${
                    isOpen ? "scale-x-0 opacity-0" : "scale-x-100 opacity-100"
                }`}
            />
            <span
                className={`${barClassName} top-[15px] origin-center ${
                    isOpen ? "-translate-y-[7px] -rotate-45" : ""
                }`}
            />
        </span>
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
function WhatsappIcon()
{
    return (
        <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden="true" fill="currentColor">
            <path d="M12.04 2.05c-5.46 0-9.9 4.4-9.9 9.83 0 1.73.45 3.42 1.31 4.91L2 22l5.39-1.4a9.95 9.95 0 0 0 4.65 1.15h.01c5.46 0 9.9-4.4 9.9-9.83 0-2.62-1.03-5.09-2.9-6.94a9.9 9.9 0 0 0-6.99-2.93Zm0 1.8c1.99 0 3.86.77 5.27 2.16a7.4 7.4 0 0 1 2.18 5.27c0 4.47-3.66 8.1-8.15 8.1a8.2 8.2 0 0 1-4.16-1.13l-.3-.17-3.2.84.86-3.09-.2-.32a8.05 8.05 0 0 1-1.25-4.23c0-4.47 3.66-8.1 8.15-8.1Zm4.66 10.3c-.25-.13-1.5-.74-1.74-.82-.23-.09-.4-.13-.57.13-.17.25-.65.82-.8 1-.15.17-.29.2-.54.07-.25-.13-1.05-.38-2-1.22-.74-.65-1.24-1.46-1.39-1.71-.15-.25-.02-.38.11-.51.12-.12.25-.29.38-.44.13-.15.17-.25.25-.42.09-.17.04-.32-.02-.44-.07-.13-.57-1.36-.78-1.86-.2-.48-.41-.41-.57-.42h-.49c-.17 0-.44.06-.67.32-.23.25-.88.86-.88 2.09 0 1.23.9 2.42 1.03 2.59.13.17 1.77 2.7 4.28 3.78 2.51 1.09 2.51.73 2.96.68.45-.04 1.5-.61 1.71-1.2.21-.59.21-1.1.15-1.2-.06-.11-.23-.17-.48-.3Z" />
        </svg>
    );
}

// ~~
function LinkedinGlyphIcon()
{
    return (
        <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden="true" fill="currentColor">
            <path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1-.02-5ZM3.5 9.75h2.96V20.5H3.5V9.75Zm5.3 0H11.6v1.46h.04c.43-.81 1.48-1.66 3.05-1.66 3.26 0 3.86 2.15 3.86 4.94V20.5h-2.96v-5.2c0-1.24-.02-2.84-1.73-2.84-1.73 0-2 1.35-2 2.75v5.29H8.8V9.75Z" />
        </svg>
    );
}

// ~~
function GithubGlyphIcon()
{
    return (
        <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden="true" fill="currentColor">
            <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0 1 12 6.8a9.56 9.56 0 0 1 2.5.34c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.6 1.03 2.69 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.86v2.76c0 .26.18.58.69.48A10 10 0 0 0 12 2Z" />
        </svg>
    );
}

// ~~
function CopyIcon()
{
    return (
        <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden="true" fill="none">
            <rect x="8" y="8" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.8" />
            <path d="M6 15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
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
    const className = "project-card-glow flex w-[85%] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-line/80 bg-white/85 shadow-soft transition duration-200 hover:-translate-y-1 hover:border-accent/60 dark:border-white/10 dark:bg-black/55 lg:w-auto";
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
