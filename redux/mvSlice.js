import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const API_URL = 'http://192.168.100.232:3000/api';
export const loadMV = createAsyncThunk('videoClip/loadMV', async (idMV) => {
  try {
    const response = await axios.get(`${API_URL}/videoInfo/${idMV}`);
    return response.data;
  } catch (error) {
    console.error('error', error);
    throw error;
  }
});

export const videoClipSlice = createSlice({
  name: 'videoClip',
  initialState: {
    videoInfo: {},
    listMV: [],
    loading: true,
  },
  reducers: {
    setListMV: (state, action) => {
      state.listMV = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadMV.fulfilled, (state, action) => {
      state.loading = false;
      state.videoInfo = action.payload;
    });
    builder.addCase(loadMV.pending, (state, action) => {
      state.loading = true;
    });
  },
});

export const { setListMV } = videoClipSlice.actions;
export default videoClipSlice.reducer;
