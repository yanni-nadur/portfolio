import type { ExperienceEntry } from "../../content/types";
import { useI18n } from "../../i18n/I18nProvider";
import type { BarLayout } from "./timelineDates";

// -- TYPES
type CareerTimelineRowProps = {
    entry: ExperienceEntry;
    barLayout: BarLayout;
    isSelected: boolean;
    onSelect: (experienceId: string) => void;
};

// -- OPERATIONS
export function CareerTimelineRow({
    entry,
    barLayout,
    isSelected,
    onSelect
}: CareerTimelineRowProps)
{
    const { localize, t } = useI18n();
    const localized = localize(entry);
    const barClassName = barLayout.isOngoing
        ? "timeline-bar timeline-bar-current"
        : "timeline-bar timeline-bar-past";

    return (
        <button
            type="button"
            className={`timeline-row ${isSelected ? "timeline-row-selected" : ""}`}
            data-experience-id={entry.id}
            onClick={() => onSelect(entry.id)}
            aria-pressed={isSelected}
            aria-controls={`experience-card-${entry.id}`}
            aria-label={`${localized.company}. ${localized.role}. ${localized.period}. ${isSelected ? t("calendarSelected") : t("calendarSelectExperience")}`}
            title={localized.role}
        >
            <span className="timeline-row-meta">
                <span className="timeline-row-company">{localized.company}</span>
                <span className="timeline-row-period">{localized.period}</span>
            </span>
            <span className="timeline-track" aria-hidden="true">
                <span
                    className={`${barClassName} ${isSelected ? "timeline-bar-selected" : ""}`}
                    style={{
                        left: `${barLayout.leftPercent}%`,
                        width: `${barLayout.widthPercent}%`
                    }}
                />
            </span>
        </button>
    );
}
