export type UserDto = {
    id?: number;
    name: string;
    email: string;
    password?: string;
    srcImage?: string;
    role?: UserRole | number;
    favoriteSongs?: number[]
};

export type UserRole = "Regular" | "Admin" | "Manager";

const roleMap: { [key: number]: UserRole } = {
    0: "Regular",
    1: "Admin",
    2: "Manager",
};

export const convertUser = (user: UserDto): UserDto => ({
    id: user.id,
    name: user.name,
    email: user.email,
    password: user.password,
    srcImage: user.srcImage,
    role:
        typeof user.role === "number"
            ? roleMap[user.role] // ממפה מספר למחרוזת
            : (user.role as UserRole), // אם כבר מחרוזת
    favoriteSongs: user.favoriteSongs || [],
});

export type SongDto = {
    id?: number;
    name: string;
    artist: string;
    categoryId: number;
    utubLink?: string;
    language: string;
    majorOrMinor: string;
    date?: string;
    userId?: number;
    sourceText:string;

};

export type ChordDto = {
    id?: number;
    name: string;
    degree?: string;
    indexInLine: number;
    lineNumber: number;
    songId?: number;
    scaleId?: number;
    sequenceId?: number;
    spaces?: number;
    adding?: string;
    reason?: string;
};
export type CategoryDto = {
    id?: number;
    name?: string;
    description?: string;
    songsCount: number;

};
export type WordLineDto = {
    id?: number;
    songId?: number;
    lineNumber: number;
    text: string;
}
export type FullSongDto = {
    song: SongDto;
    wordLines: WordLineDto[];
    chords?: ChordDto[];
    chordsByLine?: Record<number, ChordDto[]>;
}

export type GeminiSongResponse = {
    Chords: ChordDto[],
    MusicalRecommendations: string
}
export type UserFavoriteSong = {
    songId: number
}

