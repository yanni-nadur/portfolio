import { useEffect, useState } from "react";
import { getAssetUrl } from "../content";

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

// -- CONSTANTS
const METEOR_SPRITE_PATH = "images/os-wallpaper/meteor-trail.svg";
const METEOR_SPRITE_ANGLE_DEGREE = 25.6;

// -- VARIABLES
let nextMeteorId = 1;

// -- FUNCTIONS
function createMeteor(isNarrow: boolean): Meteor
{
    // Down-left fall (~42-55°).
    const distanceXPx = (isNarrow ? 120 : 195) + Math.random() * (isNarrow ? 75 : 130);
    const distanceYPx = (isNarrow ? 135 : 225) + Math.random() * (isNarrow ? 100 : 150);
    const travelXPx = -distanceXPx;
    const travelYPx = distanceYPx;
    const travelAngleDegree = Math.atan2(travelYPx, travelXPx) * (180 / Math.PI);
    const spriteHeadAngleDegree = 180 - METEOR_SPRITE_ANGLE_DEGREE;
    const meteorId = nextMeteorId;
    nextMeteorId += 1;

    return {
        id: meteorId,
        leftPercent: isNarrow
            ? 28 + Math.random() * 48
            : Math.random() * 70,
        topPercent: 1 + Math.random() * (isNarrow ? 24 : 32),
        lengthPx: (isNarrow ? 150 : 230) + Math.random() * (isNarrow ? 50 : 70),
        angleDegree: travelAngleDegree - spriteHeadAngleDegree,
        durationMs: 880 + Math.random() * 670,
        travelXPx,
        travelYPx
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
                backgroundImage: `url(${getAssetUrl(METEOR_SPRITE_PATH)})`,
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
                    arm(700);
                    return;
                }

                const nextMeteorArray = [createMeteor(isNarrow)];

                if (Math.random() < 0.38)
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
                    arm(900 + Math.random() * 1400);
                }, lifeMs + 60);
            }, delayMs);
        }

        arm(350 + Math.random() * 650);

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
