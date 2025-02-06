import { Navigate, Route, Routes } from "react-router";
import LoginPage from "./page/login";
import BudgetTracker from "./page/budget";
import Categories from "./page/categories";
import PrivateRoute from "./lib/private-route";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { loginSuccess } from "./store/authSlice";
import { RootState } from "./store";
import Layout from "./components/layout";
import Dashboard from "./page/dashboard";

export default function Routing() {
    const dispatch = useDispatch();
    const { accessToken } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        const storedToken = localStorage.getItem("accessToken");
        if (storedToken) {
            dispatch(loginSuccess({ accessToken: storedToken }));
        }
    }, [dispatch]);

    return (
        <Routes>
            <Route index element={accessToken ? <Navigate to="/app" /> : <LoginPage />} />
            <Route path="app" element={<PrivateRoute><Layout /></PrivateRoute>}>
                <Route index element={<Navigate to="/app/dashboard" />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="budget" element={<BudgetTracker />} />
                <Route path="categories" element={<Categories />} />
            </Route>
        </Routes>
    );
}