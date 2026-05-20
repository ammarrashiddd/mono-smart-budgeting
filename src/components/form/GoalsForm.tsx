import { X } from "@phosphor-icons/react";
import type { Dispatch, SetStateAction, FormEvent } from "react";

interface GoalsFormProps {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  editingGoal: {
    id: string;
    title: string;
    targetAmount: number;
    currentAmount: number;
  } | null;
  handleSave: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  inputTitle: string;
  setInputTitle: Dispatch<SetStateAction<string>>;
  inputTarget: string;
  setInputTarget: Dispatch<SetStateAction<string>>;
  inputCurrent: string;
  setInputCurrent: Dispatch<SetStateAction<string>>;
}

export default function GoalsForm({
  isModalOpen,
  setIsModalOpen,
  editingGoal,
  handleSave,
  inputTitle,
  setInputTitle,
  inputTarget,
  setInputTarget,
  inputCurrent,
  setInputCurrent,
}: GoalsFormProps) {
  return (
    <main className="fixed inset-0 bg-secondary/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 md:p-8 shadow-2xl relative animate-in zoom-in-95 duration-150">
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute right-4 top-4 text-gray-400 hover:text-secondary cursor-pointer"
        >
          <X size={20} weight="bold" />
        </button>

        <h3 className="text-lg font-black text-secondary uppercase tracking-tight mb-6">
          {editingGoal ? "Edit Tujuan Keuangan" : "Tambah Tujuan Keuangan"}
        </h3>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
              Nama Target
            </label>
            <input
              type="text"
              value={inputTitle}
              onChange={(e) => setInputTitle(e.target.value)}
              placeholder="Misal: Tabungan Laptop"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-tertiary/20"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
              Nominal Target (Rp)
            </label>
            <input
              type="number"
              value={inputTarget}
              onChange={(e) => setInputTarget(e.target.value)}
              placeholder="5000000"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-tertiary/20"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
              Dana Terkumpul Saat Ini (Rp)
            </label>
            <input
              type="number"
              value={inputCurrent}
              onChange={(e) => setInputCurrent(e.target.value)}
              placeholder="0"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-tertiary/20"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 border border-gray-200 text-gray-500 text-sm font-bold py-3 rounded-xl hover:bg-gray-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 bg-tertiary text-primary text-sm font-black py-3 rounded-xl hover:opacity-90 shadow-lg shadow-tertiary/20 cursor-pointer"
            >
              Simpan Target
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
