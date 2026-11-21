import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { skillGroupArray } from "../../content";
import { skillIconByNameMap } from "../../content/skillIcons";
import type { SkillGroup, SkillTrack } from "../../content/types";
import { useI18n } from "../../i18n/I18nProvider";
import { useSettings } from "../../store/settingsStore";
import { useView } from "../../store/viewStore";
import { useWindows } from "../../system/windowStore";
import {
    disposeSkillwaveAudioEngine,
    findSkillwaveAlbumTrack,
    getSkillwaveAlbumTrackIdArray,
    getSkillwaveAudioEngine,
    skillwaveAlbumCredits,
    type SkillwavePlaybackSnapshot
} from "./audio";

// -- TYPES
type TrackView = {
    key: string;
    albumId: string;
    albumTitle: string;
    albumDescription: string;
    iconId: string;
    familiarity: SkillTrack["familiarity"];
    title: string;
    musicalSubtitle: string | null;
    songTitle: string | null;
    artistName: string | null;
    sourceAlbum: string | null;
    description: string | null;
    durationSecondCount: number;
    isPlayable: boolean;
};

// -- FUNCTIONS
function progressStyle(percent: number): CSSProperties
{
    return {
        "--sw-progress": `${percent}%`
    } as CSSProperties;
}

function formatClock(secondCount: number): string
{
    const safeSecondCount = Math.max(0, Math.floor(secondCount));
    const minuteCount = Math.floor(safeSecondCount / 60);
    const remainSecondCount = safeSecondCount % 60;
    return `${minuteCount}:${String(remainSecondCount).padStart(2, "0")}`;
}

function CategoryIcon({ iconId }: { iconId: string })
{
    const commonProps = {
        viewBox: "0 0 24 24",
        className: "h-4 w-4 shrink-0",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.8,
        strokeLinecap: "round" as const,
        strokeLinejoin: "round" as const,
        "aria-hidden": true as const
    };

    if (iconId === "server")
    {
        return (
            <svg {...commonProps}>
                <rect x="3" y="4" width="18" height="6" rx="1.5" />
                <rect x="3" y="14" width="18" height="6" rx="1.5" />
                <path d="M7 7h.01M7 17h.01" />
            </svg>
        );
    }

    if (iconId === "spark")
    {
        return (
            <svg {...commonProps}>
                <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
                <circle cx="12" cy="12" r="2.5" />
            </svg>
        );
    }

    if (iconId === "database")
    {
        return (
            <svg {...commonProps}>
                <ellipse cx="12" cy="6" rx="7" ry="3" />
                <path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6" />
                <path d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
            </svg>
        );
    }

    if (iconId === "payment")
    {
        return (
            <svg {...commonProps}>
                <rect x="3" y="6" width="18" height="12" rx="2" />
                <path d="M3 10h18" />
                <path d="M7 15h3" />
            </svg>
        );
    }

    if (iconId === "layers")
    {
        return (
            <svg {...commonProps}>
                <path d="M12 3 3 8l9 5 9-5-9-5Z" />
                <path d="M3 12l9 5 9-5" />
                <path d="M3 16l9 5 9-5" />
            </svg>
        );
    }

    if (iconId === "cloud")
    {
        return (
            <svg {...commonProps}>
                <path d="M7 18h10a4 4 0 0 0 .4-8 5.5 5.5 0 0 0-10.5 1.6A3.5 3.5 0 0 0 7 18Z" />
            </svg>
        );
    }

    if (iconId === "quality")
    {
        return (
            <svg {...commonProps}>
                <path d="M9 12l2 2 4-4" />
                <path d="M12 3 4.5 6v5.5c0 4.4 3.1 7.8 7.5 8.5 4.4-.7 7.5-4.1 7.5-8.5V6L12 3Z" />
            </svg>
        );
    }

    return (
        <svg {...commonProps}>
            <rect x="3" y="4" width="18" height="14" rx="2" />
            <path d="M3 9h18" />
            <path d="M8 14h4" />
        </svg>
    );
}

