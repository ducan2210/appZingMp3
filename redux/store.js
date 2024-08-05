import { configureStore } from '@reduxjs/toolkit';
import soundReducer from './soundSlice'; // Đảm bảo đường dẫn chính xác

const store = configureStore({
  reducer: {
    sound: soundReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
