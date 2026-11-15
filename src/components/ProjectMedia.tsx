import { useEffect, useRef, useState } from "react";
import { getAssetUrl } from "../content";
import type { MediaConfig } from "../content/types";
import { useI18n } from "../i18n/I18nProvider";
import { usePrefersReducedMotion } from "../hooks/useMediaQuery";

// -- TYPES
type ProjectMediaProps = {
    title: string;
    accent: string;
    media: MediaConfig;
};

// -- FUNCTIONS
function getMimeType(pathText: string): string
{
    const lowerPath = pathText.toLowerCase();

    if (lowerPath.endsWith(".webm"))
    {
        return "video/webm";
    }

    if (lowerPath.endsWith(".mp4"))
    {
        return "video/mp4";
    }

    if (lowerPath.endsWith(".gif"))
    {
        return "image/gif";
    }

    return "";
}

function hasUsableSources(media: MediaConfig): boolean
{
    return Array.isArray(media.sources) && media.sources.length > 0;
}

// -- OPERATIONS
export function ProjectMedia({ title, accent, media }: ProjectMediaProps)
{
    const { t } = useI18n();
    const prefersReducedMotion = usePrefersReducedMotion();
    const [hasError, setHasError] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() =>
    {
        const videoElement = videoRef.current;

        if (!videoElement || prefersReducedMotion)
        {
            return;
        }

        const observer = new IntersectionObserver(
            (entryArray) =>
            {
                entryArray.forEach((entry) =>
                {
                    if (entry.isIntersecting)
                    {
                        videoElement.play().catch(() => undefined);
                    }
                    else
                    {
                        videoElement.pause();
                    }
                });
            },
            { threshold: 0.4 }
        );

        observer.observe(videoElement);

        return () =>
        {
            observer.disconnect();
        };
    }, [prefersReducedMotion, media.sources]);

    if (!hasUsableSources(media) || hasError)
    {
        return (
            <div
                className="demo-fallback flex min-h-48 flex-col items-start justify-end gap-2 rounded-xl p-5 text-white"
                style={{
                    background: `linear-gradient(145deg, ${accent}, #16141A)`
                }}
                role="img"
                aria-label={t("caseDemoFallback")}
            >
                <strong className="text-lg">{title}</strong>
                <span className="text-sm text-white/80">{t("caseDemoFallback")}</span>
            </div>
        );
    }

    const firstSource = media.sources[0];
    const mimeType = getMimeType(firstSource);

    return (
        <div className="space-y-2">
            {mimeType === "image/gif" ? (
                <img
                    className="demo-media-asset w-full rounded-xl object-cover"
                    src={getAssetUrl(firstSource)}
                    alt={title}
                    loading="lazy"
                    decoding="async"
                    onError={() => setHasError(true)}
                />
            ) : (
                <video
                    ref={videoRef}
                    className="demo-media-asset w-full rounded-xl"
                    playsInline
                    preload="none"
                    muted
                    loop
                    controls
                    poster={media.poster ? getAssetUrl(media.poster) : undefined}
                    aria-label={title}
                    onError={() => setHasError(true)}
                >
                    {media.sources.map((sourcePath) => (
                        <source
                            key={sourcePath}
                            src={getAssetUrl(sourcePath)}
                            type={getMimeType(sourcePath)}
                        />
                    ))}
                </video>
            )}
            {media.illustrative ? (
                <p className="text-sm text-slateSoft dark:text-white/60">
                    {t("caseDemoIllustrative")}
                </p>
            ) : null}
        </div>
    );
}
