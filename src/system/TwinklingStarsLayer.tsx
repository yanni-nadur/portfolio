import { useMemo } from "react";

// -- TYPES
type TwinkleStar = {
    xPercent: number;
    yPercent: number;
    sizePx: number;
    alpha: number;
    periodSec: number;
    delaySec: number;
};

type TwinklingStarsLayerProps = {
    starCount: number;
};

// -- FUNCTIONS
function createTwinkleStarArray(starCount: number): TwinkleStar[]
{
    let seed = 20261116;
    const starArray: TwinkleStar[] = [];

    function nextUnit(): number
    {
        seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
        return seed / 4294967296;
    }

    for (let index = 0; index < starCount; index += 1)
    {
        const isBrighter = index % 9 === 0;

        starArray.push({
            xPercent: 2 + nextUnit() * 93,
            yPercent: 1 + nextUnit() * 54,
            sizePx: isBrighter ? 1.6 + nextUnit() * 0.8 : 0.8 + nextUnit() * 1.1,
            alpha: isBrighter ? 0.62 + nextUnit() * 0.28 : 0.28 + nextUnit() * 0.38,
            periodSec: 2.8 + nextUnit() * 4.6,
            delaySec: -nextUnit() * 8
        });
    }

    return starArray;
}

// -- OPERATIONS
export function TwinklingStarsLayer({ starCount }: TwinklingStarsLayerProps)
{
    const starArray = useMemo(() => createTwinkleStarArray(starCount), [starCount]);

    return (
        <div className="os-anime-twinkles" aria-hidden="true">
            {starArray.map((star, index) => (
                <span
                    key={`os-twinkle-${index}`}
                    className="os-anime-twinkle"
                    style={{
                        left: `${star.xPercent}%`,
                        top: `${star.yPercent}%`,
                        width: `${star.sizePx}px`,
                        height: `${star.sizePx}px`,
                        ["--twinkle-alpha" as string]: String(star.alpha),
                        ["--twinkle-period" as string]: `${star.periodSec}s`,
                        ["--twinkle-delay" as string]: `${star.delaySec}s`
                    }}
                />
            ))}
        </div>
    );
}