function TrackIcon({ iconId, size = "sm" }: { iconId: string; size?: "sm" | "md" })
{
    const icon = skillIconByNameMap[iconId];
    const boxClassName = size === "md"
        ? "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
        : "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg";
    const svgClassName = size === "md" ? "h-6 w-6" : "h-4 w-4";

    if (!icon)
    {
        return (
            <span className={`${boxClassName} bg-line/80 text-accent dark:bg-white/10`}>
                <svg viewBox="0 0 24 24" className={svgClassName} aria-hidden="true">
                    <path
                        fill="currentColor"
                        d="M9 18V6.3l10-1.8v11.7a2.5 2.5 0 1 1-1.5-2.3V7.8L10.5 9v7.5A2.5 2.5 0 1 1 9 18Z"
                    />
                </svg>
            </span>
        );
    }

    const isMonochrome = icon.hex === "000000" || icon.hex === "FFFFFF";

    return (
        <span className={`${boxClassName} bg-white/90 dark:bg-white/10`}>
            <svg viewBox="0 0 24 24" className={svgClassName} aria-hidden="true">
                <path
                    fill={isMonochrome ? "currentColor" : `#${icon.hex}`}
                    d={icon.path}
                />
            </svg>
        </span>
    );
}

function TransportGlyph({ children }: { children: ReactNode })
{
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="currentColor">
            {children}
        </svg>
    );
}

function PlayGlyph()
{
    return (
        <TransportGlyph>
            <path d="M8.2 5.4v13.2L19 12 8.2 5.4Z" />
        </TransportGlyph>
    );
}

function PauseGlyph()
{
    return (
        <TransportGlyph>
            <path d="M6.5 5h3.4v14H6.5V5Zm7.6 0H17.5v14h-3.4V5Z" />
        </TransportGlyph>
    );
}

function PreviousGlyph()
{
    return (
        <TransportGlyph>
            <path d="M6 5.5h2.2v13H6v-13Zm12.2 0v13L9.4 12l8.8-6.5Z" />
        </TransportGlyph>
    );
}

function NextGlyph()
{
    return (
        <TransportGlyph>
            <path d="M15.8 5.5H18v13h-2.2v-13ZM5.8 5.5v13L14.6 12 5.8 5.5Z" />
        </TransportGlyph>
    );
}

function RepeatGlyph()
{
    return (
        <TransportGlyph>
            <path d="M7 7h8.2l-1.6-1.6L15 4l4 4-4 4-1.4-1.4L15.2 9H7a3 3 0 0 0-3 3v1H2v-1a5 5 0 0 1 5-5Zm10 10H8.8l1.6 1.6L9 20l-4-4 4-4 1.4 1.4L8.8 15H17a3 3 0 0 0 3-3v-1h2v1a5 5 0 0 1-5 5Z" />
        </TransportGlyph>
    );
}

function VolumeGlyph({ isMuted }: { isMuted: boolean })
{
    if (isMuted)
    {
        return (
            <TransportGlyph>
                <path d="M4 9.5v5h3.2L12 18.2V5.8L7.2 9.5H4Zm12.1.4 1.4-1.4 1.4 1.4L17.5 11.3l1.4 1.4-1.4 1.4-1.4-1.4-1.4 1.4-1.4-1.4 1.4-1.4-1.4-1.4 1.4-1.4 1.4 1.4Z" />
            </TransportGlyph>
        );
    }

    return (
        <TransportGlyph>
            <path d="M4 9.5v5h3.2L12 18.2V5.8L7.2 9.5H4Zm10.2.2a3.2 3.2 0 0 1 0 4.6l-1.2-1.2a1.5 1.5 0 0 0 0-2.2l1.2-1.2Zm2.3-2.3a6.4 6.4 0 0 1 0 9.2l-1.2-1.2a4.7 4.7 0 0 0 0-6.8l1.2-1.2Z" />
        </TransportGlyph>
    );
}

type PlayerIconButtonProps = {
    label: string;
    disabled: boolean;
    isPressed?: boolean;
    className?: string;
    onClick: () => void;
    children: ReactNode;
};

function PlayerIconButton({
    label,
    disabled,
    isPressed,
    className,
    onClick,
    children
}: PlayerIconButtonProps)
{
    return (
        <button
            type="button"
            className={`sw-icon-btn ${isPressed ? "sw-icon-btn-active" : ""} ${className ?? ""}`}
            disabled={disabled}
            aria-label={label}
            aria-pressed={isPressed}
            onClick={onClick}
        >
            {children}
        </button>
    );
}

