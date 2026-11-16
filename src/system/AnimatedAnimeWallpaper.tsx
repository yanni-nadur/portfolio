import { useEffect, useState } from "react";
import { getAssetUrl } from "../content";
import { useMediaQuery, usePrefersReducedMotion } from "../hooks/useMediaQuery";
import { ShootingStarsLayer } from "./ShootingStarsLayer";
import { TwinklingStarsLayer } from "./TwinklingStarsLayer";

// -- TYPES
type AnimatedAnimeWallpaperProps = {
    playIntro?: boolean;
};

// -- CONSTANTS
const SKY_PATH = "images/os-wallpaper/sky-clean.webp";
const CHARACTER_PATH = "images/os-wallpaper/character-full.webp";
const FALLBACK_PATH = "images/os-wallpaper/wallpaper-fallback.webp";

// -- OPERATIONS
export function AnimatedAnimeWallpaper({ playIntro = false }: AnimatedAnimeWallpaperProps)
{
    const isNarrowViewport = useMediaQuery("(max-width: 700px)");
    const prefersReducedMotion = usePrefersReducedMotion();
    const [hasLoadError, setHasLoadError] = useState(false);
    const [isPageHidden, setIsPageHidden] = useState(false);
    const showSkyMotion = !prefersReducedMotion;
    const effectClassName = isPageHidden
        ? "os-anime-effects is-paused"
        : "os-anime-effects";
    const objectPosition = isNarrowViewport ? "77% center" : "68% center";
    const cameraClassName = playIntro
        ? "os-anime-camera os-anime-camera-intro"
        : "os-anime-camera";
    const characterIdleClassName = showSkyMotion
        ? `os-anime-character-idle os-anime-character-breathe${isPageHidden ? " is-paused" : ""}`
        : "os-anime-character-idle";

    useEffect(() =>
    {
        function handleVisibilityChange()
        {
            setIsPageHidden(document.hidden);
        }

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () =>
        {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);

    function handleLayerError()
    {
        setHasLoadError(true);
    }

    if (hasLoadError)
    {
        return (
            <div className="os-anime-wallpaper" aria-hidden="true">
                <div className={cameraClassName}>
                    <img
                        className="os-anime-layer"
                        src={getAssetUrl(FALLBACK_PATH)}
                        alt=""
                        draggable={false}
                        style={{ objectPosition }}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="os-anime-wallpaper" aria-hidden="true">
            <div className={cameraClassName}>
                <img
                    className="os-anime-layer os-anime-sky"
                    src={getAssetUrl(SKY_PATH)}
                    alt=""
                    width={1672}
                    height={941}
                    draggable={false}
                    style={{ objectPosition }}
                    onError={handleLayerError}
                />
                {showSkyMotion ? (
                    <div className={effectClassName}>
                        <TwinklingStarsLayer starCount={isNarrowViewport ? 18 : 32} />
                        <ShootingStarsLayer
                            isNarrow={isNarrowViewport}
                            isPaused={isPageHidden}
                        />
                    </div>
                ) : null}
                <div className={characterIdleClassName}>
                    <img
                        className="os-anime-layer os-anime-character"
                        src={getAssetUrl(CHARACTER_PATH)}
                        alt=""
                        width={1672}
                        height={941}
                        draggable={false}
                        style={{ objectPosition }}
                        onError={handleLayerError}
                    />
                </div>
            </div>
        </div>
    );
}
