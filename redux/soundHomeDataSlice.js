import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://192.168.100.232:3000/api';

export const loadDataHome = createAsyncThunk('soundHomeData/loadDataHome', async () => {
  try {
    const response = await axios.get(`${API_URL}/home`);
    return response.data;
  } catch (error) {
    console.error('error', error);
    throw error;
  }
});

const soundHomeDataSlice = createSlice({
  name: 'soundHomeData',
  initialState: {
    dataHome: {},
    isLoading: false,
  },
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadDataHome.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(loadDataHome.fulfilled, (state, action) => {
      state.dataHome = action.payload;
      state.isLoading = false;
    });
    builder.addCase(loadDataHome.rejected, (state, action) => {
      state.isLoading = false;
    });
  },
});

export const { setLoading } = soundHomeDataSlice.actions;
export default soundHomeDataSlice.reducer;
