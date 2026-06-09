import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const USERS_API_URL = 'https://jsonplaceholder.typicode.com/users';

const initialState = [];

// Async API call - by thunk
export const fetchUsers = createAsyncThunk('users/fetchUsers', async (_, thunkAPI) => {
    try {
        const response = await fetch(USERS_API_URL);
        const data = await response.json();
        return data;
    }
    catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

export const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchUsers.fulfilled, (state, action) => {
                return action.payload;
            })
    }
})

export const selectAllUsers = (state) => state.users

// export const {} = usersSlice.actions;

export default usersSlice.reducer;