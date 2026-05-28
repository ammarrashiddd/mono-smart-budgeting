"use client";

import TransactionsForm from "@/components/form/TransactionsForm";
import {
  PencilSimple,
  Plus,
  Trash,
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react";
import { useState, useEffect } from "react";

// Menambahkan interface yang dibutuhkan parameter handleSaveBulk
interface BulkInputItem {
  description: string;
  amount: string;
  type: "income" | "expense";
  date: string;
  goalId?: string;
}

interface TransactionItem {
  id: string;
  description: string;
  amount: number;
  date: string;
  financialTargetId?: string | null; // Tambahkan ini agar aman saat dikirim ke form edit
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
  const itemsPerPage = 5;

  // State Modal & Form Input
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<TransactionItem | null>(null);

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

  useEffect(() => {
    const handleGoalUpdate = () => {
      console.log("Sinyal goal diterima! Merefresh data transaksi...");
      fetchTransactions();
      onTransactionChange?.();
    };

    window.addEventListener("goal-updated", handleGoalUpdate);

    return () => {
      window.removeEventListener("goal-updated", handleGoalUpdate);
    };
  }, [onTransactionChange]);

  // --- LOGIKA HITUNGAN PAGINATION ---
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = transactions.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [transactions, totalPages, currentPage]);
  // ----------------------------------

  const openAddModal = () => {
    setEditingTx(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: TransactionItem) => {
    if (!item.id) {
      console.error("Item edit tidak memiliki id", item);
      return;
    }
    // Mapping format data agar sesuai dengan apa yang dituntut TransactionsFormProps.editingTx
    setEditingTx({
      id: item.id,
      description: item.description,
      amount: item.amount,
      date: item.date,
      financialTargetId: item.financialTargetId || null,
    });
    setIsModalOpen(true);
  };

  const handleSaveBulk = async (items: BulkInputItem[]) => {
    try {
      if (editingTx) {
        const res = await fetch(`/api/transactions/${editingTx.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(items),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || "Gagal memperbarui transaksi");
        }
        alert("Transaksi berhasil diperbarui!");
      } else {
        const res = await fetch("/api/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(items),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || "Gagal menyimpan data transaksi");
        }
        alert(`Berhasil menyimpan ${items.length} transaksi!`);
      }

      // 🔥 PERBAIKAN UTAMA: Ambil data terbaru dari database agar UI langsung ter-update otomatis
      await fetchTransactions();

      // Beritahu komponen parent (Dashboard) dan widget target keuangan (Goals)
      onTransactionChange?.();
      window.dispatchEvent(new Event("transaction-updated"));
    } catch (error: any) {
      console.error("Gagal menyimpan transaksi:", error);
      throw error;
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
          window.dispatchEvent(new Event("transaction-updated"));
        } else {
          const contentType = res.headers.get("content-type");
          let errorMessage = "Gagal menghapus transaksi";

          if (contentType && contentType.includes("application/json")) {
            const errData = await res.json();
            errorMessage = errData.message || errorMessage;
          } else {
            errorMessage = `Server merespons dengan status ${res.status}`;
          }
          throw new Error(errorMessage);
        }
      } catch (err: any) {
        console.error("Gagal menghapus transaksi:", err);
        alert(`Terjadi kesalahan: ${err.message}`);
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
            currentTransactions.map((item) => (
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
                      <span className="text-[8px] md:text-[9px] font-medium text-secondary/30 block">
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
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
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
          editingTx={
            editingTx
              ? {
                  id: editingTx.id,
                  description: editingTx.description,
                  amount: editingTx.amount,
                  date: editingTx.date,
                  goalId: editingTx.financialTargetId || null, // mapping agar match dengan interface TransactionsFormProps
                }
              : null
          }
          handleSaveBulk={handleSaveBulk}
        />
      )}
    </main>
  );
}
