import type { ExperienceEntry } from "../../content/types";
import { CompanyMark } from "../../components/CompanyMark";
import { useI18n } from "../../i18n/I18nProvider";

// -- TYPES
type ExperienceCardProps = {
    entry: ExperienceEntry;
    isSelected: boolean;
    cardRef?: (element: HTMLElement | null) => void;
};

// -- OPERATIONS
export function ExperienceCard({
    entry,
    isSelected,
    cardRef
}: ExperienceCardProps)
{
    const { localize } = useI18n();
    const localized = localize(entry);
    const cardId = `experience-card-${entry.id}`;

    return (
        <article
            id={cardId}
            ref={cardRef}
            className={`timeline-card ${isSelected ? "timeline-card-selected" : ""}`}
            data-experience-id={entry.id}
        >
            <div className="timeline-card-header">
                <CompanyMark
                    companyName={localized.company}
                    logo={entry.logo}
                    sizeClassName="h-11 w-11"
                />
                <div className="timeline-card-heading min-w-0 flex-1">
                    <p className="timeline-card-company">{localized.company}</p>
                    <p className="timeline-card-role">{localized.role}</p>
                    <p className="timeline-card-meta">
                        <span>{localized.location}</span>
                        <span aria-hidden="true"> · </span>
                        <span>{localized.period}</span>
                    </p>
                </div>
            </div>

            <ul className="timeline-card-bullets">
                {localized.bullets.map((bulletText) => (
                    <li key={bulletText}>{bulletText}</li>
                ))}
            </ul>
        </article>
    );
}
