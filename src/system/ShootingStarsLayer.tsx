import { useEffect, useState } from "react";

// -- TYPES
type Meteor = {
    id: number;
    leftPercent: number;
    topPercent: number;
    lengthPx: number;
    angleDegree: number;
    durationMs: number;
    travelXPx: number;
    travelYPx: number;
};

type ShootingStarsLayerProps = {
    isNarrow: boolean;
    isPaused: boolean;
};

// -- VARIABLES
let nextMeteorId = 1;

// -- FUNCTIONS
function createMeteor(isNarrow: boolean): Meteor
{
    const distanceXPx = (isNarrow ? 150 : 260) + Math.random() * (isNarrow ? 90 : 180);
    const distanceYPx = (isNarrow ? 48 : 70) + Math.random() * (isNarrow ? 70 : 120);
    const meteorId = nextMeteorId;
    nextMeteorId += 1;

    return {
        id: meteorId,
        leftPercent: (isNarrow ? 58 : 46) + Math.random() * (isNarrow ? 28 : 36),
        topPercent: 2 + Math.random() * (isNarrow ? 16 : 24),
        lengthPx: (isNarrow ? 72 : 108) + Math.random() * (isNarrow ? 46 : 64),
        angleDegree: Math.atan2(-distanceYPx, distanceXPx) * (180 / Math.PI),
        durationMs: 780 + Math.random() * 620,
        travelXPx: -distanceXPx,
        travelYPx: distanceYPx
    };
}

function MeteorMark({ meteor }: { meteor: Meteor })
{
    return (
        <span
            className="os-anime-meteor"
            style={{
                left: `${meteor.leftPercent}%`,
                top: `${meteor.topPercent}%`,
                width: `${meteor.lengthPx}px`,
                ["--meteor-angle" as string]: `${meteor.angleDegree}deg`,
                ["--meteor-duration" as string]: `${meteor.durationMs}ms`,
                ["--meteor-dx" as string]: `${meteor.travelXPx}px`,
                ["--meteor-dy" as string]: `${meteor.travelYPx}px`
            }}
        />
    );
}

// -- OPERATIONS
export function ShootingStarsLayer({ isNarrow, isPaused }: ShootingStarsLayerProps)
{
    const [meteorArray, setMeteorArray] = useState<Meteor[]>([]);

    useEffect(() =>
    {
        if (isPaused)
        {
            setMeteorArray([]);
            return;
        }

        let isCancelled = false;
        let timeoutId = 0;

        function clearTimer()
        {
            window.clearTimeout(timeoutId);
        }

        function arm(delayMs: number)
        {
            clearTimer();
            timeoutId = window.setTimeout(() =>
            {
                if (isCancelled)
                {
                    return;
                }

                if (document.hidden)
                {
                    arm(900);
                    return;
                }

                const nextMeteorArray = [createMeteor(isNarrow)];

                if (Math.random() < 0.22)
                {
                    nextMeteorArray.push(createMeteor(isNarrow));
                }

                setMeteorArray(nextMeteorArray);

                let lifeMs = 0;

                for (let index = 0; index < nextMeteorArray.length; index += 1)
                {
                    if (nextMeteorArray[index].durationMs > lifeMs)
                    {
                        lifeMs = nextMeteorArray[index].durationMs;
                    }
                }

                timeoutId = window.setTimeout(() =>
                {
                    if (isCancelled)
                    {
                        return;
                    }

                    setMeteorArray([]);
                    arm(2200 + Math.random() * 2800);
                }, lifeMs + 60);
            }, delayMs);
        }

        arm(800 + Math.random() * 900);

        return () =>
        {
            isCancelled = true;
            clearTimer();
        };
    }, [isNarrow, isPaused]);

    return (
        <div className="os-anime-meteors" aria-hidden="true">
            {meteorArray.map((meteor) => (
                <MeteorMark key={meteor.id} meteor={meteor} />
            ))}
        </div>
    );
}
