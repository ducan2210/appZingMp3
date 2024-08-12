import { configureStore } from '@reduxjs/toolkit';
import soundReducer from './soundSlice'; // Đảm bảo đường dẫn chính xác
import soundHomeDataReducer from './soundHomeDataSlice';
import soundControlReducer from './soundControlSlice';
import artistReducer from './artistSlice';
import videoClipSlice from './mvSlice';
const store = configureStore({
  reducer: {
    sound: soundReducer,
    soundHome: soundHomeDataReducer,
    soundControl: soundControlReducer,
    artist: artistReducer,
    videoClip: videoClipSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
