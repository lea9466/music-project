import axios from "./axios"
import { type SongRequestDto } from "../types"

const url = 'SongRequest'

export const addSongRequest = async (songRequest: SongRequestDto) => {
    const response = await axios.post<SongRequestDto>(url, songRequest)
    return response.data
}
export const getAllRequests = async () => {
    const response = await axios.get<SongRequestDto[]>(url)
    return response.data
}
export const fillSongRequest = async (songRequest: SongRequestDto) => {
    try {
        const response = await axios.put(url,songRequest);
        return response.status === 200 || response.status === 204;
    } catch (error) {
        console.error("שגיאה בעדכון בקשה:", error);
        return false;
    }
}

