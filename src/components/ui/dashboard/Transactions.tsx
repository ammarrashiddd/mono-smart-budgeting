"use client";

import TransactionsForm from "@/components/form/TransactionsForm";
import {
  PencilSimple,
  Plus,
  Trash,
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react"; // Menambahkan ikon navigasi halaman
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

  // State untuk mengontrol halaman pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Batasan jumlah data per halaman

  // State Modal & Form Input
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

  // --- LOGIKA HITUNGAN PAGINATION ---
  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  // Mengambil potongan data transaksi sesuai halaman aktif
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = transactions.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  // Reset ke halaman 1 jika setelah operasi CRUD jumlah halaman menyusut
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [transactions, totalPages, currentPage]);
  // ----------------------------------

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

  const handleSaveBulk = async (items: any[]) => {
    try {
      if (editingTx) {
        // Jika edit data tunggal biasa
        const item = items[0];
        const normalizedAmount =
          item.type === "expense"
            ? -Math.abs(parseFloat(item.amount))
            : Math.abs(parseFloat(item.amount));

        await fetch(`/api/transactions/${editingTx.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            description: item.description,
            amount: normalizedAmount,
            date: item.date,
          }),
        });
      } else {
        // Jika simpan data banyak sekaligus, tembak API dengan Promise.all agar efisien
        await Promise.all(
          items.map((item) => {
            const normalizedAmount =
              item.type === "expense"
                ? -Math.abs(parseFloat(item.amount))
                : Math.abs(parseFloat(item.amount));
            return fetch("/api/transactions", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                description: item.description,
                amount: normalizedAmount,
                date: item.date,
              }),
            });
          }),
        );
      }

      fetchTransactions(); // Segarkan riwayat tabel
      onTransactionChange?.(); // Picu ulang grafik & statistik
      setIsModalOpen(false);
    } catch (err) {
      console.error("Gagal menyimpan bulk transaksi:", err);
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
                className="flex items-center gap-1 bg-tertiary text-primary px-3 py-1.5 rounded-md text-[10px] font-black uppercase hover:opacity-90 transition-all cursor-pointer"
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
            // Merender data dari potongan halaman aktif (currentTransactions) bukan transactions utuh
            currentTransactions.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-2 rounded-xl hover:bg-secondary/2 transition-all border-b border-secondary/5 last:border-0"
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

        {/* --- TOMBOL NAVIGASI PAGINATION --- */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-8 pt-4 border-t border-secondary/5 text-xs font-bold text-secondary/60">
            <p>
              Halaman <span className="text-secondary">{currentPage}</span> dari{" "}
              <span className="text-secondary">{totalPages}</span>
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border border-secondary/10 rounded-lg hover:bg-secondary/5 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-all"
              >
                <CaretLeft size={14} weight="bold" />
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev - 1 + 2, totalPages))
                }
                disabled={currentPage === totalPages}
                className="p-2 border border-secondary/10 rounded-lg hover:bg-secondary/5 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-all"
              >
                <CaretRight size={14} weight="bold" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* FORM MODAL INPUT TRANSAKSI */}
      {isModalOpen && (
        <TransactionsForm
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          editingTx={editingTx}
          handleSaveBulk={handleSaveBulk}
        />
      )}
    </main>
  );
}
