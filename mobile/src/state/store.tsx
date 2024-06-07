import { configureStore } from '@reduxjs/toolkit';

// Dummy reducer
const dummyReducer = (state = {}) => state;

const store = configureStore({
  reducer: {
    dummy: dummyReducer
  }
});

export default store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
