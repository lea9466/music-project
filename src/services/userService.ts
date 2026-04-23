import axios from "./axios"
import { type UserDto } from "../types"
const url = 'User'


export const getUsers = async () => {
    const response = await axios.get(url)
    return response.data
}
// 1. הגדרת הפרמטר בצורה פשוטה: log הוא האובייקט שמכיל את הנתונים
export const login = async (log: UserDto) => {
    try {
        const response = await axios.post(url + '/login', log);
        return response.data;
    } catch (error: any) {
        if (error.response?.status === 400) {
            return { user: null, toke: null };
        }
        throw error;
    }
}

export const getUserByID = async (id: string) => {
    const response = await axios.get(`${url}/${id}`)
    return response.data
}
export const addUser = async (user: Omit<UserDto, 'id'>) => {
    const response = await axios.post(url, user)
    return response.data
}

export const setNameOrImg = async (user: Omit<UserDto, 'id'>) => {
    const response = await axios.post(url + '/setNameOrImg', user)
    return response.status === 204 || response.status === 200
}
export const setEmailOrPass = async (user: Omit<UserDto, 'id'>) => {
    const response = await axios.post(url + '/setEmailOrPass', user)
    return response.status === 204 || response.status === 200

}
export const setRole = async (user: Omit<UserDto, 'id'>) => {
    const response = await axios.post(url + '/setRole', user)
    return response.status === 204 || response.status === 200

}
export const deleteUser = async (id: number) => {
    const response = await axios.delete(url + '/' + id)
    return response.status === 204 || response.status === 200

}

