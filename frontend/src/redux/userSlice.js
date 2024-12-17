import {createSlice} from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
    },
    reducers: {
        userReceived: (user, action) => {
            user.user = action.payload;
        },
    }
});

export const {userReceived} = userSlice.actions;
export default userSlice.reducer;
