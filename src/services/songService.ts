import axios from "./axios"
import { type FullSongDto, type SongDto } from "../types"
const url = 'Song'

export const getSongs = async (): Promise<SongDto[]> => {
    const response = await axios.get<SongDto[]>(url);
    return response.data;
};

export const getFullSong = async (songId: number): Promise<FullSongDto> => {
    const response = await axios.get<FullSongDto>(`${url}/full/${songId}`);
    return response.data;
};

export const addSong = async (song: Omit<FullSongDto, 'id'>) => {
    const response = await axios.post(url, song)
    return response.data
}
export const getSongsByIDs = async (IDs: number[]) => {
    const response = await axios.post<SongDto[]>(`${url}/GetByIds`, IDs);
    return response.data;
}
export const getSongsByCatId = async (id:number) => {
    const response = await axios.get<SongDto[]>(`${url}/GetByCatId/${id}`);
    return response.data;
}
export const getSongsByUserId = async () => {
    const response = await axios.post<SongDto[]>(`${url}/GetByUserId`);
    return response.data;
}
export const deleteSong = async (id: number) => {
    const response = await axios.delete<boolean>(`${url}/${id}`);
    return response.data;
}
export const updateSong = async (song: FullSongDto) => {
    try {
        const response = await axios.put(url, song);
        return response.data;
    } catch (error) {
        console.error("שגיאה בעדכון שיר:", error);
    }
};