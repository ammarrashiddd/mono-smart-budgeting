"use client";

import TransactionsForm from "@/components/form/TransactionsForm";
import { PencilSimple, Plus, Trash, X } from "@phosphor-icons/react";
import { useState, useEffect } from "react";

interface TransactionItem {
  id: string;
  description: string;
  amount: number;
  date: string;
}

interface TransactionsProps {
  onTransactionChange?: () => void;
}

export default function TransactionHistory({
  onTransactionChange,
}: TransactionsProps) {
  const [isManaging, setIsManaging] = useState(false);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [loading, setLoading] = useState(true);

  // State Modal & Form Input (State category dihapus)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<TransactionItem | null>(null);
  const [inputName, setInputName] = useState("");
  const [inputAmount, setInputAmount] = useState("");
  const [inputType, setInputType] = useState<"income" | "expense">("expense");
  const [inputDate, setInputDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const fetchTransactions = async () => {
    try {
      const res = await fetch("/api/transactions");
      if (res.ok) {
        const data = await res.json();
        setTransactions(data);
      }
    } catch (err) {
      console.error("Gagal memuat transaksi:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const openAddModal = () => {
    setEditingTx(null);
    setInputName("");
    setInputAmount("");
    setInputType("expense");
    setInputDate(new Date().toISOString().split("T")[0]);
    setIsModalOpen(true);
  };

  const openEditModal = (item: TransactionItem) => {
    if (!item.id) {
      console.error("Item edit tidak memiliki id", item);
      return;
    }

    setEditingTx(item);
    setInputName(item.description);
    setInputAmount(Math.abs(item.amount).toString());
    setInputType(item.amount >= 0 ? "income" : "expense");
    setInputDate(new Date(item.date).toISOString().split("T")[0]);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const amountValue = parseFloat(inputAmount);
    const normalizedAmount =
      inputType === "expense" ? -Math.abs(amountValue) : Math.abs(amountValue);

    const payload = {
      description: inputName,
      amount: normalizedAmount,
      date: inputDate,
    };

    try {
      if (editingTx) {
        if (!editingTx.id) {
          console.error(
            "Tidak bisa edit transaksi: id tidak tersedia",
            editingTx,
          );
          return;
        }

        const res = await fetch(`/api/transactions/${editingTx.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          fetchTransactions();
          onTransactionChange?.();
        } else {
          console.error("PUT Transaction failed", res.status, await res.text());
        }
      } else {
        const res = await fetch("/api/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          fetchTransactions();
          onTransactionChange?.();
        } else {
          console.error(
            "POST Transaction failed",
            res.status,
            await res.text(),
          );
        }
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error("Gagal menyimpan transaksi:", err);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Hapus transaksi "${name}"?`)) {
      try {
        const res = await fetch(`/api/transactions/${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setTransactions(transactions.filter((t) => t.id !== id));
          onTransactionChange?.();
        }
      } catch (err) {
        console.error("Gagal menghapus transaksi:", err);
      }
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 border border-secondary/5 shadow-xl animate-pulse space-y-3">
        <div className="h-5 bg-gray-200 rounded w-1/5"></div>
        <div className="h-12 bg-gray-100 rounded"></div>
      </div>
    );
  }

  return (
    <main>
      <div className="bg-white rounded-lg p-6 md:p-10 border border-secondary/5 shadow-xl shadow-secondary/5">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <h3 className="text-xs md:text-base font-black uppercase text-secondary">
              Transaksi
            </h3>
            {isManaging && (
              <button
                onClick={openAddModal}
                className="flex items-center gap-1 bg-tertiary text-primary px-3 py-1.5 rounded-md text-[10px] font-black uppercase hover:opacity-90 transition-all cursor-pointer animate-in fade-in slide-in-from-left-2 duration-200"
              >
                Tambah
              </button>
            )}
          </div>
          <button
            onClick={() => setIsManaging(!isManaging)}
            className={`text-${isManaging ? "red-500" : "tertiary"} text-xs md:text-base font-black uppercase hover:underline transition-all whitespace-nowrap cursor-pointer`}
          >
            {isManaging ? "Selesai" : "Kelola Transaksi"}
          </button>
        </div>

        <div className="space-y-4">
          {transactions.length === 0 ? (
            <p className="text-center text-xs text-gray-400 py-6 font-medium">
              Belum ada riwayat transaksi.
            </p>
          ) : (
            transactions.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-2 rounded-xl hover:bg-secondary/2 transition-all"
              >
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="max-w-30 sm:max-w-none">
                    <p className="text-sm md:text-base font-bold text-secondary tracking-tight truncate">
                      {item.description}
                    </p>
                    <div className="mt-0.5">
                      <span className="text-[8px] md:text-[9px] font-medium text-secondary/30 hidden sm:block">
                        {formatDate(item.date)}
                      </span>
                    </div>
                  </div>
                </div>

                {isManaging ? (
                  <div className="flex items-center gap-2 animate-in fade-in duration-200">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1 text-secondary/40 hover:text-tertiary hover:bg-secondary/5 rounded-md transition-all cursor-pointer"
                      title="Edit Transaksi"
                    >
                      <PencilSimple size={16} weight="bold" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.description)}
                      className="p-1 text-secondary/40 hover:text-red-500 hover:bg-red-50 rounded-md transition-all cursor-pointer"
                      title="Hapus Transaksi"
                    >
                      <Trash size={16} weight="bold" />
                    </button>
                  </div>
                ) : (
                  <div className="text-right">
                    <p
                      className={`text-sm md:text-lg font-black tracking-tighter ${item.amount >= 0 ? "text-green-600" : "text-red-500"}`}
                    >
                      {item.amount >= 0 ? "+" : "-"}
                      {new Intl.NumberFormat("id-ID").format(
                        Math.abs(item.amount),
                      )}
                    </p>
                    <p className="text-[8px] md:text-[9px] font-bold text-secondary/80 uppercase tracking-widest">
                      IDR
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* FORM MODAL INPUT TRANSAKSI */}
      {isModalOpen && (
        <TransactionsForm
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          editingTx={editingTx}
          handleSave={handleSave}
          inputName={inputName}
          setInputName={setInputName}
          inputAmount={inputAmount}
          setInputAmount={setInputAmount}
          inputType={inputType}
          setInputType={setInputType}
          inputDate={inputDate}
          setInputDate={setInputDate}
        />
      )}
    </main>
  );
}
