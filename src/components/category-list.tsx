import { motion } from "framer-motion";
import { rupiah } from "../lib/rupiah";
import { Edit3, Trash2 } from "lucide-react";
import { CategoryItem } from "../types";

export default function CategoryList({ categories, setEdit, removeItem }: { categories: CategoryItem[], setEdit: (item: { id: number, name: string, maxAmount: number }) => void, removeItem: (id: number) => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-6 w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg"
        >
            <h2 className="text-2xl font-semibold mb-4">Semua Kategori </h2>
            <ul className="space-y-4">
                {categories.length > 0 ? (
                    categories.map((item: CategoryItem) => (
                        <div key={item.id} className="bg-gray-700 p-4 rounded">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h1>{item.name}</h1>
                                    <p>{rupiah(item.maxAmount)}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => removeItem(item.id)} className="bg-red-500 p-2 rounded hover:bg-red-600">
                                        <Trash2 size={20} />
                                    </button>
                                    <button onClick={() => setEdit({ id: item.id, name: item.name, maxAmount: item.maxAmount })} className="bg-orange-500 p-2 rounded hover:bg-red-600">
                                        <Edit3 size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400">Tidak ada anggaran tersedia.</p>
                )}
            </ul>
        </motion.div>
    );
}
