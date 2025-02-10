import { motion } from "framer-motion";
import { rupiah } from "../lib/rupiah";
import { BudgetItem, CategoryItem } from "../types";
import moment from "moment";

moment.locale("id");

export default function BoxList({ budgets, allCategories }: { budgets: BudgetItem[], allCategories: CategoryItem[] }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-6 w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg"
        >
            <h2 className="text-2xl font-semibold mb-4">Daftar Belanja</h2>
            <ul className="space-y-4">
                {allCategories.length > 0 ? (
                    allCategories.map((item: CategoryItem) => {
                        // Hitung total pengeluaran berdasarkan catId
                        const totalSpent = budgets
                            .filter((budget) => budget.catId === item.id)
                            .reduce((acc, budget) => acc + budget.amount, 0);

                        // Tentukan warna berdasarkan kondisi budget
                        const isOverBudget = totalSpent >= item.maxAmount;
                        const bgColor = isOverBudget ? "bg-red-600 text-white" : "bg-gray-700";

                        return (
                            <div key={item.id} className={`${bgColor} p-4 rounded`}>
                                <div className="flex justify-between">
                                    <div>
                                        <h1 className="font-semibold">{item.name}</h1>
                                        <p className="text-sm text-gray-300">Limit {rupiah(item.maxAmount)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold">{rupiah(totalSpent)}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-gray-400">Tidak ada anggaran tersedia.</p>
                )}
            </ul>
        </motion.div>
    );
}
