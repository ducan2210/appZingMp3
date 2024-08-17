import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const API_URL = 'http://192.168.100.232:3000/api';

export const loadPlayList = createAsyncThunk('sound/loadPlayList', async (idPlaylist, thunkAPI) => {
  try {
    const response = await axios.get(`${API_URL}/playlist/${idPlaylist}`);
    return response.data;
  } catch (error) {
    console.log('erro', error);
    return error;
  }
});

export const loadSoundData = createAsyncThunk('sound/loadSoundData', async (idMusic, thunkAPI) => {
  try {
    const response = await axios.get(`${API_URL}/songInfo/${idMusic}}`);
    return response.data;
  } catch (error) {
    console.log('erro', error);
    return error;
  }
});

export const soundSlice = createSlice({
  name: 'sound',
  initialState: {
    dataPlaylist: [],
    dataPlayListFull: {},
    soundData: {},
    titlePlaylist: '',
    isLoading: true,
  },
  reducers: {
    setDataPlaylist: (state, action) => {
      state.dataPlaylist = action.payload;
    },
    setDataPlayListFull: (state, action) => {
      state.dataPlayListFull = action.payload;
    },
    setTitlePlaylist: (state, action) => {
      state.titlePlaylist = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadPlayList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.dataPlayListFull = action.payload;
    });
    builder.addCase(loadPlayList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(loadSoundData.fulfilled, (state, action) => {
      state.soundData = action.payload;
    });
  },
});

export const { setDataPlaylist, setTitlePlaylist } = soundSlice.actions;

export default soundSlice.reducer;
