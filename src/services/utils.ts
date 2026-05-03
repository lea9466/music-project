import type { SongDto } from "../types";

export const createSlug = (song:SongDto) => {
  return `${song.name}-${song.artist}-${song.id}`
    .toLowerCase()
    .replace(/\s+/g, '-')       // רווחים -> מקפים
    .replace(/[^a-z0-9\u0590-\u05FF-]/g, ''); // משאיר עברית/אנגלית
};