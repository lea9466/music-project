import axios from "./axios"
import { type CategoryDto } from "../types"
const url = 'Category'

export const getCategories = async (): Promise<CategoryDto[]> => {
    const response = await axios.get<CategoryDto[]>(url);
    return response.data;
};

export const addCategory = async (cat: CategoryDto) => {
    const response = await axios.post<CategoryDto>(url, cat)
    return response.data
}

export const deleteCategory = async (id: number) => {

    const response = await axios.delete(`${url}/${id}`);
    return response.status === 200 || response.status === 204;

};
export const updateCategory = async (cat: CategoryDto) => {
    
    const response = await axios.post(url + '/updateCat', cat);
    return response.status === 200 || response.status === 204;
};

