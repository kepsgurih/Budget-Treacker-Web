import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Save } from "lucide-react";
import { socket } from "../lib/socket";
import { CategoryItem } from "../types";
import CategoryList from "../components/category-list";

export default function Categories() {
    const [name, setName] = useState("");
    const [maxAmount, setMaxAmount] = useState<number | undefined>();
    const [allCategories, setAllCategories] = useState<CategoryItem[]>([])
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [loading, setLoading] = useState({ create: false, delete: false, update: false });
    const [editId, setEditId] = useState(0);

    useEffect(() => {
        function onConnect() {
            setIsConnected(true);
            console.log('connected');
            socket.emit('getCat');
        }

        function onDisconnect() {
            setIsConnected(false);
        }

        function onGetCategory(value: CategoryItem[]) {
            setAllCategories(value);
        }

        function onLoading(status: { type: string; status: boolean }) {
            if (status.type === 'create') {
                setLoading((prev) => ({ ...prev, create: status.status }));
            } else if (status.type === 'delete') {
                setLoading((prev) => ({ ...prev, delete: status.status }));
            } else if (status.type === 'update') {
                setLoading((prev) => ({ ...prev, update: status.status }));
            }
        }


        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('getCat', onGetCategory);
        socket.on('loading', onLoading);

        if (socket.connected) socket.emit('getCat');

        // Clean up socket listeners saat komponen tidak lagi digunakan
        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('getCat', onGetCategory);
            socket.off('loading', onLoading);
        };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket.connected]);

    const addItem = () => {
        if (!name || !maxAmount) return;
        socket.emit('createCategories', { name, maxAmount: maxAmount });
        setName("");
        setMaxAmount(0);
    };

    const removeItem = (id: number) => {
        socket.emit('deleteCategories', id);
    };

    const setEdit = ({ id, name, maxAmount }: { id: number; name: string; maxAmount: number }) => {
        setEditId(id);
        setName(name);
        setMaxAmount(maxAmount);
    }

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-900 p-6 text-white">
            {
                loading.create || loading.delete || loading.update ? (
                    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                            <h2 className="text-lg font-semibold mb-2">Loading...</h2>
                        </div>
                    </div>
                ) :
                    (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg"
                        >
                            <h2 className="text-2xl font-semibold mb-4">Categories {isConnected ? "Online" : "Offline"}</h2>
                            {allCategories.length > 0 ? (<>
                                <div className=" gap-2 mb-4">
                                    <input
                                        type="text"
                                        placeholder="Nama"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="flex-1 p-2 w-full my-2 rounded bg-gray-700 text-white"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Jumlah"
                                        value={maxAmount}
                                        onChange={(e) => setMaxAmount(Number(e.target.value))}
                                        className="flex-1 p-2 w-full my-2 rounded bg-gray-700 text-white"
                                    />
                                </div>

                                {
                                    editId ? (
                                        <button onClick={() => {
                                            if (!name || !maxAmount) return;
                                            socket.emit('updateCategories', { id: editId, data: { name, maxAmount: Number(maxAmount) } });
                                            setEditId(0);
                                            setName("");
                                            setMaxAmount(0);
                                        }} className="flex items-center justify-center gap-2 bg-blue-500 p-2 w-full rounded hover:bg-blue-600">
                                            Simpan
                                            <Save size={20} />
                                        </button>
                                    ) : (
                                        <button onClick={addItem} className="flex items-center justify-center gap-2 bg-blue-500 p-2 w-full rounded hover:bg-blue-600">
                                            Tambah
                                            <Plus size={20} />
                                        </button>
                                    )
                                }
                            </>) : (
                                <div className="text-center mt-4">
                                    tunggu
                                </div>
                            )}
                        </motion.div>

                    )}

            <CategoryList setEdit={setEdit} categories={allCategories} removeItem={removeItem} />
        </div>
    );
}
