import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const API_URL = 'http://localhost:3000/api';

export const loadPlayList = createAsyncThunk('sound/loadPlayList', async (idPlaylist, thunkAPI) => {
  try {
    const response = await axios.get(`${API_URL}/playlist/${idPlaylist}`);
    return response.data;
  } catch (error) {
    console.log('erro', error);
    return error;
  }
});

export const soundSlice = createSlice({
  name: 'sound',
  initialState: {
    dataPlaylist: {},
    titlePlaylist: '',
  },
  reducers: {
    setDataPlaylist: (state, action) => {
      state.dataPlaylist = action.payload;
    },
    setTitlePlaylist: (state, action) => {
      state.titlePlaylist = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadPlayList.fulfilled, (state, action) => {
      state.dataPlaylist = action.payload;
    });
  },
});

export const { setDataPlaylist, setTitlePlaylist } = soundSlice.actions;

export default soundSlice.reducer;
