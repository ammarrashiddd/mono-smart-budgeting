"use client";

import { X, Plus, Trash } from "@phosphor-icons/react";
import { useState, useEffect } from "react";
import type { Dispatch, SetStateAction, FormEvent } from "react";

// Struktur object untuk menampung item dinamis di dalam form
interface BulkInputItem {
  description: string;
  amount: string;
  type: "income" | "expense";
  date: string;
}

interface TransactionsFormProps {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  editingTx: {
    id: string;
    description: string;
    amount: number;
    date: string;
  } | null;
  // Diubah menjadi menerima array data transaksi
  handleSaveBulk: (items: BulkInputItem[]) => Promise<void>;
}

export default function TransactionsForm({
  setIsModalOpen,
  editingTx,
  handleSaveBulk,
}: TransactionsFormProps) {
  // State utama berupa Array agar bisa menampung banyak baris transaksi sekaligus
  const [formItems, setFormItems] = useState<BulkInputItem[]>([
    {
      description: "",
      amount: "",
      type: "expense",
      date: new Date().toISOString().split("T")[0],
    },
  ]);

  // Jika dalam mode EDIT, isi form hanya dengan 1 data yang dilempar dari parent
  useEffect(() => {
    if (editingTx) {
      setFormItems([
        {
          description: editingTx.description,
          amount: Math.abs(editingTx.amount).toString(),
          type: editingTx.amount >= 0 ? "income" : "expense",
          date: new Date(editingTx.date).toISOString().split("T")[0],
        },
      ]);
    }
  }, [editingTx]);

  // Fungsi menambah baris form transaksi baru
  const handleAddItem = () => {
    // Menyalin tanggal dari item terakhir agar user tidak perlu mengisi tanggal berulang kali jika sama
    const lastDate =
      formItems[formItems.length - 1]?.date ||
      new Date().toISOString().split("T")[0];

    setFormItems([
      ...formItems,
      { description: "", amount: "", type: "expense", date: lastDate },
    ]);
  };

  // Fungsi menghapus baris form tertentu
  const handleRemoveItem = (indexToRemove: number) => {
    if (formItems.length === 1) return; // Sisakan minimal 1 baris input
    setFormItems(formItems.filter((_, idx) => idx !== indexToRemove));
  };

  // Fungsi generik untuk menangani perubahan data (onChange) tiap kolom secara spesifik berdasarkan indeksnya
  const handleInputChange = (
    index: number,
    field: keyof BulkInputItem,
    value: string,
  ) => {
    const updatedItems = [...formItems];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };
    setFormItems(updatedItems);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await handleSaveBulk(formItems);
  };

  return (
    <main className="fixed inset-0 bg-secondary/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl p-6 md:p-8 shadow-2xl relative animate-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
        {/* Close Button */}
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute right-4 top-4 text-gray-400 hover:text-secondary cursor-pointer"
        >
          <X size={20} weight="bold" />
        </button>

        <h3 className="text-lg font-black text-secondary uppercase mb-4 tracking-tight">
          {editingTx ? "Edit Transaksi" : "Tambah Multi Transaksi"}
        </h3>

        {/* Form Container dengan scroll internal jika item sangat banyak */}
        <form
          onSubmit={onSubmit}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="space-y-6 flex-1 overflow-y-auto pr-2 no-scrollbar pb-4">
            {formItems.map((item, index) => (
              <div
                key={index}
                className="p-4 border border-secondary/10 rounded-xl space-y-3 bg-secondary/1 relative group animate-in slide-in-from-bottom-2 duration-150"
              >
                {/* Header Angka Baris & Tombol Hapus per baris */}
                <div className="flex justify-between items-center border-b border-secondary/5 pb-2">
                  <span className="text-[10px] font-black text-secondary/40 uppercase">
                    Item #{index + 1}
                  </span>
                  {formItems.length > 1 && !editingTx && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="text-red-400 hover:text-red-500 p-1 rounded-md hover:bg-red-50 transition-all cursor-pointer"
                      title="Hapus baris ini"
                    >
                      <Trash size={14} weight="bold" />
                    </button>
                  )}
                </div>

                {/* Grid Input Dinamis */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                  {/* Tipe Transaksi */}
                  <div className="md:col-span-3">
                    <div className="grid grid-cols-2 gap-1 h-10">
                      <button
                        type="button"
                        onClick={() =>
                          handleInputChange(index, "type", "expense")
                        }
                        className={`text-xs font-bold rounded-lg border ${item.type === "expense" ? "bg-red-50 border-red-500 text-red-600" : "border-gray-200 text-gray-400"} cursor-pointer`}
                      >
                        Keluar
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleInputChange(index, "type", "income")
                        }
                        className={`text-xs font-bold rounded-lg border ${item.type === "income" ? "bg-green-50 border-green-500 text-green-600" : "border-gray-200 text-gray-400"} cursor-pointer`}
                      >
                        Masuk
                      </button>
                    </div>
                  </div>

                  {/* Nama Transaksi */}
                  <div className="md:col-span-9">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) =>
                        handleInputChange(index, "description", e.target.value)
                      }
                      placeholder="Nama transaksi (e.g. Starbucks)"
                      className="w-full h-10 border border-gray-200 rounded-lg px-3 text-xs outline-none focus:ring-2 focus:ring-tertiary/20"
                      required
                    />
                  </div>
                </div>
                {/* Tanggal */}
                <div className="md:col-span-2.5">
                  <input
                    type="date"
                    value={item.date}
                    onChange={(e) =>
                      handleInputChange(index, "date", e.target.value)
                    }
                    className="w-full h-10 border border-gray-200 rounded-lg px-2 text-xs outline-none focus:ring-2 focus:ring-tertiary/20"
                    required
                  />
                </div>

                {/* Nominal */}
                <div className="md:col-span-4">
                  <input
                    type="number"
                    value={item.amount}
                    onChange={(e) =>
                      handleInputChange(index, "amount", e.target.value)
                    }
                    placeholder="Nominal (Rp)"
                    className="w-full h-10 border border-gray-200 rounded-lg px-3 text-xs outline-none focus:ring-2 focus:ring-tertiary/20"
                    required
                  />
                </div>
              </div>
            ))}

            {/* Tombol Tambah Baris Transaksi Baru */}
            {!editingTx && (
              <button
                type="button"
                onClick={handleAddItem}
                className="w-full py-2.5 border-2 border-dashed border-secondary/20 hover:border-tertiary text-secondary/60 hover:text-tertiary rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer bg-white"
              >
                <Plus size={14} weight="bold" />
                Tambah Baris Transaksi
              </button>
            )}
          </div>

          {/* Sticky Actions di bagian bawah modal */}
          <div className="flex gap-3 pt-4 border-t border-secondary/5 bg-white">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 border border-gray-200 text-gray-500 text-sm font-bold py-3 rounded-xl hover:bg-gray-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 bg-tertiary text-primary text-sm font-black py-3 rounded-xl hover:opacity-90 cursor-pointer"
            >
              Simpan Semua ({formItems.length})
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
