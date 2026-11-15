import { useEffect, useMemo, useRef, useState } from "react";
import { skillGroupArray } from "../../content";
import { useI18n } from "../../i18n/I18nProvider";
import { useSettings } from "../../store/settingsStore";

// -- TYPES
type Track = {
    key: string;
    albumId: string;
    albumTitle: string;
    title: string;
};

// -- OPERATIONS
export default function MusicApp()
{
    const { t, localize } = useI18n();
    const { isTrackFavorite, toggleFavoriteTrack, favoriteTrackKeyArray } = useSettings();
    const [selectedAlbumId, setSelectedAlbumId] = useState(skillGroupArray[0]?.id ?? "");
    const [showFavorites, setShowFavorites] = useState(false);
    const [currentTrackKey, setCurrentTrackKey] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progressPercent, setProgressPercent] = useState(0);
    const [isShuffle, setIsShuffle] = useState(false);
    const [isRepeat, setIsRepeat] = useState(false);
    const playbackRef = useRef({
        isShuffle: false,
        isRepeat: false,
        currentTrackKey: null as string | null,
        sourceKeyArray: [] as string[]
    });

    const trackArray = useMemo(() =>
    {
        const resultArray: Track[] = [];

        skillGroupArray.forEach((group) =>
        {
            const localized = localize(group);
            localized.items.forEach((itemText, index) =>
            {
                resultArray.push({
                    key: `${group.id}:${index}`,
                    albumId: group.id,
                    albumTitle: localized.title,
                    title: itemText
                });
            });
        });

        return resultArray;
    }, [localize]);

    const selectedAlbum = skillGroupArray.find((group) => group.id === selectedAlbumId) ?? null;
    const albumTrackArray = trackArray.filter((track) => track.albumId === selectedAlbumId);
    const favoriteTrackArray = trackArray.filter((track) => favoriteTrackKeyArray.includes(track.key));
    const visibleTrackArray = showFavorites ? favoriteTrackArray : albumTrackArray;
    const currentTrack = trackArray.find((track) => track.key === currentTrackKey) ?? null;

    const playbackSourceArray = showFavorites && favoriteTrackArray.length > 0
        ? favoriteTrackArray
        : albumTrackArray.length > 0
            ? albumTrackArray
            : trackArray;

    playbackRef.current = {
        isShuffle,
        isRepeat,
        currentTrackKey,
        sourceKeyArray: playbackSourceArray.map((track) => track.key)
    };

    function playTrack(trackKey: string)
    {
        setCurrentTrackKey(trackKey);
        setProgressPercent(0);
        setIsPlaying(true);
    }

    function playAdjacent(direction: 1 | -1)
    {
        const sourceKeyArray = playbackRef.current.sourceKeyArray;

        if (sourceKeyArray.length === 0)
        {
            setIsPlaying(false);
            return;
        }

        if (playbackRef.current.isShuffle)
        {
            const randomIndex = Math.floor(Math.random() * sourceKeyArray.length);
            playTrack(sourceKeyArray[randomIndex]);
            return;
        }

        const currentIndex = Math.max(
            0,
            sourceKeyArray.findIndex((trackKey) => trackKey === playbackRef.current.currentTrackKey)
        );
        const nextIndex = (currentIndex + direction + sourceKeyArray.length) % sourceKeyArray.length;
        playTrack(sourceKeyArray[nextIndex]);
    }

    useEffect(() =>
    {
        if (!isPlaying || !currentTrackKey)
        {
            return;
        }

        const intervalId = window.setInterval(() =>
        {
            setProgressPercent((currentValue) =>
            {
                if (currentValue < 100)
                {
                    return currentValue + 2;
                }

                if (playbackRef.current.isRepeat)
                {
                    return 0;
                }

                const sourceKeyArray = playbackRef.current.sourceKeyArray;

                if (sourceKeyArray.length === 0)
                {
                    setIsPlaying(false);
                    return 0;
                }

                if (playbackRef.current.isShuffle)
                {
                    const randomIndex = Math.floor(Math.random() * sourceKeyArray.length);
                    setCurrentTrackKey(sourceKeyArray[randomIndex]);
                    return 0;
                }

                const currentIndex = Math.max(
                    0,
                    sourceKeyArray.findIndex(
                        (trackKey) => trackKey === playbackRef.current.currentTrackKey
                    )
                );
                const nextIndex = (currentIndex + 1) % sourceKeyArray.length;
                setCurrentTrackKey(sourceKeyArray[nextIndex]);
                return 0;
            });
        }, 200);

        return () =>
        {
            window.clearInterval(intervalId);
        };
    }, [isPlaying, currentTrackKey]);

    return (
        <div className="grid min-h-full lg:h-full lg:grid-cols-[240px_minmax(0,1fr)]">
            <aside className="border-b border-line p-4 dark:border-white/10 lg:max-h-full lg:overflow-auto lg:border-b-0 lg:border-r">
                <div className="flex gap-2">
                    <button
                        type="button"
                        className={`rounded-lg px-2.5 py-1 text-sm ${
                            !showFavorites
                                ? "bg-ink text-white dark:bg-white dark:text-ink"
                                : "bg-line/80 dark:bg-white/10"
                        }`}
                        onClick={() => setShowFavorites(false)}
                    >
                        {t("musicAlbums")}
                    </button>
                    <button
                        type="button"
                        className={`rounded-lg px-2.5 py-1 text-sm ${
                            showFavorites
                                ? "bg-ink text-white dark:bg-white dark:text-ink"
                                : "bg-line/80 dark:bg-white/10"
                        }`}
                        onClick={() => setShowFavorites(true)}
                    >
                        {t("musicFavorites")}
                    </button>
                </div>
                {!showFavorites ? (
                    <ul className="mt-4 space-y-1">
                        {skillGroupArray.map((group) =>
                        {
                            const localized = localize(group);

                            return (
                                <li key={group.id}>
                                    <button
                                        type="button"
                                        className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                                            selectedAlbumId === group.id
                                                ? "bg-accent text-white"
                                                : "hover:bg-line/70 dark:hover:bg-white/10"
                                        }`}
                                        onClick={() => setSelectedAlbumId(group.id)}
                                    >
                                        {localized.title}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                ) : null}
            </aside>

            <section className="flex min-h-0 flex-col">
                <div className="min-h-0 flex-1 space-y-3 overflow-auto p-5">
                    <h3 className="font-display text-xl font-semibold">
                        {showFavorites
                            ? t("musicFavorites")
                            : selectedAlbum
                                ? localize(selectedAlbum).title
                                : t("musicTracks")}
                    </h3>
                    {visibleTrackArray.length === 0 ? (
                        <p className="text-sm text-slateSoft dark:text-white/60">
                            {t("musicEmptyFavorites")}
                        </p>
                    ) : (
                        <ul className="space-y-1">
                            {visibleTrackArray.map((track, index) => (
                                <li
                                    key={track.key}
                                    className="flex items-center gap-2 rounded-xl px-2 py-2 hover:bg-white/70 dark:hover:bg-white/5"
                                >
                                    <button
                                        type="button"
                                        className="flex min-w-0 flex-1 items-center gap-3 text-left"
                                        onClick={() => playTrack(track.key)}
                                    >
                                        <span className="w-6 text-xs text-slateSoft">
                                            {index + 1}
                                        </span>
                                        <span className="truncate text-sm font-medium">
                                            {track.title}
                                        </span>
                                    </button>
                                    <button
                                        type="button"
                                        className={`text-lg ${
                                            isTrackFavorite(track.key)
                                                ? "text-accent"
                                                : "text-slateSoft"
                                        }`}
                                        aria-pressed={isTrackFavorite(track.key)}
                                        onClick={() => toggleFavoriteTrack(track.key)}
                                    >
                                        ★
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="border-t border-line bg-white/80 p-4 dark:border-white/10 dark:bg-black/20">
                    <p className="text-xs uppercase tracking-wide text-slateSoft dark:text-white/50">
                        {t("musicNowPlaying")}
                    </p>
                    <p className="mt-1 truncate text-sm font-semibold">
                        {currentTrack ? `${currentTrack.title} · ${currentTrack.albumTitle}` : "-"}
                    </p>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-line dark:bg-white/10">
                        <div
                            className="h-full bg-accent transition-[width] duration-200"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                    <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
                        <button
                            type="button"
                            className={`rounded-lg px-2 py-1 text-xs ${isShuffle ? "bg-accent text-white" : "bg-line/80 dark:bg-white/10"}`}
                            aria-pressed={isShuffle}
                            onClick={() => setIsShuffle((value) => !value)}
                        >
                            {t("musicShuffle")}
                        </button>
                        <button
                            type="button"
                            className="rounded-lg bg-line/80 px-3 py-1.5 text-sm dark:bg-white/10"
                            onClick={() => playAdjacent(-1)}
                        >
                            {t("musicPrevious")}
                        </button>
                        <button
                            type="button"
                            className="rounded-lg bg-accent px-4 py-1.5 text-sm font-semibold text-white"
                            onClick={() =>
                            {
                                if (!currentTrack && visibleTrackArray[0])
                                {
                                    playTrack(visibleTrackArray[0].key);
                                    return;
                                }

                                setIsPlaying((value) => !value);
                            }}
                        >
                            {isPlaying ? t("musicPause") : t("musicPlay")}
                        </button>
                        <button
                            type="button"
                            className="rounded-lg bg-line/80 px-3 py-1.5 text-sm dark:bg-white/10"
                            onClick={() => playAdjacent(1)}
                        >
                            {t("musicNext")}
                        </button>
                        <button
                            type="button"
                            className={`rounded-lg px-2 py-1 text-xs ${isRepeat ? "bg-accent text-white" : "bg-line/80 dark:bg-white/10"}`}
                            aria-pressed={isRepeat}
                            onClick={() => setIsRepeat((value) => !value)}
                        >
                            {t("musicRepeat")}
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
