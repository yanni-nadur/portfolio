import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { experienceArray } from "../../content";
import { usePrefersReducedMotion } from "../../hooks/useMediaQuery";
import { useContainerMinWidth } from "../../hooks/useContainerMinWidth";
import { useI18n } from "../../i18n/I18nProvider";
import { CareerTimeline } from "./CareerTimeline";
import { EducationPanel } from "./EducationPanel";
import { ExperienceCard } from "./ExperienceCard";
import { MobileCareerTimeline } from "./MobileCareerTimeline";
import { TimelineHeader, type TimelineTabId } from "./TimelineHeader";
import {
    compareExperienceNewestFirst,
    scrollChildIntoContainer
} from "./timelineDates";

// -- CONSTANTS
const COMPACT_LAYOUT_MAX_WIDTH = 640;
const BACK_TO_TOP_THRESHOLD = 220;

// -- FUNCTIONS
function ArrowUpIcon()
{
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path
                d="M12 19V5M5 12l7-7 7 7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

// -- OPERATIONS
export default function TimelineApp()
{
    const { t } = useI18n();
    const appRef = useRef<HTMLDivElement | null>(null);
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const cardElementByIdRef = useRef<Record<string, HTMLElement | null>>({});
    const prefersReducedMotion = usePrefersReducedMotion();
    const isWideLayout = useContainerMinWidth(appRef, COMPACT_LAYOUT_MAX_WIDTH);

    const [activeTabId, setActiveTabId] = useState<TimelineTabId>("career");
    const [selectedExperienceId, setSelectedExperienceId] = useState<string | null>(null);
    const [showBackToTop, setShowBackToTop] = useState(false);

    const careerArray = useMemo(
        () => experienceArray
            .filter((entry) => entry.track === "career")
            .slice()
            .sort(compareExperienceNewestFirst),
        []
    );
    const educationArray = useMemo(
        () => experienceArray.filter((entry) => entry.track === "education"),
        []
    );

    const registerCardRef = useCallback((experienceId: string, element: HTMLElement | null) =>
    {
        cardElementByIdRef.current[experienceId] = element;
    }, []);

    const scrollToExperience = useCallback((experienceId: string) =>
    {
        const container = scrollRef.current;
        const cardElement = cardElementByIdRef.current[experienceId];

        if (!container || !cardElement)
        {
            return;
        }

        scrollChildIntoContainer(container, cardElement, {
            behavior: prefersReducedMotion ? "auto" : "smooth",
            topOffset: 10
        });
    }, [prefersReducedMotion]);

    const selectExperience = useCallback((experienceId: string) =>
    {
        setSelectedExperienceId(experienceId);

        window.requestAnimationFrame(() =>
        {
            scrollToExperience(experienceId);
        });
    }, [scrollToExperience]);

    const scrollToTop = useCallback(() =>
    {
        const container = scrollRef.current;

        if (!container)
        {
            return;
        }

        container.scrollTo({
            top: 0,
            behavior: prefersReducedMotion ? "auto" : "smooth"
        });
    }, [prefersReducedMotion]);

    useEffect(() =>
    {
        const container = scrollRef.current;

        if (!container)
        {
            return;
        }

        function handleScroll()
        {
            if (!scrollRef.current)
            {
                return;
            }

            setShowBackToTop(scrollRef.current.scrollTop > BACK_TO_TOP_THRESHOLD);
        }

        handleScroll();
        container.addEventListener("scroll", handleScroll, { passive: true });

        return () =>
        {
            container.removeEventListener("scroll", handleScroll);
        };
    }, [activeTabId, isWideLayout]);

    return (
        <div ref={appRef} className="timeline-app flex h-full min-h-0 flex-col">
            <TimelineHeader
                activeTabId={activeTabId}
                onTabChange={setActiveTabId}
            />

            <div ref={scrollRef} className="timeline-scroll min-h-0 flex-1 overflow-auto px-4 pb-5 sm:px-5">
                {activeTabId === "career" ? (
                    <div
                        role="tabpanel"
                        id="timeline-panel-career"
                        aria-labelledby="timeline-tab-career"
                        className="space-y-5"
                    >
                        {isWideLayout ? (
                            <>
                                <CareerTimeline
                                    careerArray={careerArray}
                                    selectedExperienceId={selectedExperienceId}
                                    onSelectExperience={selectExperience}
                                />
                                <ol className="timeline-card-list space-y-3">
                                    {careerArray.map((entry) => (
                                        <li key={entry.id}>
                                            <ExperienceCard
                                                entry={entry}
                                                isSelected={selectedExperienceId === entry.id}
                                                cardRef={(element) => registerCardRef(entry.id, element)}
                                            />
                                        </li>
                                    ))}
                                </ol>
                            </>
                        ) : (
                            <MobileCareerTimeline
                                careerArray={careerArray}
                                selectedExperienceId={selectedExperienceId}
                                onSelectExperience={selectExperience}
                                registerCardRef={registerCardRef}
                            />
                        )}
                    </div>
                ) : (
                    <EducationPanel educationArray={educationArray} />
                )}
            </div>

            {showBackToTop ? (
                <button
                    type="button"
                    className="timeline-back-to-top"
                    onClick={scrollToTop}
                    aria-label={t("simpleScrollTop")}
                >
                    <ArrowUpIcon />
                </button>
            ) : null}
        </div>
    );
}
