import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { CategoryDto } from "../../types";



type categoriesStateType = {
    categories: CategoryDto[]
}
const initialState: categoriesStateType = {
    categories: [],
}

const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        setCategories: (state, action: PayloadAction<CategoryDto[]>) => {
            state.categories = action.payload
        },
        addCategoryToStore: (state, action: PayloadAction<CategoryDto>) => {
            state.categories.push(action.payload)
        },
        deleteCategoryFromStore: (state, action: PayloadAction<number>) => {
            state.categories = state.categories.filter(category => category.id !== action.payload);
        },
        updateCategoryFromStore: (state, action: PayloadAction<CategoryDto>) => {
            state.categories = state.categories.map(category =>
                category.id === action.payload.id ? action.payload : category
            );
        },
       
    }
})

export const { setCategories, addCategoryToStore, deleteCategoryFromStore, updateCategoryFromStore } = categoriesSlice.actions

export default categoriesSlice.reducer
