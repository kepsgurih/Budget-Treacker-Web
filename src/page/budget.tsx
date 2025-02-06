import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Edit, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import BudgetList from "../components/budget-list";
import { socket } from "../lib/socket";
import { BudgetItem, CategoryItem } from "../types";
import moment from "moment";

export default function BudgetTracker() {
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState<number>();
    const [catId, setCatId] = useState(0);
    const [type, setType] = useState(true);
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [budgets, setBudgets] = useState<BudgetItem[]>([]);
    const [filteredBudgets, setFilteredBudgets] = useState<BudgetItem[]>([]);
    const [loading, setLoading] = useState({ create: false, delete: false, update: false });
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [allCategories, setAllCategories] = useState<CategoryItem[]>([]);
    const [date, setDate] = useState(new Date());
    const [editedId, setEditedId] = useState(0);

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        setIsAuthenticated(!!accessToken);
    }, []);

    useEffect(() => {
        function onConnect() {
            setIsConnected(true);
            socket.emit("getBudgets");
            socket.emit("getCat");
        }

        function onDisconnect() {
            setIsConnected(false);
        }

        function onGetBudgets(value: BudgetItem[]) {
            setBudgets(value);
        }

        function onGetCategory(value: CategoryItem[]) {
            setAllCategories(value);
        }

        function onLoading(status: { type: string; status: boolean }) {
            setLoading((prev) => ({ ...prev, [status.type]: status.status }));
        }

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("getBudgets", onGetBudgets);
        socket.on("getCat", onGetCategory);
        socket.on("loading", onLoading);

        if (socket.connected) {
            socket.emit("getBudgets");
            socket.emit("getCat");
        }

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("getBudgets", onGetBudgets);
            socket.off("getCat", onGetCategory);
            socket.off("loading", onLoading);
        };
    }, []);

    useEffect(() => {
        filterBudgetsByMonth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [budgets, date]);

    const filterBudgetsByMonth = () => {
        const startDate = moment(date).startOf("month");
        const endDate = moment(date).endOf("month");

        const filtered = budgets.filter((budget) => {
            const budgetDate = moment(budget.date);
            return budgetDate.isBetween(startDate, endDate, "day", "[]");
        });

        setFilteredBudgets(filtered);
    };

    const changeMonth = (offset: number) => {
        setDate((prev) => moment(prev).add(offset, "months").toDate());
    };

    const addItem = () => {
        if (!description || !amount || catId === 0) return;
        socket.emit("createBudget", { description, amount, catId, type });
        setDescription("");
        setAmount(0);
        setCatId(0);
        setType(true);
    };

    const updateItem = () => {
        if (!description || !amount) return alert("Data tidak boleh kosong");
        socket.emit("updateBudget", {
            id: editedId,
            data: { description, amount, date },
        });
        setEditedId(0);
        setDescription("");
        setAmount(0);
        setDate(new Date());
    };

    const removeItem = (id: number) => {
        socket.emit("deleteBudget", id);
    };

    const setEdit = ({ id, description, amount, date }: { id: number; description: string; amount: number; date: Date }) => {
        setEditedId(id);
        setDescription(description);
        setAmount(amount);
        setDate(date);
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-900 p-6 text-white">
            {
                loading.create || loading.delete || loading.update ? (
                    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                            <h2 className="text-lg font-semibold mb-2">Loading...</h2>
                        </div>
                    </div>
                ) : (

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg"
            >
                <h2 className="text-2xl font-semibold mb-4">
                    Budget Tracker {isConnected ? "Online" : "Offline"}
                </h2>

                {/* Navigasi Bulan */}
                <div className="flex justify-between items-center mb-4">
                    <button onClick={() => changeMonth(-1)} className="p-2 rounded bg-gray-700 hover:bg-gray-600">
                        <ChevronLeft size={20} />
                    </button>
                    <span className="text-lg font-semibold">
                        {moment(date).format("MMMM YYYY")}
                    </span>
                    <button onClick={() => changeMonth(1)} className="p-2 rounded bg-gray-700 hover:bg-gray-600">
                        <ChevronRight size={20} />
                    </button>
                </div>

                {isAuthenticated && allCategories.length > 0 ? (
                    <>
                        <div className="gap-2 mb-4">
                            <input
                                type="text"
                                placeholder="Deskripsi"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="flex-1 p-2 w-full my-2 rounded bg-gray-700 text-white"
                            />
                            <input
                                type="number"
                                placeholder="Jumlah"
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                                className="flex-1 p-2 w-full my-2 rounded bg-gray-700 text-white"
                            />
                            <input
                                type="date"
                                value={moment(date).format("YYYY-MM-DD")}
                                onChange={(e) => setDate(moment(e.target.value).toDate())}
                                className="flex-1 p-2 w-full my-2 rounded bg-gray-700 text-white"
                            />
                            {editedId === 0 && (
                                <>
                                    <select
                                        value={catId}
                                        onChange={(e) => setCatId(parseInt(e.target.value))}
                                        className="flex-1 p-2 w-full my-2 rounded bg-gray-700 text-white"
                                    >
                                        {allCategories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        value={type ? "true" : "false"}
                                        onChange={(e) => setType(e.target.value === "true")}
                                        className="flex-1 p-2 w-full my-2 rounded bg-gray-700 text-white"
                                    >
                                        <option value="true">Pemasukan</option>
                                        <option value="false">Pengeluaran</option>
                                    </select>
                                </>
                            )}
                        </div>

                        {editedId !== 0 ? (
                            <button onClick={updateItem} className="bg-blue-500 p-2 w-full rounded hover:bg-blue-600 flex items-center justify-center gap-2">
                                Edit <Edit size={20} />
                            </button>
                        ) : (
                            <button onClick={addItem} className="bg-blue-500 p-2 w-full rounded hover:bg-blue-600 flex items-center justify-center gap-2">
                                Tambah <Plus size={20} />
                            </button>
                        )}
                    </>
                ) : (
                    <div className="text-center mt-4">Tunggu...</div>
                )}
            </motion.div>
                )
            }

            <BudgetList setEdit={setEdit} budgets={filteredBudgets} allCategories={allCategories} removeItem={removeItem} />
        </div>
    );
}
