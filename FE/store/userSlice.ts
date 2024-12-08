import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  userid: string | null;
  accessToken: string | null;
}

const initialState: UserState = {
  userid: null,
  accessToken: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<{ userid: string; accessToken: string }>) {
      state.userid = action.payload.userid;
      state.accessToken = action.payload.accessToken;
    },
    clearUser(state) {
      state.userid = null;
      state.accessToken = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