function buildTrackViewArray(
    localizeGroup: (group: SkillGroup) => SkillGroup["en"],
    localizeTrack: (track: SkillTrack) => SkillTrack["en"]
): TrackView[]
{
    const resultArray: TrackView[] = [];

    skillGroupArray.forEach((group) =>
    {
        const localizedGroup = localizeGroup(group);

        group.trackArray.forEach((track) =>
        {
            const localizedTrack = localizeTrack(track);
            const albumTrack = findSkillwaveAlbumTrack(track.id);
            const isPlayable = Boolean(albumTrack);

            resultArray.push({
                key: track.id,
                albumId: group.id,
                albumTitle: localizedGroup.title,
                albumDescription: localizedGroup.description,
                iconId: track.iconId,
                familiarity: track.familiarity,
                title: localizedTrack.title,
                musicalSubtitle: localizedTrack.musicalSubtitle,
                songTitle: albumTrack?.title ?? null,
                artistName: albumTrack ? skillwaveAlbumCredits.artist : null,
                sourceAlbum: albumTrack?.sourceAlbum ?? null,
                description: localizedTrack.description,
                durationSecondCount: albumTrack?.durationSecondCount ?? 0,
                isPlayable
            });
        });
    });

    return resultArray;
}

// -- OPERATIONS
export default function MusicApp()
{
    const { t, localize } = useI18n();
    const { skillwaveVolumePercent, setSkillwaveVolumePercent } = useSettings();
    const { view } = useView();
    const { windowByIdMap } = useWindows();
    const musicWindow = windowByIdMap.music;
    const [selectedAlbumId, setSelectedAlbumId] = useState("frontend");
    const [selectedTrackKey, setSelectedTrackKey] = useState<string | null>("typescript");
    const [playback, setPlayback] = useState<SkillwavePlaybackSnapshot>(() => ({
        trackId: null,
        isPlaying: false,
        isReady: true,
        isLoading: false,
        positionSecondCount: 0,
        durationSecondCount: 0,
        volumePercent: skillwaveVolumePercent,
        isMuted: false,
        isRepeat: true,
        errorCode: null
    }));
    const engineRef = useRef(getSkillwaveAudioEngine());
    const isBusyRef = useRef(false);
    const selectedTrackKeyRef = useRef(selectedTrackKey);
    const playableTrackKeyArrayRef = useRef<string[]>([]);
    const initialVolumePercentRef = useRef(skillwaveVolumePercent);

    const trackArray = useMemo(
        () => buildTrackViewArray(
            (group) => localize(group),
            (track) => localize(track)
        ),
        [localize]
    );
    const selectedAlbum = skillGroupArray.find((group) => group.id === selectedAlbumId) ?? null;
    const albumTrackArray = trackArray.filter((track) => track.albumId === selectedAlbumId);
    const playableAlbumTrackArray = albumTrackArray.filter((track) => track.isPlayable);
    const selectedTrack = trackArray.find((track) => track.key === selectedTrackKey) ?? null;
    const localizedAlbum = selectedAlbum ? localize(selectedAlbum) : null;
    const trackCountLabel = t("musicTrackCount").replace(
        "{count}",
        String(albumTrackArray.length)
    );
    const isPlaybackForSelection = playback.trackId !== null
        && playback.trackId === selectedTrack?.key;
    const displayPositionSecondCount = isPlaybackForSelection
        ? playback.positionSecondCount
        : 0;
    const displayDurationSecondCount = isPlaybackForSelection && playback.durationSecondCount > 0
        ? playback.durationSecondCount
        : (selectedTrack?.durationSecondCount ?? 0);
    const progressPercent = displayDurationSecondCount > 0
        ? (displayPositionSecondCount / displayDurationSecondCount) * 100
        : 0;
    const canControlAudio = playableAlbumTrackArray.length > 0;
    const albumTitleText = `${localizedAlbum?.title ?? t("musicTracks")} - Vol. 01`;

    selectedTrackKeyRef.current = selectedTrackKey;
    playableTrackKeyArrayRef.current = playableAlbumTrackArray.map((track) => track.key);

    useEffect(() =>
    {
        const engine = getSkillwaveAudioEngine();
        engineRef.current = engine;
        engine.setVolumePercent(initialVolumePercentRef.current);

        const unsubscribe = engine.subscribe((snapshot) =>
        {
            setPlayback(snapshot);
        });

        engine.setTrackEndedHandler(() =>
        {
            const currentKey = selectedTrackKeyRef.current
                ?? engine.getSnapshot().trackId;
            const currentAlbumId = currentKey
                ? findSkillwaveAlbumTrack(currentKey)?.albumId ?? null
                : null;
            const playableKeyArray = currentAlbumId
                ? getSkillwaveAlbumTrackIdArray(currentAlbumId)
                : playableTrackKeyArrayRef.current;

            if (playableKeyArray.length === 0)
            {
                return;
            }

            const currentIndex = Math.max(0, playableKeyArray.indexOf(currentKey ?? ""));
            const nextKey = playableKeyArray[(currentIndex + 1) % playableKeyArray.length];
            setSelectedTrackKey(nextKey);

            if (currentAlbumId)
            {
                setSelectedAlbumId(currentAlbumId);
            }

            void engine.playTrack(nextKey, { autoplay: true });
        });

        return () =>
        {
            unsubscribe();
            engine.setTrackEndedHandler(null);
            disposeSkillwaveAudioEngine();
        };
    }, []);

    useEffect(() =>
    {
        if (!musicWindow.isOpen || view !== "os")
        {
            engineRef.current.stopAndRelease();
        }
    }, [musicWindow.isOpen, view]);

    useEffect(() =>
    {
        engineRef.current.setVolumePercent(skillwaveVolumePercent);
    }, [skillwaveVolumePercent]);

    async function handlePlayPause()
    {
        if (!canControlAudio || isBusyRef.current)
        {
            return;
        }

        isBusyRef.current = true;

        try
        {
            const fallbackTrackId = selectedTrack?.isPlayable
                ? selectedTrack.key
                : playableAlbumTrackArray[0]?.key ?? null;

            if (!fallbackTrackId)
            {
                return;
            }

            if (!selectedTrack?.isPlayable)
            {
                setSelectedTrackKey(fallbackTrackId);
            }

            await engineRef.current.togglePlayPause(fallbackTrackId);
        }
        finally
        {
            isBusyRef.current = false;
        }
    }

    async function handleSelectTrack(trackKey: string)
    {
        setSelectedTrackKey(trackKey);
        const track = trackArray.find((entry) => entry.key === trackKey);

        if (!track?.isPlayable)
        {
            if (playback.isPlaying || playback.trackId !== null)
            {
                engineRef.current.stopAndRelease();
            }

            return;
        }

        if (playback.trackId === trackKey && playback.isPlaying)
        {
            return;
        }

        if (isBusyRef.current)
        {
            return;
        }

        isBusyRef.current = true;

        try
        {
            await engineRef.current.playTrack(trackKey, { autoplay: true });
        }
        finally
        {
            isBusyRef.current = false;
        }
    }

    async function handleAdjacent(direction: 1 | -1)
    {
        if (!canControlAudio || playableAlbumTrackArray.length === 0 || isBusyRef.current)
        {
            return;
        }

        const currentKey = selectedTrack?.isPlayable
            ? selectedTrack.key
            : playback.trackId;
        const currentIndex = Math.max(
            0,
            playableAlbumTrackArray.findIndex((track) => track.key === currentKey)
        );
        const nextIndex = (currentIndex + direction + playableAlbumTrackArray.length)
            % playableAlbumTrackArray.length;
        const nextTrack = playableAlbumTrackArray[nextIndex];
        setSelectedTrackKey(nextTrack.key);

        if (playback.isPlaying)
        {
            isBusyRef.current = true;

            try
            {
                await engineRef.current.playTrack(nextTrack.key, { autoplay: true });
            }
            finally
            {
                isBusyRef.current = false;
            }

            return;
        }

        await engineRef.current.playTrack(nextTrack.key, { autoplay: false });
    }

    function handleVolumeChange(nextVolumePercent: number)
    {
        setSkillwaveVolumePercent(nextVolumePercent);
        engineRef.current.setVolumePercent(nextVolumePercent);

        if (nextVolumePercent > 0 && playback.isMuted)
        {
            engineRef.current.setMuted(false);
        }
    }

    function handleMuteToggle()
    {
        const nextMuted = !playback.isMuted;
        engineRef.current.setMuted(nextMuted);

        if (!nextMuted && skillwaveVolumePercent === 0)
        {
            setSkillwaveVolumePercent(70);
            engineRef.current.setVolumePercent(70);
        }
    }

    function handleSeek(nextPositionSecondCount: number)
    {
        if (!canControlAudio)
        {
            return;
        }

        engineRef.current.seekTo(nextPositionSecondCount);
    }

    function getPlaybackErrorText(): string | null
    {
        if (playback.errorCode === "missing")
        {
            return t("musicErrorMissing");
        }

        if (playback.errorCode === "unsupported")
        {
            return t("musicErrorUnsupported");
        }

        if (playback.errorCode === "playback")
        {
            return t("musicErrorPlayback");
        }

        return null;
    }

    const playbackErrorText = getPlaybackErrorText();
    let selectedNowPlayingSubtitle = t("musicAudioSoon");

    if (selectedTrack)
    {
        if (selectedTrack.isPlayable && selectedTrack.songTitle && selectedTrack.artistName)
        {
            const artistText = t("musicArtistBy").replace("{artist}", selectedTrack.artistName);
            selectedNowPlayingSubtitle = selectedTrack.sourceAlbum
                ? `${selectedTrack.songTitle} · ${artistText} · ${selectedTrack.sourceAlbum}`
                : `${selectedTrack.songTitle} · ${artistText}`;
        }
        else if (selectedTrack.isPlayable)
        {
            selectedNowPlayingSubtitle = selectedTrack.musicalSubtitle ?? selectedTrack.albumTitle;
        }
        else
        {
            selectedNowPlayingSubtitle = `${selectedTrack.musicalSubtitle ?? selectedTrack.albumTitle} · ${t("musicAudioSoon")}`;
        }
    }

    const isEffectivelyMuted = playback.isMuted || skillwaveVolumePercent === 0;
    const seekMax = Math.max(1, displayDurationSecondCount);
    const seekValue = Math.min(displayPositionSecondCount, seekMax);
    const canSeek = canControlAudio
        && isPlaybackForSelection
        && playback.durationSecondCount > 0;

    return (
        <div className="skillwave-app flex h-full min-h-0 flex-col overflow-hidden lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:grid-rows-1">
            <aside className="shrink-0 border-b border-line/80 bg-[#FFF9F4]/92 p-3 dark:border-white/10 dark:bg-black/35 lg:min-h-0 lg:overflow-auto lg:border-b-0 lg:border-r">
                <p className="px-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-slateSoft dark:text-white/45">
                    {t("musicAlbums")}
                </p>
                <ul className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:block lg:space-y-1 lg:overflow-visible lg:pb-0">
                    {skillGroupArray.map((group) =>
                    {
                        const localized = localize(group);
                        const isActive = selectedAlbumId === group.id;

                        return (
                            <li key={group.id} className="shrink-0 lg:shrink">
                                <button
                                    type="button"
                                    className={`sw-hit flex min-h-10 w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm ${
                                        isActive ? "sw-hit-active shadow-soft" : "text-ink dark:text-mist"
                                    }`}
                                    aria-current={isActive ? "true" : undefined}
                                    onClick={() => setSelectedAlbumId(group.id)}
                                >
                                    <CategoryIcon iconId={group.iconId} />
                                    <span className="whitespace-nowrap lg:truncate">
                                        {localized.title}
                                    </span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </aside>

            <section className="flex min-h-0 flex-1 flex-col bg-[#FFFDF9]/88 dark:bg-black/25">
                <div className="min-h-0 flex-1 space-y-4 overflow-auto p-4 sm:p-5">
                    <header className="flex items-start gap-3">
                        <span className="mt-0.5 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#7BA3C9]/18 text-[#4F7399] dark:bg-[#7BA3C9]/20 dark:text-[#B7D0E8]">
                            <CategoryIcon iconId={selectedAlbum?.iconId ?? "layout"} />
                        </span>
                        <div className="min-w-0">
                            <h3 className="font-display text-xl font-semibold tracking-tight">
                                {albumTitleText}
                            </h3>
                            {localizedAlbum ? (
                                <p className="mt-1 text-sm text-slateSoft dark:text-white/60">
                                    {localizedAlbum.description}
                                </p>
                            ) : null}
                            <p className="mt-2 text-xs font-medium uppercase tracking-[0.14em] text-slateSoft/90 dark:text-white/45">
                                {trackCountLabel}
                            </p>
                            {playableAlbumTrackArray.length > 0 ? (
                                <details className="sw-credits mt-2 text-left">
                                    <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.12em] text-slateSoft hover:text-ink dark:text-white/55 dark:hover:text-mist">
                                        {t("musicCredits")}
                                    </summary>
                                    <div className="mt-2 space-y-1.5 text-xs leading-relaxed text-slateSoft dark:text-white/60">
                                        <p>
                                            {t("musicCreditsArtist").replace(
                                                "{artist}",
                                                skillwaveAlbumCredits.artist
                                            )}
                                            {" · "}
                                            <a
                                                href={skillwaveAlbumCredits.artistUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="underline decoration-accent/50 underline-offset-2 hover:text-ink dark:hover:text-mist"
                                            >
                                                purrplecat.com
                                            </a>
                                        </p>
                                        <p>
                                            <a
                                                href={skillwaveAlbumCredits.catalogUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="underline decoration-accent/50 underline-offset-2 hover:text-ink dark:hover:text-mist"
                                            >
                                                {t("musicCreditsSource")}
                                            </a>
                                        </p>
                                        <p>
                                            <a
                                                href={skillwaveAlbumCredits.licenseUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="underline decoration-accent/50 underline-offset-2 hover:text-ink dark:hover:text-mist"
                                            >
                                                {t("musicCreditsLicense")}
                                            </a>
                                        </p>
                                        <p>{t("musicCreditsConversion")}</p>
                                        <p>{skillwaveAlbumCredits.requiredAttribution}</p>
                                    </div>
                                </details>
                            ) : null}
                        </div>
                    </header>

                    {playbackErrorText && canControlAudio ? (
                        <p
                            className="rounded-xl bg-[#D9772F]/12 px-3 py-2 text-sm text-[#8A4B16] dark:bg-[#D9772F]/15 dark:text-[#F6D3A8]"
                            role="alert"
                        >
                            {playbackErrorText}
                        </p>
                    ) : null}

                    <ul className="space-y-1">
                        {albumTrackArray.map((track, index) =>
                        {
                            const isSelected = selectedTrackKey === track.key;
                            const isCurrentPlaying = playback.isPlaying && playback.trackId === track.key;

                            return (
                                <li key={track.key}>
                                    <button
                                        type="button"
                                        className={`flex w-full items-center gap-3 rounded-2xl px-2 py-2 text-left ${
                                            isSelected ? "sw-row-active" : "sw-hit"
                                        }`}
                                        onClick={() =>
                                        {
                                            void handleSelectTrack(track.key);
                                        }}
                                    >
                                        <span className="flex w-5 items-center justify-center text-xs tabular-nums text-slateSoft dark:text-white/45">
                                            {isCurrentPlaying ? (
                                                <span className="sw-eq" aria-hidden="true">
                                                    <span />
                                                    <span />
                                                    <span />
                                                </span>
                                            ) : (
                                                index + 1
                                            )}
                                        </span>
                                        <TrackIcon iconId={track.iconId} />
                                        <span className="min-w-0 flex-1">
                                            <span className="block truncate text-sm font-semibold text-ink dark:text-mist">
                                                {track.title}
                                            </span>
                                            {track.isPlayable && track.songTitle && track.artistName ? (
                                                <span className="block truncate text-xs text-slateSoft dark:text-white/55">
                                                    {track.songTitle}
                                                    {" · "}
                                                    {t("musicArtistBy").replace("{artist}", track.artistName)}
                                                    {track.sourceAlbum ? ` · ${track.sourceAlbum}` : ""}
                                                </span>
                                            ) : track.musicalSubtitle ? (
                                                <span className="block truncate text-xs text-slateSoft dark:text-white/55">
                                                    {track.musicalSubtitle}
                                                </span>
                                            ) : null}
                                        </span>
                                        {track.durationSecondCount > 0 ? (
                                            <span className="shrink-0 pl-2 text-xs tabular-nums text-slateSoft dark:text-white/45">
                                                {formatClock(track.durationSecondCount)}
                                            </span>
                                        ) : track.familiarity === "familiar" ? (
                                            <span className="hidden rounded-md bg-line/70 px-1.5 py-0.5 text-[0.65rem] font-medium uppercase tracking-wide text-slateSoft sm:inline dark:bg-white/10 dark:text-white/55">
                                                {t("musicFamiliar")}
                                            </span>
                                        ) : !track.isPlayable ? (
                                            <span className="text-[0.65rem] uppercase tracking-wide text-slateSoft/80 dark:text-white/40">
                                                —
                                            </span>
                                        ) : null}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                <div className="sw-player shrink-0 border-t border-line/80 bg-[#FFF8F2]/95 px-3 py-3 dark:border-white/10 dark:bg-black/55 sm:px-4">
                    <div className="sw-player-grid">
                        <div className="sw-player-art">
                            {selectedTrack ? (
                                <TrackIcon iconId={selectedTrack.iconId} size="md" />
                            ) : (
                                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-line/70 dark:bg-white/10">
                                    <svg viewBox="0 0 24 24" className="h-5 w-5 text-slateSoft" aria-hidden="true">
                                        <path
                                            fill="currentColor"
                                            d="M9 18V6.3l10-1.8v11.7a2.5 2.5 0 1 1-1.5-2.3V7.8L10.5 9v7.5A2.5 2.5 0 1 1 9 18Z"
                                        />
                                    </svg>
                                </span>
                            )}
                        </div>
                        <div className="sw-player-main min-w-0 ps-3">
                            <p className="truncate text-sm font-semibold sm:text-base">
                                {selectedTrack ? selectedTrack.title : t("musicEmptySelection")}
                            </p>
                            <p className="truncate text-xs text-slateSoft dark:text-white/50">
                                {selectedNowPlayingSubtitle}
                            </p>
                        </div>
                    </div>

                    <div className="sw-seek-row">
                        <span className="sw-time sw-time-start text-slateSoft dark:text-white/50">
                            {formatClock(displayPositionSecondCount)}
                        </span>
                        <input
                            type="range"
                            min={0}
                            max={seekMax}
                            step={0.1}
                            value={seekValue}
                            disabled={!canSeek}
                            aria-valuemin={0}
                            aria-valuemax={Math.round(displayDurationSecondCount)}
                            aria-valuenow={Math.round(displayPositionSecondCount)}
                            aria-label={t("musicSeek")}
                            className="sw-range"
                            style={progressStyle(progressPercent)}
                            onChange={(event) =>
                            {
                                handleSeek(Number(event.target.value));
                            }}
                        />
                        <span className="sw-time sw-time-end text-slateSoft dark:text-white/50">
                            {formatClock(displayDurationSecondCount)}
                        </span>
                    </div>

                    <div className="sw-player-controls">
                        <div className="sw-player-transport">
                            <PlayerIconButton
                                label={t("musicPrevious")}
                                disabled={!canControlAudio}
                                className="sw-skip-btn"
                                onClick={() =>
                                {
                                    void handleAdjacent(-1);
                                }}
                            >
                                <PreviousGlyph />
                            </PlayerIconButton>
                            <button
                                type="button"
                                className="sw-play"
                                disabled={!canControlAudio}
                                aria-label={playback.isPlaying ? t("musicPause") : t("musicPlay")}
                                aria-busy={playback.isLoading}
                                onClick={() =>
                                {
                                    void handlePlayPause();
                                }}
                            >
                                {playback.isLoading ? (
                                    <span className="sw-play-spinner" aria-hidden="true" />
                                ) : playback.isPlaying ? (
                                    <PauseGlyph />
                                ) : (
                                    <PlayGlyph />
                                )}
                            </button>
                            <PlayerIconButton
                                label={t("musicNext")}
                                disabled={!canControlAudio}
                                className="sw-skip-btn"
                                onClick={() =>
                                {
                                    void handleAdjacent(1);
                                }}
                            >
                                <NextGlyph />
                            </PlayerIconButton>
                            <PlayerIconButton
                                label={t("musicRepeat")}
                                disabled={!canControlAudio}
                                isPressed={playback.isRepeat}
                                onClick={() => engineRef.current.setRepeat(!playback.isRepeat)}
                            >
                                <RepeatGlyph />
                            </PlayerIconButton>
                        </div>

                        <div className="sw-player-volume">
                            <PlayerIconButton
                                label={isEffectivelyMuted ? t("musicUnmute") : t("musicMute")}
                                disabled={!canControlAudio}
                                isPressed={isEffectivelyMuted}
                                onClick={handleMuteToggle}
                            >
                                <VolumeGlyph isMuted={isEffectivelyMuted} />
                            </PlayerIconButton>
                            <input
                                type="range"
                                min={0}
                                max={100}
                                value={skillwaveVolumePercent}
                                disabled={!canControlAudio}
                                aria-label={t("musicVolume")}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-valuenow={skillwaveVolumePercent}
                                className="sw-range"
                                style={progressStyle(skillwaveVolumePercent)}
                                onChange={(event) =>
                                {
                                    handleVolumeChange(Number(event.target.value));
                                }}
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
