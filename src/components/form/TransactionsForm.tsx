"use client";

import { X, Plus, Trash } from "@phosphor-icons/react";
import { useState, useEffect } from "react";
import type { Dispatch, SetStateAction, FormEvent } from "react";

// 1. Tambahkan Enum Kategori di Tingkat Interface Frontend
export type TransactionCategory =
  | "MAKANAN_MINUMAN"
  | "TAGIHAN"
  | "TRANSPORTASI"
  | "PENDIDIKAN"
  | "KESEHATAN"
  | "HIBURAN_GAYA_HIDUP"
  | "BELANJA_FASHION"
  | "HOBI"
  | "PEMASUKAN"
  | "INVESTASI_TABUNGAN"
  | "LAIN_LAIN";

interface BulkInputItem {
  description: string;
  amount: string;
  type: "income" | "expense";
  date: string;
  category: TransactionCategory | ""; // Menyimpan nilai kategori untuk Prisma DB
  goalId?: string;
}

interface GoalOption {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
}

interface TransactionsFormProps {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  editingTx: {
    id: string;
    description: string;
    amount: number;
    date: string;
    category?: string | null; // Dukungan properti edit data
    goalId?: string | null;
  } | null;
  handleSaveBulk: (items: BulkInputItem[]) => Promise<void>;
}

// 2. Daftar Kategori Default Khusus untuk Pengeluaran (Expense)
export const EXPENSE_CATEGORIES = [
  { value: "MAKANAN_MINUMAN", label: "Makanan & Minuman" },
  { value: "TAGIHAN", label: "Tagihan" },
  { value: "TRANSPORTASI", label: "Transportasi" },
  { value: "PENDIDIKAN", label: "Pendidikan" },
  { value: "KESEHATAN", label: "Kesehatan" },
  { value: "HIBURAN_GAYA_HIDUP", label: "Hiburan & Gaya Hidup" },
  { value: "HOBI", label: "Hobi" },
  { value: "BELANJA_FASHION", label: "Belanja & Fashion" },
  { value: "INVESTASI_TABUNGAN", label: "Investasi & Tabungan" },
  { value: "LAIN_LAIN", label: "Lain-lain" },
];

