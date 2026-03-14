import { createSlice,type PayloadAction } from '@reduxjs/toolkit';
import type { SongDto } from '../../types';



interface SongsState {
    songs: SongDto[];
    totalCount: number; // חשוב לדפדוף - כמה שירים יש בסך הכל בשרת
    loading: boolean;
    error: string | null;
}

const initialState: SongsState = {
    songs: [],
    totalCount: 0,
    loading: false,
    error: null,
};
const songsSlice = createSlice({
    name: 'songs',
    initialState,
    reducers: {
        // כשרוצים להחליף את כל הרשימה (למשל במעבר עמוד בטבלה)
        setSongs: (state, action: PayloadAction<{ items: SongDto[], total: number }>) => {
            state.songs = action.payload.items;
            state.totalCount = action.payload.total;
            state.loading = false;
        },

        // הוספת שיר חדש (למשל אחרי הצלחה ב-POST לשרת)
        addSong: (state, action: PayloadAction<SongDto>) => {
            state.songs.unshift(action.payload); // מוסיף להתחלה כדי שהמנהל יראה מיד
            state.totalCount += 1;
        },

        // עדכון שיר קיים
        updateSong: (state, action: PayloadAction<SongDto>) => {
            const index = state.songs.findIndex(s => s.id === action.payload.id);
            if (index !== -1) {
                state.songs[index] = action.payload;
            }
        },

        // מחיקת שיר
        removeSong: (state, action: PayloadAction<number>) => {
            state.songs = state.songs.filter(s => s.id !== action.payload);
            state.totalCount -= 1;
        },

        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },

        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        }
    }
});

export const { setSongs, addSong, updateSong, removeSong, setLoading, setError } = songsSlice.actions;
export default songsSlice.reducer;