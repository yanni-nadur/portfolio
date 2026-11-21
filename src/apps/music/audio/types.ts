// -- TYPES
export type SkillwaveAudioErrorCode = "missing" | "unsupported" | "playback" | null;

export type SkillwavePlaybackSnapshot = {
    trackId: string | null;
    isPlaying: boolean;
    isReady: boolean;
    isLoading: boolean;
    positionSecondCount: number;
    durationSecondCount: number;
    volumePercent: number;
    isMuted: boolean;
    isRepeat: boolean;
    errorCode: SkillwaveAudioErrorCode;
};

export type SkillwavePlaybackListener = (snapshot: SkillwavePlaybackSnapshot) => void;

export type SkillwaveAlbumTrack = {
    skillId: string;
    albumId: string;
    skillName: string;
    title: string;
    sourceAlbum: string;
    durationLabel: string;
    durationSecondCount: number;
    fileName: string;
    relativePath: string;
    originalSelection: boolean;
};

export type SkillwaveAlbumCredits = {
    artist: string;
    artistUrl: string;
    license: string;
    licenseUrl: string;
    catalogUrl: string;
    requiredAttribution: string;
};

/** @deprecated Use SkillwaveAlbumTrack */
export type FrontendAlbumTrack = SkillwaveAlbumTrack;

/** @deprecated Use SkillwaveAlbumCredits */
export type FrontendAlbumCredits = SkillwaveAlbumCredits;
