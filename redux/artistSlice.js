import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://192.168.100.232:3000/api';
export const loadDataArtist = createAsyncThunk('artist/artistSlice', async (aliasArtist) => {
  try {
    const response = await axios.get(`${API_URL}/artist/${aliasArtist}`);
    return response.data;
  } catch (error) {
    console.log('error', error);
    throw error;
  }
});

export const artistSlice = createSlice({
  name: 'artist',
  initialState: {
    artistData: {},
    loading: true,
  },
  extraReducers: (builder) => {
    builder.addCase(loadDataArtist.fulfilled, (state, action) => {
      state.artistData = action.payload;
      state.loading = false;
    });
    builder.addCase(loadDataArtist.pending, (state, action) => {
      state.loading = true;
    });
  },
});

export default artistSlice.reducer;
