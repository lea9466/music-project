import axios from "./axios"
import { type ApiResponse, type SongRequestDto, type UserFavoriteSong } from "../types"
const url = 'SongRequestVote'


export const ToggleVote = async (songId: number) => {
    const response = await axios.post<ApiResponse>(url+'/'+ songId)
    console.log(response.data);
    
    return response.data
}