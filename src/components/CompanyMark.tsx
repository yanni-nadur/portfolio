import { getAssetUrl } from "../content";

// -- TYPES
type CompanyMarkProps = {
    companyName: string;
    logo: string | null;
    sizeClassName?: string;
};

// -- FUNCTIONS
function getCompanyInitials(companyName: string): string
{
    if (/^intermeio/i.test(companyName.trim()))
    {
        return "IM";
    }

    const wordArray = companyName
        .replace(/[|·•]/g, " ")
        .split(/\s+/)
        .filter((word) => word.length > 0 && !/^(and|e|de|da|do|dos|das|the|of)$/i.test(word));

    if (wordArray.length === 0)
    {
        return "?";
    }

    if (wordArray.length === 1)
    {
        return wordArray[0].slice(0, 2).toUpperCase();
    }

    return (wordArray[0][0] + wordArray[1][0]).toUpperCase();
}

// -- OPERATIONS
export function CompanyMark({
    companyName,
    logo,
    sizeClassName = "h-10 w-10"
}: CompanyMarkProps)
{
    if (logo)
    {
        return (
            <img
                src={getAssetUrl(logo)}
                alt=""
                className={`mt-0.5 shrink-0 rounded-lg bg-white object-contain p-1 ${sizeClassName}`}
            />
        );
    }

    return (
        <span
            className={`mt-0.5 inline-flex shrink-0 items-center justify-center rounded-lg bg-ink text-[0.65rem] font-bold tracking-wide text-mist dark:bg-white/15 dark:text-mist ${sizeClassName}`}
            aria-hidden="true"
        >
            {getCompanyInitials(companyName)}
        </span>
    );
}
