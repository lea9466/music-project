import axios from "./axios"
import { type UserFavoriteSong } from "../types"
const url = 'UserFavoriteSong'

// export const getCategories = async (): Promise<CategoryDto[]> => {
//     const response = await axios.get<CategoryDto[]>(url);
//     console.log(response.data);
//     return response.data;
// };

export const toggleFavoriteSongService = async (IDs: UserFavoriteSong) => {
    const response = await axios.post<UserFavoriteSong>(url, IDs)
    return response.data
}