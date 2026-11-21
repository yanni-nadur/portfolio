import { skillGroupArray } from "../content";
import type { SkillGroup } from "../content/types";
import { skillIconByNameMap } from "../content/skillIcons";
import { usePrefersReducedMotion } from "../hooks/useMediaQuery";
import { useI18n } from "../i18n/I18nProvider";

// -- TYPES
type SkillChip = {
    chipKey: string;
    label: string;
    iconName: string;
};

type SkillRow = {
    id: string;
    title: string;
    chipArray: SkillChip[];
};

// -- CONSTANTS
const extraSkillNameSet = new Set([
    "REST",
    "AWS",
    "SQL Server",
    "OpenAI",
    "Codex",
    "SOLID",
    "Clean Architecture",
    "SNS",
    "SQS",
    "LLMs",
    "CloudWatch",
    "Portuguese",
    "English",
    "RLS"
]);

// -- FUNCTIONS
function splitSkillLabel(labelText: string): string[]
{
    return labelText
        .split(" / ")
        .map((partText) => partText.trim())
        .filter((partText) => partText.length > 0);
}

function getIconName(labelText: string): string
{
    return labelText.replace(/\s*\([^)]*\)\s*$/u, "").trim();
}

function hasKnownSkill(labelText: string): boolean
{
    const iconName = getIconName(labelText);

    return Boolean(skillIconByNameMap[iconName]) || extraSkillNameSet.has(iconName);
}

function shouldSplitSkill(labelText: string): boolean
{
    const partArray = splitSkillLabel(labelText);

    if (partArray.length < 2)
    {
        return false;
    }

    return partArray.every((partText) => hasKnownSkill(partText));
}

function resolveIconName(labelText: string): string
{
    const directName = getIconName(labelText);

    if (skillIconByNameMap[directName])
    {
        return directName;
    }

    const firstPartName = getIconName(splitSkillLabel(labelText)[0] ?? labelText);

    if (skillIconByNameMap[firstPartName])
    {
        return firstPartName;
    }

    return directName;
}

function getChipArray(group: SkillGroup, localize: (value: SkillGroup) => { items: string[] }): SkillChip[]
{
    const localizedItemArray = localize(group).items;
    const chipArray: SkillChip[] = [];

    group.en.items.forEach((englishItem, itemIndex) =>
    {
        const localizedItem = localizedItemArray[itemIndex] ?? englishItem;
        const canSplit = shouldSplitSkill(englishItem);
        const englishPartArray = canSplit ? splitSkillLabel(englishItem) : [englishItem];
        const localizedPartArray = canSplit ? splitSkillLabel(localizedItem) : [localizedItem];

        englishPartArray.forEach((englishPart, partIndex) =>
        {
            const iconName = resolveIconName(englishPart);

            chipArray.push({
                chipKey: `${group.id}-${itemIndex}-${partIndex}-${iconName}`,
                label: localizedPartArray[partIndex] ?? englishPart,
                iconName
            });
        });
    });

    return chipArray;
}

function SkillMark({ iconName }: { iconName: string })
{
    const icon = skillIconByNameMap[iconName];

    if (!icon)
    {
        return (
            <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0 text-accent" aria-hidden="true">
                <path
                    fill="currentColor"
                    d="M4 6.5 8.2 12 4 17.5h2.3L10.5 12 6.3 6.5H4Zm7.2 0L15.4 12l-4.2 5.5h2.3L17.7 12 13.5 6.5h-2.3Z"
                />
            </svg>
        );
    }

    const isMonochrome = icon.hex === "000000" || icon.hex === "FFFFFF";

    return (
        <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" aria-hidden="true">
            <path
                fill={isMonochrome ? "currentColor" : `#${icon.hex}`}
                d={icon.path}
            />
        </svg>
    );
}

function SkillChipItem({ chip }: { chip: SkillChip })
{
    return (
        <li className="flex shrink-0 items-center gap-2 rounded-full border border-line/80 bg-white/90 px-3 py-1.5 text-sm text-ink dark:border-white/10 dark:bg-[#121C2B] dark:text-mist">
            <SkillMark iconName={chip.iconName} />
            <span className="whitespace-nowrap">{chip.label}</span>
        </li>
    );
}

// -- OPERATIONS
export function SkillCarousel()
{
    const { t, localize } = useI18n();
    const prefersReducedMotion = usePrefersReducedMotion();
    const frontendGroup = skillGroupArray.find((group) => group.id === "frontend");
    const backendGroup = skillGroupArray.find((group) => group.id === "backend");
    const extraGroupArray = skillGroupArray.filter((group) =>
    {
        return group.id !== "frontend" && group.id !== "backend";
    });
    const rowArray: SkillRow[] = [];

    if (frontendGroup)
    {
        rowArray.push({
            id: frontendGroup.id,
            title: localize(frontendGroup).title,
            chipArray: getChipArray(frontendGroup, localize)
        });
    }

    if (backendGroup)
    {
        rowArray.push({
            id: backendGroup.id,
            title: localize(backendGroup).title,
            chipArray: getChipArray(backendGroup, localize)
        });
    }

    const extraChipArray = extraGroupArray.flatMap((group) => getChipArray(group, localize));

    if (extraChipArray.length > 0)
    {
        rowArray.push({
            id: "additional",
            title: t("simpleSkillsAdditional"),
            chipArray: extraChipArray
        });
    }

    return (
        <div className="space-y-6">
            {rowArray.map((row, rowIndex) =>
            {
                const durationSecondCount = Math.max(36, row.chipArray.length * 3.4);

                return (
                    <div key={row.id} className="space-y-2">
                        <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-slateSoft dark:text-white/55">
                            {row.title}
                        </h3>
                        {prefersReducedMotion ? (
                            <ul className="flex flex-wrap gap-2">
                                {row.chipArray.map((chip) => (
                                    <SkillChipItem key={chip.chipKey} chip={chip} />
                                ))}
                            </ul>
                        ) : (
                            <div className="skill-marquee-mask overflow-hidden">
                                <div
                                    className={`skill-marquee ${rowIndex % 2 === 1 ? "skill-marquee-reverse" : ""}`}
                                    style={{ animationDuration: `${durationSecondCount}s` }}
                                >
                                    <ul className="flex gap-2 pr-2">
                                        {row.chipArray.map((chip) => (
                                            <SkillChipItem key={chip.chipKey} chip={chip} />
                                        ))}
                                    </ul>
                                    <ul className="flex gap-2 pr-2" aria-hidden="true">
                                        {row.chipArray.map((chip) => (
                                            <SkillChipItem key={`${chip.chipKey}-copy`} chip={chip} />
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
