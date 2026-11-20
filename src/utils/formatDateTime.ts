// -- FUNCTIONS
function cleanWeekdayText(weekdayText: string): string
{
    const cleanedText = weekdayText.replace(/\./g, "").trim();

    if (!cleanedText)
    {
        return weekdayText;
    }

    return cleanedText.charAt(0).toUpperCase() + cleanedText.slice(1);
}

export function formatClockWithWeekday(dateValue: Date, localeText: string): string
{
    const weekdayText = cleanWeekdayText(
        new Intl.DateTimeFormat(localeText, {
            weekday: "short"
        }).format(dateValue)
    );
    const timeText = new Intl.DateTimeFormat(localeText, {
        hour: "2-digit",
        minute: "2-digit"
    }).format(dateValue);

    return `${weekdayText} ${timeText}`;
}

export function formatLandingDate(dateValue: Date, localeText: string): string
{
    const weekdayText = cleanWeekdayText(
        new Intl.DateTimeFormat(localeText, {
            weekday: "short"
        }).format(dateValue)
    );
    const dayMonthText = new Intl.DateTimeFormat(localeText, {
        day: "numeric",
        month: "short"
    }).format(dateValue).replace(/\./g, "");

    return `${weekdayText}, ${dayMonthText}`;
}

export function formatClockTime(dateValue: Date, localeText: string): string
{
    return new Intl.DateTimeFormat(localeText, {
        hour: "2-digit",
        minute: "2-digit"
    }).format(dateValue);
}
