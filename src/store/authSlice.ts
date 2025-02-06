import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState } from '../types/auth';

const initialState:AuthState = {
    accessToken: null,
    isAuthenticated: false,
    loading: false,
    error: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action: PayloadAction<{ accessToken: string }>) => {
            state.accessToken = action.payload.accessToken;
            state.isAuthenticated = true;
            state.loading = false;
            state.error = null;
        },
        loginFailure: (state, action: PayloadAction<{ error: string }>) => {
            state.accessToken = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = action.payload.error;
        },
        logout: (state) => {
            state.accessToken = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;  
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        }
    }
});

export const { loginSuccess, loginFailure, logout, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;