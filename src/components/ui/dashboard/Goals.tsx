"use client";

import { PencilSimple, Plus, Trash } from "@phosphor-icons/react";
import { useState, useEffect } from "react";
import GoalsForm from "@/components/form/GoalsForm";
import { useToast } from "@/components/ui/popup/Toast";

interface GoalItem {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
}

interface GoalsProps {
  onGoalChange?: () => void;
}

export default function Goals({ onGoalChange }: GoalsProps) {
  const [isManaging, setIsManaging] = useState(false);
  const [goals, setGoals] = useState<GoalItem[]>([]);
  const [loading, setLoading] = useState(true);

  // State Kontrol Modal & Form Input
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<GoalItem | null>(null);
  const [inputTitle, setInputTitle] = useState("");
  const [inputTarget, setInputTarget] = useState("");
  const [inputCurrent, setInputCurrent] = useState("");
  const { addToast } = useToast();

  // Fetch data dari API ketika komponen di-render
  const fetchGoals = async () => {
    try {
      const res = await fetch("/api/goals");
      if (res.ok) {
        const data = await res.json();
        setGoals(data);
      }
    } catch (err) {
      console.error("Gagal memuat data tujuan keuangan:", err);
    } finally {
      setLoading(false);
    }
  };

  // 1. UTAMA: Jalankan fetch saat pertama kali render
  useEffect(() => {
    fetchGoals();
  }, []);

  // 2. SOLUSI AUTO REFRESH: Dengarkan event global dari komponen Transaksi
  useEffect(() => {
    const handleTransactionUpdate = () => {
      console.log("Sinyal transaksi diterima! Merefresh data goals...");
      fetchGoals(); // Mengambil ulang data persentase & nominal goals dari database
    };

    // Daftarkan pendengar event
    window.addEventListener("transaction-updated", handleTransactionUpdate);

    // Bersihkan listener saat komponen dibongkar (unmount) untuk menghindari memory leak
    return () => {
      window.removeEventListener(
        "transaction-updated",
        handleTransactionUpdate,
      );
    };
  }, []);

  const openAddModal = () => {
    setEditingGoal(null);
    setInputTitle("");
    setInputTarget("");
    setInputCurrent("0");
    setIsModalOpen(true);
  };

  const openEditModal = (item: GoalItem) => {
    setEditingGoal(item);
    setInputTitle(item.title);
    setInputTarget(item.targetAmount.toString());
    setInputCurrent(item.currentAmount.toString());
    setIsModalOpen(true);
  };

  // Aksi Simpan (Tambah / Edit) ke Database via API
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputTitle || !inputTarget) {
      addToast({
        title: "Data Belum Lengkap",
        description: "Kolom Nama dan Target wajib diisi!",
        variant: "error",
      });
      return;
    }

    const payload = {
      title: inputTitle,
      targetAmount: parseFloat(inputTarget),
      currentAmount: parseFloat(inputCurrent || "0"),
    };

    try {
      if (editingGoal) {
        // Mode Edit (PUT)
        const res = await fetch(`/api/goals/${editingGoal.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          fetchGoals();
          window.dispatchEvent(new Event("goal-updated"));
          onGoalChange?.();
          addToast({
            title: "Berhasil",
            description: "Target keuangan berhasil diperbarui.",
            variant: "success",
          });
        } else {
          throw new Error("Gagal memperbarui target");
        }
      } else {
        // Mode Tambah Baru (POST)
        const res = await fetch("/api/goals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          fetchGoals();
          window.dispatchEvent(new Event("goal-updated"));
          onGoalChange?.();
          addToast({
            title: "Berhasil",
            description: "Target keuangan berhasil disimpan.",
            variant: "success",
          });
        } else {
          throw new Error("Gagal menyimpan target");
        }
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error("Gagal menyimpan data:", err);
      addToast({
        title: "Kesalahan Data",
        description: "Gagal menyimpan target keuangan.",
        variant: "error",
      });
    }
  };

  // Aksi Hapus dari Database via API
  const handleDelete = async (id: string, title: string) => {
    try {
      const res = await fetch(`/api/goals/${id}`, { method: "DELETE" });

      if (res.ok) {
        setGoals(goals.filter((g) => g.id !== id));
        window.dispatchEvent(new Event("goal-updated"));
        onGoalChange?.();

        // Toast Berhasil
        addToast({
          title: "Terhapus",
          description: `Target "${title}" berhasil dihapus.`,
          variant: "delete",
        });
      } else {
        throw new Error("Gagal menghapus target");
      }
    } catch (err: any) {
      console.error("Gagal menghapus data:", err);

      // Toast Gagal
      addToast({
        title: "Kesalahan",
        description: err.message || "Gagal menghapus target.",
        variant: "error",
      });
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 md:p-10 border border-secondary/5 shadow-xl animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-8 bg-gray-200 rounded"></div>
        <div className="h-8 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <main>
      <div className="bg-white rounded-lg p-6 md:p-10 border border-secondary/5 shadow-xl shadow-secondary/5">
        <div className="flex flex-row items-center justify-between mb-8 md:mb-12">
          <div className="flex items-center gap-3">
            <h3 className="text-xs md:text-base font-black uppercase text-secondary">
              Tujuan Keuangan
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
            className={`text-xs md:text-base font-black uppercase hover:underline hover:cursor-pointer transition-all whitespace-nowrap ${
              isManaging ? "text-red-500" : "text-tertiary"
            }`}
          >
            {isManaging ? "Selesai" : "Kelola Target"}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:gap-8">
          {goals.length === 0 ? (
            <p className="text-center text-xs text-gray-400 py-6 font-medium">
              Belum ada tujuan keuangan yang dibuat.
            </p>
          ) : (
            goals.map((item) => {
              const progress = Math.min(
                (item.currentAmount / item.targetAmount) * 100,
                100,
              );
              return (
                <div className="group" key={item.id}>
                  <div className="flex flex-row justify-between sm:items-end mb-3 gap-1 sm:gap-0">
                    <p className="text-sm md:text-base font-bold text-secondary tracking-tight truncate">
                      {item.title}
                    </p>

                    <div className="flex items-center justify-between sm:justify-end gap-3 min-h-5">
                      {isManaging ? (
                        <div className="flex items-center gap-2 animate-in fade-in duration-200">
                          <button
                            onClick={() => openEditModal(item)}
                            className="p-1 text-secondary/40 hover:text-tertiary hover:bg-secondary/5 rounded-md transition-all cursor-pointer"
                            title="Edit Target"
                          >
                            <PencilSimple size={16} weight="bold" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, item.title)}
                            className="p-1 text-secondary/40 hover:text-red-500 hover:bg-red-50 rounded-md transition-all cursor-pointer"
                            title="Hapus Target"
                          >
                            <Trash size={16} weight="bold" />
                          </button>
                        </div>
                      ) : (
                        <p className="text-[10px] md:text-xs font-black text-tertiary uppercase flex items-center animate-in fade-in duration-200">
                          <span className="bg-tertiary/10 px-2 py-0.5 rounded-md mr-2 sm:mr-0 sm:bg-transparent sm:px-0">
                            {Math.round(progress)}%
                          </span>
                          <span className="hidden sm:inline mx-1 text-secondary/20">
                            •
                          </span>
                          <span className="text-secondary/60 sm:text-tertiary">
                            Rp{" "}
                            {new Intl.NumberFormat("id-ID").format(
                              item.currentAmount,
                            )}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2 md:h-2.5 w-full bg-secondary/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-tertiary rounded-full transition-all duration-500 ease-out shadow-[0_0_8px_rgba(30,86,205,0.4)]"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  {/* Target Info */}
                  <p className="text-[8px] md:text-[10px] font-medium text-secondary/80 mt-1.5 uppercase text-right">
                    Target: Rp{" "}
                    {new Intl.NumberFormat("id-ID").format(item.targetAmount)}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* MODAL FORM MODAL OVERLAY */}
      {isModalOpen && (
        <GoalsForm
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          editingGoal={editingGoal}
          handleSave={handleSave}
          inputTitle={inputTitle}
          setInputTitle={setInputTitle}
          inputTarget={inputTarget}
          setInputTarget={setInputTarget}
          inputCurrent={inputCurrent}
          setInputCurrent={setInputCurrent}
        />
      )}
    </main>
  );
}
