export interface AuthState {
   accessToken: string | null;
   isAuthenticated: boolean;
   loading: boolean;
   error: string | null;
}