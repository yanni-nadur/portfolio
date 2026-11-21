import { useMemo } from "react";

// -- TYPES
type Petal = {
    left: number;
    delay: number;
    duration: number;
    size: number;
    drift: number;
};

type SakuraPetalsLayerProps = {
    isNarrow: boolean;
    isPaused: boolean;
};

// -- CONSTANTS
const DESKTOP_PETAL_COUNT = 48;
const NARROW_PETAL_COUNT = 34;

// -- FUNCTIONS
function createPetalArray(petalCount: number): Petal[]
{
    const petalArray: Petal[] = [];

    for (let index = 0; index < petalCount; index += 1)
    {
        const duration = 7 + Math.random() * 8;

        petalArray.push({
            left: Math.random() * 100,
            delay: Math.random() * duration,
            duration,
            size: 10 + Math.random() * 14,
            drift: -48 + Math.random() * 96
        });
    }

    return petalArray;
}

// -- OPERATIONS
export function SakuraPetalsLayer({ isNarrow, isPaused }: SakuraPetalsLayerProps)
{
    const petalCount = isNarrow ? NARROW_PETAL_COUNT : DESKTOP_PETAL_COUNT;
    const petalArray = useMemo(() => createPetalArray(petalCount), [petalCount]);

    return (
        <div
            className={`os-anime-petals${isPaused ? " is-paused" : ""}`}
            aria-hidden="true"
        >
            {petalArray.map((petal, index) => (
                <span
                    key={`os-petal-${index}`}
                    className="petal os-anime-petal absolute top-[-12%]"
                    style={{
                        left: `${petal.left}%`,
                        width: `${petal.size * 1.35}px`,
                        height: `${petal.size * 0.78}px`,
                        animationDelay: `-${petal.delay}s`,
                        animationDuration: `${petal.duration}s`,
                        ["--petal-drift" as string]: `${petal.drift}px`
                    }}
                />
            ))}
        </div>
    );
}
