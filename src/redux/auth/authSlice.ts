import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type UserDto } from '../../types';

const savedUser = localStorage.getItem("user");
interface AuthState {
    user: UserDto;
    token: string | null;
    isAdmin: boolean;
}
const initialState: AuthState = {
    user: savedUser ? JSON.parse(savedUser) : { name: '', email: '', id: 0, favoriteSongs: [], role: 0 },
    token: localStorage.getItem('token'),
    isAdmin: false
};



const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = { name: '', email: '', id: 0, favoriteSongs: [], role: 0 };
            state.token = null;
            localStorage.removeItem('token');
            localStorage.removeItem("user");
        },
        loginSuccess: (state, action: PayloadAction<{ user: UserDto, token: string }>) => {
            const { user, token } = action.payload;
            state.user = user;
            state.token = token;
            if (!state.user.favoriteSongs) state.user.favoriteSongs = [];
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("token", token);
        },
        addFavoriteSong: (state, action: PayloadAction<number>) => {
            if (!state.user.favoriteSongs) state.user.favoriteSongs = [];
            if (!state.user.favoriteSongs.includes(action.payload)) {
                state.user.favoriteSongs.push(action.payload);
            }
        },
        removeFavoriteSong: (state, action: PayloadAction<number>) => {
            if (state.user.favoriteSongs) {
                state.user.favoriteSongs = state.user.favoriteSongs.filter(
                    id => id !== action.payload
                );
            }
        },
        updateUser: (state, action: PayloadAction<Partial<UserDto>>) => {
            const updatedData = Object.fromEntries(
                Object.entries(action.payload).filter(([_, v]) => v !== undefined)
            );
            state.user = {
                ...state.user,
                ...updatedData
            };
            localStorage.setItem("user", JSON.stringify(state.user));
        },
    }
});

export const { logout, loginSuccess, addFavoriteSong, removeFavoriteSong, updateUser } = authSlice.actions;
export default authSlice.reducer;