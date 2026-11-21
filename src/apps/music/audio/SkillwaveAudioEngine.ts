import {
    findSkillwaveAlbumTrack,
    getSkillwaveTrackUrl,
    isOpusOggPlaybackSupported
} from "./skillwaveCatalog";
import type {
    SkillwaveAudioErrorCode,
    SkillwavePlaybackListener,
    SkillwavePlaybackSnapshot
} from "./types";

// -- VARIABLES
let sharedEngine: SkillwaveAudioEngine | null = null;

// -- FUNCTIONS
function createEmptySnapshot(): SkillwavePlaybackSnapshot
{
    return {
        trackId: null,
        isPlaying: false,
        isReady: true,
        isLoading: false,
        positionSecondCount: 0,
        durationSecondCount: 0,
        volumePercent: 70,
        isMuted: false,
        isRepeat: true,
        errorCode: null
    };
}

function isAbortError(error: unknown): boolean
{
    return error instanceof DOMException && error.name === "AbortError";
}

// -- OPERATIONS
export class SkillwaveAudioEngine
{
    private audioElement: HTMLAudioElement | null = null;
    private listenerSet = new Set<SkillwavePlaybackListener>();
    private disposed = false;
    private playGeneration = 0;
    private loadedTrackId: string | null = null;
    private snapshot: SkillwavePlaybackSnapshot = createEmptySnapshot();
    private onTrackEnded: (() => void) | null = null;

    private readonly handleTimeUpdate = () =>
    {
        this.syncProgressFromElement();
    };

    private readonly handleLoadedMetadata = () =>
    {
        this.syncProgressFromElement();
    };

    private readonly handleCanPlay = () =>
    {
        this.syncProgressFromElement();
    };

    private readonly handleEnded = () =>
    {
        if (this.snapshot.isRepeat)
        {
            return;
        }

        this.snapshot = {
            ...this.snapshot,
            isPlaying: false,
            isLoading: false,
            positionSecondCount: 0
        };
        this.emit();

        if (this.onTrackEnded)
        {
            this.onTrackEnded();
        }
    };

    private readonly handleError = () =>
    {
        const mediaError = this.audioElement?.error;
        const unsupportedCode = typeof MediaError !== "undefined"
            ? MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED
            : 4;
        const networkCode = typeof MediaError !== "undefined"
            ? MediaError.MEDIA_ERR_NETWORK
            : 2;
        const abortedCode = typeof MediaError !== "undefined"
            ? MediaError.MEDIA_ERR_ABORTED
            : 1;
        let errorCode: SkillwaveAudioErrorCode = "playback";

        if (mediaError?.code === unsupportedCode)
        {
            errorCode = "unsupported";
        }
        else if (mediaError?.code === networkCode || mediaError?.code === abortedCode)
        {
            errorCode = "missing";
        }

        this.snapshot = {
            ...this.snapshot,
            isPlaying: false,
            isLoading: false,
            errorCode
        };
        this.emit();
    };

    get isDisposed(): boolean
    {
        return this.disposed;
    }

    subscribe(listener: SkillwavePlaybackListener): () => void
    {
        this.listenerSet.add(listener);
        listener(this.getSnapshot());

        return () =>
        {
            this.listenerSet.delete(listener);
        };
    }

    setTrackEndedHandler(handler: (() => void) | null)
    {
        this.onTrackEnded = handler;
    }

    getSnapshot(): SkillwavePlaybackSnapshot
    {
        return { ...this.snapshot };
    }

