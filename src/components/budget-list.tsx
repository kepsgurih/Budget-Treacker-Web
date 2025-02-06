import { motion } from "framer-motion";
import { rupiah } from "../lib/rupiah";
import { Edit2, Trash2 } from "lucide-react";
import { BudgetItem, CategoryItem } from "../types";
import moment from "moment";
moment.locale("id");

export default function BudgetList({ budgets, allCategories, setEdit, removeItem }: { budgets: BudgetItem[], allCategories: CategoryItem[], setEdit: (item: { id: number, description: string, amount: number, date: Date }) => void, removeItem: (id: number) => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-6 w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg"
        >
            <h2 className="text-2xl font-semibold mb-4">Daftar Belanja </h2>
            <ul className="space-y-4">
                {budgets.length > 0 ? (
                    budgets.map((item: BudgetItem) => (
                        <div key={item.id} className="bg-gray-700 p-4 rounded">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h1>{item.description}</h1>
                                    <p>{rupiah(item.amount)}</p>
                                    <div className="flex gap-2 mt-2">
                                        <p className={`font-bold p-2 rounded ${item.type ? "bg-green-500" : "bg-red-500"}`}>{item.type ? "Pemasukan" : "Pengeluaran"}</p>
                                        <p className="font-bold bg-blue-500 p-2 rounded">{allCategories.length > 0 && allCategories.filter((cat) => cat.id === item.catId)[0].name}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => removeItem(item.id)} className="bg-red-500 p-2 rounded hover:bg-red-600 cursor-pointer">
                                        <Trash2 size={20} />
                                    </button>
                                    <button onClick={() => setEdit({ id: item.id, description: item.description, amount: item.amount, date: item.date })} className="bg-orange-500 p-2 rounded hover:bg-red-600 cursor-pointer">
                                        <Edit2 size={20} />
                                    </button>
                                </div>
                            </div>
                            <div className="mt-2 text-center bg-yellow-900 p-2 text-sm font-semibold text-white rounded">{moment(item.date).locale("id").format("DD MMMM YYYY")}</div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400">Tidak ada anggaran tersedia.</p>
                )}
            </ul>
        </motion.div>
    );
}
