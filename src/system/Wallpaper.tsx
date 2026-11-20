import { useEffect, useMemo, useRef } from "react";
import { animated, useSpring } from "@react-spring/web";
import { useIsFinePointer, usePrefersReducedMotion } from "../hooks/useMediaQuery";
import { useSettings } from "../store/settingsStore";
import { AnimatedAnimeWallpaper } from "./AnimatedAnimeWallpaper";

// -- TYPES
type WallpaperProps = {
    className?: string;
    variant?: "classic" | "os";
    playOsIntro?: boolean;
};

type Star = {
    x: number;
    y: number;
    size: number;
    opacity: number;
    shift: number;
    glideDuration: number;
    twinkleDuration: number;
    twinkleDelay: number;
};

type Petal = {
    left: number;
    delay: number;
    duration: number;
    size: number;
    drift: number;
};

// -- CONSTANTS
const STAR_COUNT = 90;
const PETAL_COUNT = 26;

// -- FUNCTIONS
function createStarArray(): Star[]
{
    const starArray: Star[] = [];

    for (let index = 0; index < STAR_COUNT; index += 1)
    {
        starArray.push({
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: index % 8 === 0 ? 2.4 + Math.random() * 1.6 : 1.2 + Math.random() * 1.3,
            opacity: 0.55 + Math.random() * 0.45,
            shift: -22 + Math.random() * 44,
            glideDuration: 10 + Math.random() * 14,
            twinkleDuration: 1.8 + Math.random() * 3.2,
            twinkleDelay: Math.random() * 4
        });
    }

    return starArray;
}

function createPetalArray(): Petal[]
{
    const petalArray: Petal[] = [];

    for (let index = 0; index < PETAL_COUNT; index += 1)
    {
        const duration = 8 + Math.random() * 9;

        petalArray.push({
            left: Math.random() * 100,
            delay: Math.random() * duration,
            duration,
            size: 10 + Math.random() * 12,
            drift: -40 + Math.random() * 80
        });
    }

    return petalArray;
}

