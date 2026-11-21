import { useI18n } from "../../i18n/I18nProvider";

// -- TYPES
export type TimelineTabId = "career" | "education";

type TimelineHeaderProps = {
    activeTabId: TimelineTabId;
    onTabChange: (tabId: TimelineTabId) => void;
};

// -- FUNCTIONS
function selectionClassName(isSelected: boolean): string
{
    if (isSelected)
    {
        return "bg-white text-ink shadow-sm dark:bg-white/15 dark:text-mist";
    }

    return "text-slateSoft hover:text-ink dark:text-white/60 dark:hover:text-mist";
}

// -- OPERATIONS
export function TimelineHeader({ activeTabId, onTabChange }: TimelineHeaderProps)
{
    const { t } = useI18n();

    return (
        <header className="timeline-app-header shrink-0 px-4 pb-3 pt-4 sm:px-5">
            <h3 className="font-display text-2xl font-semibold tracking-tight">
                {t("calendarJourneyTitle")}
            </h3>
            <p className="mt-1 text-sm text-slateSoft dark:text-white/55">
                {t("calendarJourneySubtitle")}
            </p>
            <div
                className="prefs-segmented mt-3 grid grid-cols-2 gap-1 rounded-2xl bg-black/[0.04] p-1 dark:bg-white/10"
                role="tablist"
                aria-label={t("calendarTitle")}
            >
                <button
                    type="button"
                    role="tab"
                    id="timeline-tab-career"
                    aria-selected={activeTabId === "career"}
                    aria-controls="timeline-panel-career"
                    className={`flex min-h-11 items-center justify-center rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${selectionClassName(activeTabId === "career")}`}
                    onClick={() => onTabChange("career")}
                >
                    {t("calendarCareer")}
                </button>
                <button
                    type="button"
                    role="tab"
                    id="timeline-tab-education"
                    aria-selected={activeTabId === "education"}
                    aria-controls="timeline-panel-education"
                    className={`flex min-h-11 items-center justify-center rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${selectionClassName(activeTabId === "education")}`}
                    onClick={() => onTabChange("education")}
                >
                    {t("calendarEducation")}
                </button>
            </div>
        </header>
    );
}
