"use client";

import TransactionsForm from "@/components/form/TransactionsForm";
import {
  PencilSimple,
  Plus,
  Trash,
  CaretLeft,
  CaretRight,
  Funnel,
} from "@phosphor-icons/react";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/popup/Toast";

interface BulkInputItem {
  description: string;
  amount: string;
  type: "income" | "expense";
  date: string;
  category: string; // 👈 Menampung kategori default
  goalId?: string;
}

interface TransactionItem {
  id: string;
  description: string;
  amount: number;
  date: string;
  category?: string | null; // 👈 Properti Baru dari database Prisma
  financialTargetId?: string | null;
}

interface TransactionsProps {
  onTransactionChange?: () => void;
}

// Daftar kategori default yang selaras dengan database dan form Anda
const FILTER_CATEGORIES = [
  { value: "MAKANAN_MINUMAN", label: "Makanan & Minuman" },
  { value: "TAGIHAN", label: "Tagihan" },
  { value: "TRANSPORTASI", label: "Transportasi" },
  { value: "PENDIDIKAN", label: "Pendidikan" },
  { value: "KESEHATAN", label: "Kesehatan" },
  { value: "HIBURAN_GAYA_HIDUP", label: "Hiburan & Gaya Hidup" },
  { value: "BELANJA_FASHION", label: "Belanja & Fashion" },
  { value: "HOBI", label: "Hobi" },
  { value: "INVESTASI_TABUNGAN", label: "Investasi & Tabungan" },
  { value: "LAIN_LAIN", label: "Lain-lain" },
];

