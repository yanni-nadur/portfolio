import type { ExperienceEntry } from "../../content/types";

// -- TYPES
export type MonthBounds = {
    minMonthIndex: number;
    maxMonthIndex: number;
    spanMonthCount: number;
};

export type BarLayout = {
    leftPercent: number;
    widthPercent: number;
    isOngoing: boolean;
};

export type YearMarker = {
    year: number;
    leftPercent: number;
};

// -- FUNCTIONS
export function parseExperienceDate(dateText: string | null, referenceDate: Date = new Date()): Date
{
    if (!dateText)
    {
        return new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1);
    }

    const partArray = dateText.split("-").map((part) => Number(part));
    const year = partArray[0] || referenceDate.getFullYear();
    const month = (partArray[1] || 1) - 1;
    const day = partArray[2] || 1;

    return new Date(year, month, day);
}

export function toMonthIndex(date: Date): number
{
    return date.getFullYear() * 12 + date.getMonth();
}

export function getCareerMonthBounds(
    entryArray: ExperienceEntry[],
    referenceDate: Date = new Date()
): MonthBounds
{
    if (entryArray.length === 0)
    {
        const monthIndex = toMonthIndex(referenceDate);

        return {
            minMonthIndex: monthIndex,
            maxMonthIndex: monthIndex,
            spanMonthCount: 1
        };
    }

    let minMonthIndex = Number.POSITIVE_INFINITY;
    let maxMonthIndex = Number.NEGATIVE_INFINITY;
    const referenceMonthIndex = toMonthIndex(referenceDate);

    entryArray.forEach((entry) =>
    {
        const startMonthIndex = toMonthIndex(parseExperienceDate(entry.startDate, referenceDate));
        const endMonthIndex = entry.endDate
            ? toMonthIndex(parseExperienceDate(entry.endDate, referenceDate))
            : referenceMonthIndex;

        minMonthIndex = Math.min(minMonthIndex, startMonthIndex);
        maxMonthIndex = Math.max(maxMonthIndex, endMonthIndex);
    });

    maxMonthIndex = Math.max(maxMonthIndex, referenceMonthIndex);
    const spanMonthCount = Math.max(1, maxMonthIndex - minMonthIndex + 1);

    return {
        minMonthIndex,
        maxMonthIndex,
        spanMonthCount
    };
}

export function getBarLayout(
    entry: ExperienceEntry,
    bounds: MonthBounds,
    referenceDate: Date = new Date()
): BarLayout
{
    const startMonthIndex = toMonthIndex(parseExperienceDate(entry.startDate, referenceDate));
    const endMonthIndex = entry.endDate
        ? toMonthIndex(parseExperienceDate(entry.endDate, referenceDate))
        : toMonthIndex(referenceDate);
    const durationMonthCount = Math.max(1, endMonthIndex - startMonthIndex + 1);
    const leftPercent = ((startMonthIndex - bounds.minMonthIndex) / bounds.spanMonthCount) * 100;
    const widthPercent = Math.max(
        (durationMonthCount / bounds.spanMonthCount) * 100,
        1.75
    );

    return {
        leftPercent,
        widthPercent,
        isOngoing: entry.endDate === null
    };
}

export function getYearMarkerArray(bounds: MonthBounds): YearMarker[]
{
    const startYear = Math.floor(bounds.minMonthIndex / 12);
    const endYear = Math.floor(bounds.maxMonthIndex / 12);
    const yearCount = Math.max(1, endYear - startYear + 1);
    const markerArray: YearMarker[] = [];

    for (let yearIndex = 0; yearIndex < yearCount; yearIndex += 1)
    {
        const year = startYear + yearIndex;
        const leftPercent = yearCount === 1
            ? 0
            : (yearIndex / (yearCount - 1)) * 100;

        markerArray.push({
            year,
            leftPercent
        });
    }

    return markerArray;
}

export function compareExperienceNewestFirst(
    leftEntry: ExperienceEntry,
    rightEntry: ExperienceEntry
): number
{
    const leftStart = toMonthIndex(parseExperienceDate(leftEntry.startDate));
    const rightStart = toMonthIndex(parseExperienceDate(rightEntry.startDate));

    if (rightStart !== leftStart)
    {
        return rightStart - leftStart;
    }

    const leftEnd = leftEntry.endDate
        ? toMonthIndex(parseExperienceDate(leftEntry.endDate))
        : Number.POSITIVE_INFINITY;
    const rightEnd = rightEntry.endDate
        ? toMonthIndex(parseExperienceDate(rightEntry.endDate))
        : Number.POSITIVE_INFINITY;

    return rightEnd - leftEnd;
}

export function scrollChildIntoContainer(
    container: HTMLElement,
    child: HTMLElement,
    options: { behavior?: ScrollBehavior; topOffset?: number } = {}
): void
{
    const topOffset = options.topOffset ?? 12;
    const containerRect = container.getBoundingClientRect();
    const childRect = child.getBoundingClientRect();
    const nextTop = container.scrollTop + (childRect.top - containerRect.top) - topOffset;

    container.scrollTo({
        top: Math.max(0, nextTop),
        behavior: options.behavior ?? "smooth"
    });
}
