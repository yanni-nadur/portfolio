import { experienceArray } from "../../content";
import { CompanyMark } from "../../components/CompanyMark";
import { GanttTimeline } from "../../components/GanttTimeline";
import { useI18n } from "../../i18n/I18nProvider";

// -- OPERATIONS
export default function CalendarApp()
{
    const { t, localize } = useI18n();
    const careerArray = experienceArray.filter((entry) => entry.track === "career");
    const educationArray = experienceArray.filter((entry) => entry.track === "education");

    return (
        <div className="space-y-8 p-5">
            <section className="space-y-4">
                <h3 className="font-display text-xl font-semibold">{t("calendarCareer")}</h3>
                <GanttTimeline track="career" />
            </section>

            {educationArray.length > 0 ? (
                <section className="space-y-4">
                    <h3 className="font-display text-xl font-semibold">{t("calendarEducation")}</h3>
                    <GanttTimeline track="education" />
                    <ol className="space-y-4">
                        {educationArray.map((entry) =>
                        {
                            const localized = localize(entry);

                            return (
                                <li
                                    key={entry.id}
                                    className="rounded-2xl border border-line/80 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5"
                                >
                                    <ExperienceHeader
                                        company={localized.company}
                                        role={localized.role}
                                        period={localized.period}
                                        location={localized.location}
                                        logo={entry.logo}
                                    />
                                    <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slateSoft dark:text-white/70">
                                        {localized.bullets.map((bulletText) => (
                                            <li key={bulletText}>{bulletText}</li>
                                        ))}
                                    </ul>
                                </li>
                            );
                        })}
                    </ol>
                </section>
            ) : null}

            <section className="space-y-4">
                <ol className="space-y-4">
                    {careerArray.map((entry) =>
                    {
                        const localized = localize(entry);

                        return (
                            <li
                                key={entry.id}
                                className="rounded-2xl border border-line/80 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5"
                            >
                                <ExperienceHeader
                                    company={localized.company}
                                    role={localized.role}
                                    period={localized.period}
                                    location={localized.location}
                                    logo={entry.logo}
                                />
                                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slateSoft dark:text-white/70">
                                    {localized.bullets.map((bulletText) => (
                                        <li key={bulletText}>{bulletText}</li>
                                    ))}
                                </ul>
                                {entry.concurrentGroup === "sister" ? (
                                    <p className="mt-3 text-xs text-accent">
                                        {t("calendarConcurrentNote")}
                                    </p>
                                ) : null}
                            </li>
                        );
                    })}
                </ol>
            </section>
        </div>
    );
}

// ~~
function ExperienceHeader({
    company,
    role,
    period,
    location,
    logo
}: {
    company: string;
    role: string;
    period: string;
    location: string;
    logo: string | null;
})
{
    return (
        <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
                <CompanyMark companyName={company} logo={logo} sizeClassName="h-10 w-10" />
                <div>
                    <p className="font-semibold">{company}</p>
                    <p className="text-sm text-accent">{role}</p>
                </div>
            </div>
            <div className="text-right text-xs text-slateSoft dark:text-white/55">
                <p>{period}</p>
                <p>{location}</p>
            </div>
        </div>
    );
}
