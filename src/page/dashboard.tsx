import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { socket } from "../lib/socket";
import { BudgetItem, CategoryItem } from "../types";
import moment from "moment";
import BoxList from "../components/budget-list copy";

export default function Dashboard() {
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [budgets, setBudgets] = useState<BudgetItem[]>([]);
    const [filteredBudgets, setFilteredBudgets] = useState<BudgetItem[]>([]);
    const [allCategories, setAllCategories] = useState<CategoryItem[]>([]);
    const [date, setDate] = useState(new Date());

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

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("getBudgets", onGetBudgets);
        socket.on("getCat", onGetCategory);

        if (socket.connected) {
            socket.emit("getBudgets");
            socket.emit("getCat");
        }

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("getBudgets", onGetBudgets);
            socket.off("getCat", onGetCategory);
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

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-900 p-6 text-white">

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg"
            >
                <h2 className="text-2xl font-semibold mb-4">
                    Dashboard - {isConnected ? "Online" : "Offline"}
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
            </motion.div>

            <BoxList budgets={filteredBudgets} allCategories={allCategories} />
        </div>
    );
}
