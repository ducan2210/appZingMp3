import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://192.168.1.186:3000/api';

export const loadSoundData = createAsyncThunk('soundControl/loadSoundData', async (idSound) => {
  try {
    const response = await axios.get(`${API_URL}/songInfo/${idSound}`);
    return response.data;
  } catch (error) {
    console.error('error', error);
    throw error;
  }
});

export const soundControlSlice = createSlice({
  name: 'soundControl',
  initialState: {
    soundData: [],
    isPlaying: true,
    position: 0,
    duration: 0,
  },
  reducers: {
    setPosition: (state, action) => {
      state.position = action.payload;
    },
    setDuration: (state, action) => {
      state.duration = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadSoundData.fulfilled, (state, action) => {
      state.soundData = action.payload;
    });
  },
});

export const { setPosition, setDuration } = soundControlSlice.actions;
export default soundControlSlice.reducer;
