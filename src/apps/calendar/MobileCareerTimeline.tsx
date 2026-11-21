import type { ExperienceEntry } from "../../content/types";
import { CompanyMark } from "../../components/CompanyMark";
import { useI18n } from "../../i18n/I18nProvider";

// -- TYPES
type MobileCareerTimelineProps = {
    careerArray: ExperienceEntry[];
    selectedExperienceId: string | null;
    onSelectExperience: (experienceId: string) => void;
    registerCardRef: (experienceId: string, element: HTMLElement | null) => void;
};

// -- OPERATIONS
export function MobileCareerTimeline({
    careerArray,
    selectedExperienceId,
    onSelectExperience,
    registerCardRef
}: MobileCareerTimelineProps)
{
    const { t, localize } = useI18n();

    return (
        <ol className="timeline-mobile-list" aria-label={t("calendarCareer")}>
            {careerArray.map((entry) =>
            {
                const localized = localize(entry);
                const isSelected = selectedExperienceId === entry.id;
                const isOngoing = entry.endDate === null;
                const cardId = `experience-card-${entry.id}`;

                return (
                    <li
                        key={entry.id}
                        id={cardId}
                        ref={(element) => registerCardRef(entry.id, element)}
                        className={`timeline-mobile-item ${isSelected ? "timeline-mobile-item-selected" : ""}`}
                        data-experience-id={entry.id}
                    >
                        <button
                            type="button"
                            className={`timeline-mobile-marker ${isOngoing ? "timeline-bar-current" : "timeline-bar-past"} ${isSelected ? "timeline-mobile-marker-selected" : ""}`}
                            aria-label={`${localized.company}. ${localized.period}`}
                            aria-pressed={isSelected}
                            onClick={() => onSelectExperience(entry.id)}
                        />
                        <div className="timeline-mobile-body">
                            <div className="timeline-mobile-header">
                                <CompanyMark
                                    companyName={localized.company}
                                    logo={entry.logo}
                                    sizeClassName="h-10 w-10"
                                />
                                <div className="min-w-0 flex-1">
                                    <p className="timeline-mobile-period">{localized.period}</p>
                                    <p className="timeline-card-company">{localized.company}</p>
                                    <p className="timeline-card-role">{localized.role}</p>
                                    <p className="timeline-card-meta">{localized.location}</p>
                                </div>
                            </div>

                            <ul className="timeline-card-bullets">
                                {localized.bullets.map((bulletText) => (
                                    <li key={bulletText}>{bulletText}</li>
                                ))}
                            </ul>
                        </div>
                    </li>
                );
            })}
        </ol>
    );
}
