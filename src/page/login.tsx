import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { AxiosError } from "axios";
import { login } from "../lib/axiosbase";
import { useDispatch, useSelector } from "react-redux";
import { loginFailure, loginSuccess, setLoading } from "../store/authSlice";
import { RootState } from "../store";

export default function LoginPage() {
    const { error, loading } = useSelector((state: RootState) => state.auth);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useNavigate();
    const dispatch = useDispatch();


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(setLoading(true));

        try {
            const { accessToken } = await login(email, password);
            localStorage.setItem("accessToken", accessToken);
            dispatch(loginSuccess({ accessToken }));
            router('/app');
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 401) {
                    dispatch(loginFailure({ error: error?.response?.data }));
                }
            }
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-gray-900 p-4">

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="bg-white/10 backdrop-blur-lg shadow-xl border border-white/20 p-6 rounded-2xl w-96">
                    <div>
                        <h2 className="text-white text-2xl font-semibold text-center mb-6">Login</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10 w-full bg-white/20 text-white placeholder-white/70 focus:ring-white/50 p-2 rounded-md border border-white/30"
                                    required
                                />
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10 w-full bg-white/20 text-white placeholder-white/70 focus:ring-white/50 p-2 rounded-md border border-white/30"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg"
                                disabled={loading}
                            >
                                {loading ? "Memproses..." : "Login"}
                            </button>
                        </form>
                        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
                        <p className="text-center text-white/80 text-sm mt-4">
                            Belum punya akun?{" "}
                            <Link to={"/register"} className="text-blue-400 hover:underline">
                                Daftar
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