    async playTrack(trackId: string, options?: { autoplay?: boolean }): Promise<void>
    {
        if (this.disposed)
        {
            return;
        }

        const track = findSkillwaveAlbumTrack(trackId);
        const trackUrl = getSkillwaveTrackUrl(trackId);

        if (!track || !trackUrl)
        {
            this.snapshot = {
                ...this.snapshot,
                trackId,
                isPlaying: false,
                isLoading: false,
                positionSecondCount: 0,
                durationSecondCount: 0,
                errorCode: "missing"
            };
            this.emit();
            return;
        }

        const shouldAutoplay = options?.autoplay !== false;
        const playGeneration = ++this.playGeneration;

        if (!shouldAutoplay)
        {
            this.pauseElement();
            this.snapshot = {
                ...this.snapshot,
                trackId,
                isPlaying: false,
                isLoading: false,
                positionSecondCount: 0,
                durationSecondCount: track.durationSecondCount,
                errorCode: null
            };
            this.emit();
            return;
        }

        if (!isOpusOggPlaybackSupported())
        {
            this.snapshot = {
                ...this.snapshot,
                trackId,
                isPlaying: false,
                isLoading: false,
                positionSecondCount: 0,
                durationSecondCount: track.durationSecondCount,
                errorCode: "unsupported"
            };
            this.emit();
            return;
        }

        const audioElement = this.ensureAudioElement();

        this.snapshot = {
            ...this.snapshot,
            trackId,
            isPlaying: false,
            isLoading: true,
            positionSecondCount: 0,
            durationSecondCount: track.durationSecondCount,
            errorCode: null
        };
        this.emit();

        try
        {
            if (this.loadedTrackId !== trackId || !audioElement.src)
            {
                this.pauseElement();
                audioElement.preload = "auto";
                audioElement.src = trackUrl;
                this.loadedTrackId = trackId;
                audioElement.load();
            }

            audioElement.loop = this.snapshot.isRepeat;
            this.applyVolumeToElement();

            await audioElement.play();

            if (playGeneration !== this.playGeneration || this.disposed)
            {
                return;
            }

            this.snapshot = {
                ...this.snapshot,
                trackId,
                isPlaying: true,
                isLoading: false,
                errorCode: null,
                durationSecondCount: Number.isFinite(audioElement.duration) && audioElement.duration > 0
                    ? audioElement.duration
                    : track.durationSecondCount
            };
            this.emit();
        }
        catch (error)
        {
            if (playGeneration !== this.playGeneration || this.disposed || isAbortError(error))
            {
                return;
            }

            const errorCode: SkillwaveAudioErrorCode = isOpusOggPlaybackSupported()
                ? "missing"
                : "unsupported";

            this.snapshot = {
                ...this.snapshot,
                trackId,
                isPlaying: false,
                isLoading: false,
                errorCode
            };
            this.emit();
        }
    }

    async togglePlayPause(fallbackTrackId: string | null): Promise<void>
    {
        if (this.disposed)
        {
            return;
        }

        if (this.snapshot.isPlaying)
        {
            this.pauseElement();
            this.snapshot = {
                ...this.snapshot,
                isPlaying: false,
                isLoading: false
            };
            this.emit();
            return;
        }

        const trackId = this.snapshot.trackId ?? fallbackTrackId;

        if (!trackId)
        {
            return;
        }

        if (
            this.loadedTrackId === trackId
            && this.audioElement
            && this.audioElement.src
            && !this.audioElement.ended
        )
        {
            try
            {
                this.applyVolumeToElement();
                await this.audioElement.play();
                this.snapshot = {
                    ...this.snapshot,
                    trackId,
                    isPlaying: true,
                    isLoading: false,
                    errorCode: null
                };
                this.emit();
                return;
            }
            catch (error)
            {
                if (isAbortError(error))
                {
                    return;
                }
            }
        }

        await this.playTrack(trackId, { autoplay: true });
    }

    async pause(): Promise<void>
    {
        if (!this.snapshot.isPlaying)
        {
            return;
        }

        this.pauseElement();
        this.snapshot = {
            ...this.snapshot,
            isPlaying: false,
            isLoading: false
        };
        this.emit();
    }

    seekTo(positionSecondCount: number)
    {
        if (!this.audioElement || this.loadedTrackId !== this.snapshot.trackId)
        {
            return;
        }

        const durationSecondCount = this.snapshot.durationSecondCount > 0
            ? this.snapshot.durationSecondCount
            : this.audioElement.duration;
        const safePositionSecondCount = Math.max(
            0,
            Math.min(durationSecondCount || 0, positionSecondCount)
        );

        if (!Number.isFinite(safePositionSecondCount))
        {
            return;
        }

        this.audioElement.currentTime = safePositionSecondCount;
        this.snapshot = {
            ...this.snapshot,
            positionSecondCount: safePositionSecondCount
        };
        this.emit();
    }

