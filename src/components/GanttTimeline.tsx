import { experienceArray } from "../content";
import type { ExperienceEntry } from "../content/types";
import { useI18n } from "../i18n/I18nProvider";

// -- TYPES
type GanttTimelineProps = {
    track: "career" | "education";
};

// -- FUNCTIONS
function parseDate(dateText: string | null): Date
{
    if (!dateText)
    {
        return new Date();
    }

    return new Date(dateText);
}

function getTimelineBounds(entryArray: ExperienceEntry[])
{
    let minTime = Number.POSITIVE_INFINITY;
    let maxTime = Number.NEGATIVE_INFINITY;

    entryArray.forEach((entry) =>
    {
        const startTime = parseDate(entry.startDate).getTime();
        const endTime = parseDate(entry.endDate).getTime();
        minTime = Math.min(minTime, startTime);
        maxTime = Math.max(maxTime, endTime);
    });

    if (!Number.isFinite(minTime) || !Number.isFinite(maxTime))
    {
        const now = new Date();
        return {
            minTime: now.getTime(),
            maxTime: now.getTime() + 1
        };
    }

    return { minTime, maxTime: Math.max(maxTime, minTime + 1) };
}

function getYearLabelArray(minTime: number, maxTime: number): number[]
{
    const startYear = new Date(minTime).getFullYear();
    const endYear = new Date(maxTime).getFullYear();
    const yearArray: number[] = [];

    for (let year = startYear; year <= endYear; year += 1)
    {
        yearArray.push(year);
    }

    return yearArray;
}

// -- OPERATIONS
export function GanttTimeline({ track }: GanttTimelineProps)
{
    const { t, localize } = useI18n();
    const entryArray = experienceArray.filter((entry) => entry.track === track);

    if (entryArray.length === 0)
    {
        return null;
    }

    const { minTime, maxTime } = getTimelineBounds(entryArray);
    const span = maxTime - minTime;
    const yearLabelArray = getYearLabelArray(minTime, maxTime);

    return (
        <div className="space-y-4">
            <div className="relative flex justify-between text-xs text-slateSoft dark:text-white/50">
                {yearLabelArray.map((year) => (
                    <span key={year}>{year}</span>
                ))}
            </div>
            <div className="space-y-3">
                {entryArray.map((entry) =>
                {
                    const localized = localize(entry);
                    const startTime = parseDate(entry.startDate).getTime();
                    const endTime = parseDate(entry.endDate).getTime();
                    const leftPercent = ((startTime - minTime) / span) * 100;
                    const widthPercent = Math.max(4, ((endTime - startTime) / span) * 100);
                    const isSister = entry.concurrentGroup === "sister";

                    return (
                        <div key={entry.id} className="space-y-1">
                            <div className="flex items-baseline justify-between gap-3 text-sm">
                                <p className="font-semibold">{localized.company}</p>
                                <p className="text-xs text-slateSoft dark:text-white/50">
                                    {localized.period}
                                </p>
                            </div>
                            <div className="relative h-8 rounded-lg bg-line/70 dark:bg-white/10">
                                <div
                                    className={`absolute top-1 bottom-1 rounded-md ${
                                        isSister ? "bg-accent" : "bg-sky"
                                    }`}
                                    style={{
                                        left: `${leftPercent}%`,
                                        width: `${widthPercent}%`
                                    }}
                                    title={localized.role}
                                />
                            </div>
                            {isSister ? (
                                <p className="text-xs text-accent">{t("calendarConcurrentNote")}</p>
                            ) : null}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
