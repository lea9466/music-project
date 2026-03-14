import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { UserDto } from "../../types";



type UserStateType = {
    users: UserDto[]
}
const initialState: UserStateType = {
    users: [],
}

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setUsers: (state, action: PayloadAction<UserDto[]>) => {
            state.users = action.payload
        },
        addUser: (state, action: PayloadAction<UserDto>) => {
            state.users.push(action.payload)
        }
    }
})

export const { setUsers, addUser } = usersSlice.actions

export default usersSlice.reducer
