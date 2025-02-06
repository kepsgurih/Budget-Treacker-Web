import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';
import { RootState } from '../store';


const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  // Jika tidak terautentikasi, redirect ke halaman login
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);

  if (loading) return <div>Loading...</div>;

  // Jika terautentikasi, tampilkan halaman yang diminta
  return isAuthenticated ? <>{children}</> : <Navigate to="/" />;
}

export default PrivateRoute;
