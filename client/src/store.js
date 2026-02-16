import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
// Import other reducers as they are created

export const store = configureStore({
    reducer: {
        auth: authReducer,
        // Add other reducers here
    },
});
