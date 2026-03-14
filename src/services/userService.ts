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
            return {user:null,toke:null};
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
    const response = await axios.post(url+'/setNameOrImg', user)
    if (response.status === 204) return true; // הצלחה
    return false;
}

// export const deleteUser = async (id: string) => {
//     const response = await axios.delete(`${url}/${id}`)
//     return response.data
// }

// export const addUser = async (user: Omit<User, 'id'>) => {
//     const response = await axios.post(url,user)
//     return response.data
// }

// export const upDateUser = async (user:User) => {
//     const response = await axios.put(`${url}/${user.id}`,user)
//     return response.data
// }
