import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  messages: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, payload) => {
      state.user = payload.payload;
    },
    addMessage: (state, payload) => {
      const messagess = payload.payload.messages;
      state.messages.push(...messagess);
    },
    addSingleMessage: (state, payload) => {
      state.messages.push(payload.payload.newChat);
    },
  },
});

export const { addUser, addMessage, addSingleMessage } = userSlice.actions;

export default userSlice.reducer;