    setVolumePercent(volumePercent: number)
    {
        const normalizedPercent = Math.max(0, Math.min(100, Math.round(volumePercent)));
        this.snapshot = {
            ...this.snapshot,
            volumePercent: normalizedPercent,
            isMuted: normalizedPercent === 0 ? true : this.snapshot.isMuted && normalizedPercent === 0
        };

        if (normalizedPercent > 0)
        {
            this.snapshot = {
                ...this.snapshot,
                isMuted: false
            };
        }

        this.applyVolumeToElement();
        this.emit();
    }

    setMuted(isMuted: boolean)
    {
        this.snapshot = {
            ...this.snapshot,
            isMuted
        };
        this.applyVolumeToElement();
        this.emit();
    }

    setRepeat(isRepeat: boolean)
    {
        this.snapshot = {
            ...this.snapshot,
            isRepeat
        };

        if (this.audioElement)
        {
            this.audioElement.loop = isRepeat;
        }

        this.emit();
    }

    stopAndRelease()
    {
        this.playGeneration += 1;
        this.pauseElement();

        if (this.audioElement)
        {
            this.audioElement.removeAttribute("src");
            this.audioElement.load();
        }

        this.loadedTrackId = null;
        this.snapshot = {
            ...this.snapshot,
            trackId: null,
            isPlaying: false,
            isLoading: false,
            positionSecondCount: 0,
            durationSecondCount: 0,
            errorCode: null
        };
        this.emit();
    }

    dispose()
    {
        if (this.disposed)
        {
            return;
        }

        this.disposed = true;
        this.stopAndRelease();
        this.listenerSet.clear();
        this.onTrackEnded = null;

        if (this.audioElement)
        {
            this.audioElement.removeEventListener("timeupdate", this.handleTimeUpdate);
            this.audioElement.removeEventListener("loadedmetadata", this.handleLoadedMetadata);
            this.audioElement.removeEventListener("canplay", this.handleCanPlay);
            this.audioElement.removeEventListener("ended", this.handleEnded);
            this.audioElement.removeEventListener("error", this.handleError);
            this.audioElement = null;
        }

        if (sharedEngine === this)
        {
            sharedEngine = null;
        }
    }

    private ensureAudioElement(): HTMLAudioElement
    {
        if (this.audioElement)
        {
            return this.audioElement;
        }

        const audioElement = new Audio();
        audioElement.preload = "none";
        audioElement.loop = this.snapshot.isRepeat;
        audioElement.addEventListener("timeupdate", this.handleTimeUpdate);
        audioElement.addEventListener("loadedmetadata", this.handleLoadedMetadata);
        audioElement.addEventListener("canplay", this.handleCanPlay);
        audioElement.addEventListener("ended", this.handleEnded);
        audioElement.addEventListener("error", this.handleError);
        this.audioElement = audioElement;
        this.applyVolumeToElement();
        return audioElement;
    }

    private pauseElement()
    {
        if (!this.audioElement)
        {
            return;
        }

        this.audioElement.pause();
    }

    private applyVolumeToElement()
    {
        if (!this.audioElement)
        {
            return;
        }

        this.audioElement.volume = Math.max(0, Math.min(1, this.snapshot.volumePercent / 100));
        this.audioElement.muted = this.snapshot.isMuted || this.snapshot.volumePercent === 0;
    }

    private syncProgressFromElement()
    {
        if (!this.audioElement)
        {
            return;
        }

        const durationSecondCount = Number.isFinite(this.audioElement.duration) && this.audioElement.duration > 0
            ? this.audioElement.duration
            : this.snapshot.durationSecondCount;
        const positionSecondCount = Number.isFinite(this.audioElement.currentTime)
            ? this.audioElement.currentTime
            : 0;

        this.snapshot = {
            ...this.snapshot,
            positionSecondCount,
            durationSecondCount
        };
        this.emit();
    }

    private emit()
    {
        const snapshot = this.getSnapshot();
        this.listenerSet.forEach((listener) => listener(snapshot));
    }
}

export function getSkillwaveAudioEngine(): SkillwaveAudioEngine
{
    if (!sharedEngine || sharedEngine.isDisposed)
    {
        sharedEngine = new SkillwaveAudioEngine();
    }

    return sharedEngine;
}

export function disposeSkillwaveAudioEngine()
{
    if (sharedEngine)
    {
        sharedEngine.dispose();
        sharedEngine = null;
    }
}