export default function TransactionHistory({
  onTransactionChange,
}: TransactionsProps) {
  const [isManaging, setIsManaging] = useState(false);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 🛠️ STATE FILTER & SORTING
  const [timeFilter, setTimeFilter] = useState<"bulan-ini" | "semua">(
    "bulan-ini",
  );
  const [typeFilter, setTypeFilter] = useState<
    "semua" | "pemasukan" | "pengeluaran"
  >("semua");
  const [categoryFilter, setCategoryFilter] = useState<"semua" | string>(
    "semua",
  ); // 👈 State Baru untuk Filter Kategori
  const [sortFilter, setSortFilter] = useState<
    "default" | "terendah" | "tertinggi"
  >("default");

  // State Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // State Modal & Form Input
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<TransactionItem | null>(null);
  const { addToast } = useToast();

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
      fetchTransactions();
      onTransactionChange?.();
    };
    window.addEventListener("goal-updated", handleGoalUpdate);
    return () => window.removeEventListener("goal-updated", handleGoalUpdate);
  }, [onTransactionChange]);

  // ========================================================
  // 🛠️ LOGIKA FILTER DAN SORTING LENGKAP + KATEGORI
  // ========================================================
  const filteredAndSortedTransactions = transactions
    .filter((tx) => {
      // 1. Filter Berdasarkan Waktu
      if (timeFilter === "bulan-ini") {
        const txDate = new Date(tx.date);
        const now = new Date();
        if (
          txDate.getMonth() !== now.getMonth() ||
          txDate.getFullYear() !== now.getFullYear()
        ) {
          return false;
        }
      }

      // 2. Filter Berdasarkan Jenis (Pemasukan / Pengeluaran)
      if (typeFilter === "pemasukan" && tx.amount < 0) return false;
      if (typeFilter === "pengeluaran" && tx.amount >= 0) return false;

      // 3. Filter Berdasarkan Kategori 👈 Logika Baru
      if (categoryFilter !== "semua" && tx.category !== categoryFilter) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      // 4. Sorting Berdasarkan Nilai Mutlak (Math.abs)
      if (sortFilter === "terendah") {
        return Math.abs(a.amount) - Math.abs(b.amount);
      }
      if (sortFilter === "tertinggi") {
        return Math.abs(b.amount) - Math.abs(a.amount);
      }
      return 0; // default (terkini dari API)
    });

  // --- LOGIKA HITUNGAN PAGINATION ---
  const totalPages = Math.ceil(
    filteredAndSortedTransactions.length / itemsPerPage,
  );
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = filteredAndSortedTransactions.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  // Reset ke halaman 1 jika filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [timeFilter, typeFilter, categoryFilter, sortFilter]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [filteredAndSortedTransactions, totalPages, currentPage]);
  // --------------------------------------------------------

  const openAddModal = () => {
    setEditingTx(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: TransactionItem) => {
    if (!item.id) return;
    setEditingTx({
      id: item.id,
      description: item.description,
      amount: item.amount,
      date: item.date,
      category: item.category || null,
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
        if (!res.ok) throw new Error("Gagal memperbarui transaksi");
        addToast({
          title: "Berhasil",
          description: "Transaksi berhasil diperbarui!",
          variant: "success",
        });
      } else {
        const res = await fetch("/api/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(items),
        });
        if (!res.ok) throw new Error("Gagal menyimpan data transaksi");
        addToast({
          title: "Berhasil",
          description: `Berhasil menyimpan ${items.length} transaksi!`,
          variant: "success",
        });
      }

      await fetchTransactions();
      onTransactionChange?.();
      window.dispatchEvent(new Event("transaction-updated"));
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      const res = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setTransactions(transactions.filter((t) => t.id !== id));
        onTransactionChange?.();
        window.dispatchEvent(new Event("transaction-updated"));
        addToast({
          title: "Terhapus",
          description: `Transaksi "${name}" berhasil dihapus.`,
          variant: "delete",
        });
      } else {
        throw new Error("Gagal menghapus transaksi");
      }
    } catch (err: any) {
      addToast({
        title: "Kesalahan",
        description: err.message || "Gagal menghapus transaksi.",
        variant: "error",
      });
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
        {/* HEADER UTAMA */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
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
            className={`text-${isManaging ? "red-500" : "tertiary"} text-xs md:text-sm font-black uppercase hover:underline transition-all whitespace-nowrap text-left cursor-pointer`}
          >
            {isManaging ? "Selesai" : "Kelola Transaksi"}
          </button>
        </div>

        {/* 🛠️ BARIS PANEL FILTER (UPDATE: SEKARANG ADA 4 SELECT DROPDOWN) */}
        <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-6 p-3 bg-secondary/2 rounded-xl border border-secondary/5">
          <div className="flex items-center gap-1.5 text-secondary/40 text-[11px] font-bold uppercase tracking-wider pl-1">
            <Funnel size={14} weight="bold" />
            <span>Filter:</span>
          </div>

          {/* Dropdown 1: Rentang Waktu */}
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value as any)}
            className="bg-white text-secondary text-xs font-bold py-1.5 px-2.5 rounded-md border border-secondary/10 shadow-sm focus:outline-none focus:border-tertiary cursor-pointer"
          >
            <option value="bulan-ini">Bulan Ini</option>
            <option value="semua">Semua Riwayat</option>
          </select>

          {/* Dropdown 2: Jenis Transaksi */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="bg-white text-secondary text-xs font-bold py-1.5 px-2.5 rounded-md border border-secondary/10 shadow-sm focus:outline-none focus:border-tertiary cursor-pointer"
          >
            <option value="semua">Semua Jenis</option>
            <option value="pemasukan">Pemasukan</option>
            <option value="pengeluaran">Pengeluaran</option>
          </select>

          {/* Dropdown 3: Kategori (BARU) */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-white text-secondary text-xs font-bold py-1.5 px-2.5 rounded-md border border-secondary/10 shadow-sm focus:outline-none focus:border-tertiary cursor-pointer max-w-45"
          >
            <option value="semua">Semua Kategori</option>
            {FILTER_CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>

          {/* Dropdown 4: Urutan Nominal */}
          <select
            value={sortFilter}
            onChange={(e) => setSortFilter(e.target.value as any)}
            className="bg-white text-secondary text-xs font-bold py-1.5 px-2.5 rounded-md border border-secondary/10 shadow-sm focus:outline-none focus:border-tertiary cursor-pointer"
          >
            <option value="default">Urutan: Terbaru</option>
            <option value="terendah">Nominal: Terendah</option>
            <option value="tertinggi">Nominal: Tertinggi</option>
          </select>
        </div>

        {/* DAFTAR TRANSAKSI */}
        <div className="space-y-4">
          {filteredAndSortedTransactions.length === 0 ? (
            <p className="text-center text-xs text-gray-400 py-6 font-medium">
              Tidak ada data transaksi yang cocok dengan filter.
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
                    <div className="mt-0.5 flex items-center gap-2">
                      <span className="text-[8px] md:text-[9px] font-medium text-secondary/30 block whitespace-nowrap">
                        {formatDate(item.date)}
                      </span>
                      {item.category && (
                        <>
                          <span className="text-[9px] text-secondary/20">
                            •
                          </span>
                          <span className="text-[8px] md:text-[9px] font-bold text-tertiary uppercase bg-tertiary/5 px-1.5 py-0.5 rounded tracking-wider">
                            {item.category.replace("_", " ")}
                          </span>
                        </>
                      )}
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

        {/* PAGINATION PANEL */}
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

      {/* FORM MODAL */}
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
                  category: editingTx.category || null,
                  goalId: editingTx.financialTargetId || null,
                }
              : null
          }
          handleSaveBulk={handleSaveBulk}
        />
      )}
    </main>
  );
}
