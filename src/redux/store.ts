import { configureStore } from "@reduxjs/toolkit";
// import usersSlice from "./users/users.slice";
import categoriesSlice from './categoreis/categorieSlice'
import authSlice from './auth/authSlice'
import songsReducer from './songs/songSlice'
export const store = configureStore({
    reducer: {
        categories: categoriesSlice,
        auth: authSlice,
        songs: songsReducer,             
    }

})

export type RootState = ReturnType<typeof store.getState>