function StarMark({
    star,
    index,
    topOffset
}: {
    star: Star;
    index: number;
    topOffset: number;
})
{
    const isBright = index % 8 === 0;

    return (
        <span
            className={`star absolute rounded-full bg-white ${isBright ? "shadow-[0_0_8px_2px_rgba(255,255,255,0.85)]" : ""}`}
            style={{
                left: `${star.x}%`,
                top: `${topOffset + star.y * 0.5}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                ["--star-opacity" as string]: String(star.opacity),
                ["--star-shift" as string]: `${star.shift}px`,
                ["--star-glide" as string]: `${star.glideDuration}s`,
                ["--star-twinkle" as string]: `${star.twinkleDuration}s`,
                ["--star-twinkle-delay" as string]: `${star.twinkleDelay}s`
            }}
        />
    );
}

// -- OPERATIONS
export function Wallpaper({
    className = "absolute inset-0",
    variant = "classic",
    playOsIntro = false
}: WallpaperProps)
{
    const { parallaxEnabled, theme } = useSettings();
    const prefersReducedMotion = usePrefersReducedMotion();
    const isFinePointer = useIsFinePointer();
    const starArray = useMemo(() => createStarArray(), []);
    const petalArray = useMemo(() => createPetalArray(), []);
    const rootRef = useRef<HTMLDivElement>(null);
    const canParallax = variant !== "os"
        && parallaxEnabled
        && isFinePointer
        && !prefersReducedMotion;
    const isDarkTheme = theme === "dark";
    const isOsVariant = variant === "os";
    const introPlayedRef = useRef(false);
    const keepIntroClassRef = useRef(false);

    if (isOsVariant && playOsIntro && !introPlayedRef.current)
    {
        keepIntroClassRef.current = true;
        introPlayedRef.current = true;
    }

    const fadeClassName = prefersReducedMotion
        ? ""
        : "transition-opacity duration-[560ms] ease-[cubic-bezier(0.22,1,0.36,1)]";

    const [springStyle, api] = useSpring(() => ({
        x: 0,
        y: 0,
        config: { mass: 1, tension: 120, friction: 30 },
        immediate: prefersReducedMotion
    }));

    useEffect(() =>
    {
        if (!canParallax)
        {
            api.start({ x: 0, y: 0, immediate: true });
            return;
        }

        function handlePointerMove(event: PointerEvent)
        {
            if (!rootRef.current)
            {
                return;
            }

            const bounds = rootRef.current.getBoundingClientRect();
            const normalizedX = (event.clientX / bounds.width - 0.5) * 28;
            const normalizedY = (event.clientY / bounds.height - 0.5) * 18;
            api.start({ x: normalizedX, y: normalizedY, immediate: false });
        }

        window.addEventListener("pointermove", handlePointerMove, { passive: true });

        return () =>
        {
            window.removeEventListener("pointermove", handlePointerMove);
        };
    }, [api, canParallax]);

    return (
        <div
            ref={rootRef}
            className={`pointer-events-none overflow-hidden ${className}`}
            aria-hidden="true"
        >
            <div className="absolute inset-0 night-sky" />
            {!isOsVariant ? (
                <>
                    <div className={`absolute inset-0 sakura-sky ${fadeClassName} ${isDarkTheme ? "opacity-0" : "opacity-100"}`} />
                    <div className={`absolute inset-0 night-glow ${fadeClassName} ${isDarkTheme ? "opacity-100" : "opacity-0"}`} />
                    <div className={`absolute inset-0 sakura-glow ${fadeClassName} ${isDarkTheme ? "opacity-0" : "opacity-100"}`} />
                </>
            ) : null}

            <animated.div
                className="absolute inset-[-5%]"
                style={{
                    x: springStyle.x,
                    y: springStyle.y
                }}
            >
                {isOsVariant ? (
                    <div className="absolute inset-0">
                        <AnimatedAnimeWallpaper playIntro={keepIntroClassRef.current} />
                    </div>
                ) : (
                    <>
                        <div className={`star-field absolute left-0 top-0 h-[200%] w-full ${fadeClassName} ${isDarkTheme ? "opacity-100" : "opacity-0"}`}>
                            {starArray.map((star, index) => (
                                <StarMark
                                    key={`star-a-${index}`}
                                    star={star}
                                    index={index}
                                    topOffset={0}
                                />
                            ))}
                            {starArray.map((star, index) => (
                                <StarMark
                                    key={`star-b-${index}`}
                                    star={star}
                                    index={index}
                                    topOffset={50}
                                />
                            ))}
                        </div>
                        <div className={`absolute inset-0 ${fadeClassName} ${isDarkTheme ? "opacity-0" : "opacity-100"}`}>
                            {petalArray.map((petal, index) => (
                                <span
                                    key={`petal-${index}`}
                                    className="petal absolute top-[-12%] rounded-[60%_40%_60%_40%] bg-sakura"
                                    style={{
                                        left: `${petal.left}%`,
                                        width: `${petal.size}px`,
                                        height: `${petal.size * 0.7}px`,
                                        animationDelay: `-${petal.delay}s`,
                                        animationDuration: `${petal.duration}s`,
                                        ["--petal-drift" as string]: `${petal.drift}px`
                                    }}
                                />
                            ))}
                        </div>
                    </>
                )}
            </animated.div>

            {!isOsVariant ? (
                <>
                    <div className={`absolute inset-0 night-vignette ${fadeClassName} ${isDarkTheme ? "opacity-100" : "opacity-0"}`} />
                    <div className={`absolute inset-0 sakura-vignette ${fadeClassName} ${isDarkTheme ? "opacity-0" : "opacity-100"}`} />
                </>
            ) : null}
        </div>
    );
}
