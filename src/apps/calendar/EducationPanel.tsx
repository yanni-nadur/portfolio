import type { ExperienceEntry } from "../../content/types";
import { CompanyMark } from "../../components/CompanyMark";
import { useI18n } from "../../i18n/I18nProvider";

// -- TYPES
type EducationPanelProps = {
    educationArray: ExperienceEntry[];
};

// -- OPERATIONS
export function EducationPanel({ educationArray }: EducationPanelProps)
{
    const { t, localize } = useI18n();

    if (educationArray.length === 0)
    {
        return null;
    }

    return (
        <section
            className="timeline-education"
            role="tabpanel"
            id="timeline-panel-education"
            aria-labelledby="timeline-tab-education"
            aria-label={t("calendarEducation")}
        >
            {educationArray.map((entry) =>
            {
                const localized = localize(entry);

                return (
                    <article key={entry.id} className="timeline-education-card">
                        <div className="flex items-start gap-3">
                            <CompanyMark
                                companyName={localized.company}
                                logo={entry.logo}
                                sizeClassName="h-12 w-12"
                            />
                            <div className="min-w-0">
                                <p className="timeline-card-company">{localized.company}</p>
                                <p className="timeline-card-role">{localized.role}</p>
                                <p className="timeline-card-meta">
                                    <span>{localized.period}</span>
                                    <span aria-hidden="true"> · </span>
                                    <span>{localized.location}</span>
                                </p>
                            </div>
                        </div>
                        <ul className="timeline-card-bullets mt-4">
                            {localized.bullets.map((bulletText) => (
                                <li key={bulletText}>{bulletText}</li>
                            ))}
                        </ul>
                    </article>
                );
            })}
        </section>
    );
}