export default function TransactionsForm({
  setIsModalOpen,
  editingTx,
  handleSaveBulk,
}: TransactionsFormProps) {
  const [formItems, setFormItems] = useState<BulkInputItem[]>([
    {
      description: "",
      amount: "",
      type: "expense",
      date: new Date().toISOString().split("T")[0],
      category: "", // Default awal kosong untuk memaksa user memilih
      goalId: "",
    },
  ]);

  const [goalsList, setGoalsList] = useState<GoalOption[]>([]);
  const [activeGoalDropdown, setActiveGoalDropdown] = useState<number | null>(
    null,
  );

  // FETCH DAFTAR GOALS AKTIF USER
  useEffect(() => {
    const fetchUserGoals = async () => {
      try {
        const res = await fetch("/api/goals");
        if (res.ok) {
          const data = await res.json();
          setGoalsList(data);
        }
      } catch (err) {
        console.error("Gagal mengambil daftar target goals:", err);
      }
    };
    fetchUserGoals();
  }, []);

  // Set data jika dalam mode EDIT
  useEffect(() => {
    if (editingTx) {
      const isIncome = editingTx.amount >= 0;
      setFormItems([
        {
          description: editingTx.description,
          amount: Math.abs(editingTx.amount).toString(),
          type: isIncome ? "income" : "expense",
          date: new Date(editingTx.date).toISOString().split("T")[0],
          category:
            (editingTx.category as TransactionCategory) ||
            (isIncome ? "PEMASUKAN" : ""),
          goalId: editingTx.goalId || "",
        },
      ]);
    }
  }, [editingTx]);

  const handleAddItem = () => {
    const lastDate =
      formItems[formItems.length - 1]?.date ||
      new Date().toISOString().split("T")[0];

    setFormItems([
      ...formItems,
      {
        description: "",
        amount: "",
        type: "expense",
        date: lastDate,
        category: "",
        goalId: "",
      },
    ]);
  };

  const handleRemoveItem = (indexToRemove: number) => {
    if (formItems.length === 1) return;
    setFormItems(formItems.filter((_, idx) => idx !== indexToRemove));
  };

  const handleInputChange = (
    index: number,
    field: keyof BulkInputItem,
    value: string,
  ) => {
    const updatedItems = [...formItems];

    // 💡 LOGIKA UTAMA: Jika berpindah tipe
    if (field === "type") {
      if (value === "income") {
        updatedItems[index].goalId = "";
        updatedItems[index].category = "PEMASUKAN"; // Kunci otomatis jika income
      } else {
        updatedItems[index].category = ""; // Kosongkan agar user milih ulang lewat dropdown jika expense
      }
    }

    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };
    setFormItems(updatedItems);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await handleSaveBulk(formItems);
      window.dispatchEvent(new Event("transaction-updated"));
      setIsModalOpen(false);
    } catch (err) {
      console.error("Gagal menyimpan transaksi bulk:", err);
    }
  };

  return (
    <main className="fixed inset-0 bg-secondary/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl p-6 md:p-8 shadow-2xl relative animate-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute right-4 top-4 text-gray-400 hover:text-secondary cursor-pointer"
        >
          <X size={20} weight="bold" />
        </button>

        <h3 className="text-lg font-black text-secondary uppercase mb-4">
          {editingTx ? "Edit Transaksi" : "Tambah Multi Transaksi"}
        </h3>

        <form
          onSubmit={onSubmit}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="space-y-6 flex-1 overflow-y-auto pr-2 no-scrollbar pb-4">
            {formItems.map((item, index) => {
              const selectedGoal = goalsList.find((g) => g.id === item.goalId);

              return (
                <div
                  key={index}
                  className="p-4 border border-secondary/10 rounded-xl space-y-3 bg-secondary/1 relative group animate-in slide-in-from-bottom-2 duration-150"
                >
                  <div className="flex justify-between items-center border-b border-secondary/5 pb-2">
                    <span className="text-[10px] font-black text-secondary/40 uppercase">
                      Item {index + 1}
                    </span>
                    {formItems.length > 1 && !editingTx && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="text-red-400 hover:text-red-500 p-1 rounded-md hover:bg-red-50 transition-all cursor-pointer"
                      >
                        <Trash size={14} weight="bold" />
                      </button>
                    )}
                  </div>

                  {/* BARIS 1: TOGGLE & DESKRIPSI */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
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

                    <div className="md:col-span-9">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            "description",
                            e.target.value,
                          )
                        }
                        placeholder="Nama transaksi (e.g. Alokasi Tabungan Laptop)"
                        className="w-full h-10 border border-gray-200 rounded-lg px-3 text-xs outline-none focus:ring-2 focus:ring-tertiary/20 bg-white text-gray-900"
                        required
                      />
                    </div>
                  </div>

                  {/* BARIS 2: TANGGAL & NOMINAL */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                    <div className="md:col-span-6">
                      <input
                        type="date"
                        value={item.date}
                        onChange={(e) =>
                          handleInputChange(index, "date", e.target.value)
                        }
                        className="w-full h-10 border border-gray-200 rounded-lg px-2 text-xs outline-none focus:ring-2 focus:ring-tertiary/20 bg-white text-gray-900"
                        required
                      />
                    </div>
                    <div className="md:col-span-6">
                      <input
                        type="number"
                        value={item.amount}
                        onChange={(e) =>
                          handleInputChange(index, "amount", e.target.value)
                        }
                        placeholder="Nominal (Rp)"
                        className="w-full h-10 border border-gray-200 rounded-lg px-3 text-xs outline-none focus:ring-2 focus:ring-tertiary/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none bg-white text-gray-900"
                        required
                      />
                    </div>
                  </div>

                  {/* 💡 BARIS 3: DROPDOWN KATEGORI & KONEKSI GOAL (Dinamis Berdasarkan Tipe) */}
                  {/* Grid disesuaikan otomatis: Jika expense terbagi 2 kolom, jika income tersembunyi */}
                  <div
                    className={`grid grid-cols-1 gap-3 ${item.type === "expense" ? "md:grid-cols-12" : "hidden"}`}
                  >
                    {/* DROPDOWN KATEGORI DEFAULT */}
                    <div className="md:col-span-6">
                      <select
                        value={item.category}
                        onChange={(e) =>
                          handleInputChange(index, "category", e.target.value)
                        }
                        className="w-full h-10 border border-gray-200 rounded-lg px-2 text-xs outline-none focus:ring-2 focus:ring-tertiary/20 bg-white text-gray-900"
                        required={item.type === "expense"}
                      >
                        <option value="">Pilih Kategori</option>
                        {EXPENSE_CATEGORIES.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* SELEKTOR HUBUNGKAN KE GOAL */}
                    <div className="md:col-span-6 relative flex flex-col justify-start">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveGoalDropdown(
                            activeGoalDropdown === index ? null : index,
                          )
                        }
                        className={`w-full h-10 px-3 rounded-lg border text-xs font-bold flex items-center justify-between gap-1 transition-all cursor-pointer ${
                          item.goalId
                            ? "bg-tertiary/10 border-tertiary text-tertiary"
                            : "border-dashed border-gray-300 text-gray-400 hover:border-gray-400 hover:text-secondary"
                        }`}
                      >
                        <span className="truncate text-[11px]">
                          {item.goalId
                            ? `Goal: ${selectedGoal?.title || "Terpilih"}`
                            : "Hubungkan ke Goal"}
                        </span>
                        {item.goalId && (
                          <X
                            size={14}
                            weight="bold"
                            className="hover:text-red-500 cursor-pointer shrink-0 ml-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleInputChange(index, "goalId", "");
                              setActiveGoalDropdown(null);
                            }}
                          />
                        )}
                      </button>

                      {activeGoalDropdown === index && (
                        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-secondary/10 rounded-xl shadow-xl z-20 max-h-40 overflow-y-auto p-1 text-left animate-in fade-in slide-in-from-top-1 duration-100">
                          <p className="text-[9px] font-black uppercase text-secondary/30 px-2 py-1 border-b border-secondary/5 tracking-wider">
                            Pilih Target Finansial:
                          </p>
                          {goalsList.length === 0 ? (
                            <p className="text-[11px] text-gray-400 p-2 text-center">
                              Belum ada target goals aktif.
                            </p>
                          ) : (
                            goalsList.map((goal) => (
                              <button
                                key={goal.id}
                                type="button"
                                onClick={() => {
                                  handleInputChange(index, "goalId", goal.id);
                                  setActiveGoalDropdown(null);
                                }}
                                className={`w-full text-left px-2.5 py-2 text-xs rounded-lg flex items-center justify-between hover:bg-secondary/5 transition-all cursor-pointer font-medium ${
                                  item.goalId === goal.id
                                    ? "text-tertiary font-bold bg-tertiary/5"
                                    : "text-secondary"
                                }`}
                              >
                                <span className="truncate">{goal.title}</span>
                              </button>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {!editingTx && (
              <button
                type="button"
                onClick={handleAddItem}
                className="w-full py-2.5 border-2 border-dashed border-secondary/20 hover:border-tertiary text-secondary/60 hover:text-tertiary rounded-xl text-xs font-black uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer bg-white"
              >
                <Plus size={14} weight="bold" />
                Tambah Baris Transaksi
              </button>
            )}
          </div>

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
