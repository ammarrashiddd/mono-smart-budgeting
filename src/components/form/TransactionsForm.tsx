import { X } from "@phosphor-icons/react";
import type { Dispatch, SetStateAction, FormEvent } from "react";

interface TransactionsFormProps {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  editingTx: {
    id: string;
    description: string;
    amount: number;
    date: string;
  } | null;
  handleSave: (e: FormEvent) => Promise<void>;
  inputName: string;
  setInputName: Dispatch<SetStateAction<string>>;
  inputAmount: string;
  setInputAmount: Dispatch<SetStateAction<string>>;
  inputType: "income" | "expense";
  setInputType: Dispatch<SetStateAction<"income" | "expense">>;
  inputDate: string;
  setInputDate: Dispatch<SetStateAction<string>>;
}

export default function TransactionsForm({
  isModalOpen,
  setIsModalOpen,
  editingTx,
  handleSave,
  inputName,
  setInputName,
  inputAmount,
  setInputAmount,
  inputType,
  setInputType,
  inputDate,
  setInputDate,
}: TransactionsFormProps) {
  return (
    <main className="fixed inset-0 bg-secondary/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 md:p-8 shadow-2xl relative animate-in zoom-in-95 duration-150">
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute right-4 top-4 text-gray-400 hover:text-secondary cursor-pointer"
        >
          <X size={20} weight="bold" />
        </button>

        <h3 className="text-lg font-black text-secondary uppercase mb-6 tracking-tight">
          {editingTx ? "Edit Transaksi" : "Tambah Transaksi"}
        </h3>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
              Tipe Transaksi
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setInputType("expense")}
                className={`py-2 text-sm font-bold rounded-xl border ${inputType === "expense" ? "bg-red-50 border-red-500 text-red-600" : "border-gray-200 text-gray-500"} cursor-pointer`}
              >
                Pengeluaran
              </button>
              <button
                type="button"
                onClick={() => setInputType("income")}
                className={`py-2 text-sm font-bold rounded-xl border ${inputType === "income" ? "bg-green-50 border-green-500 text-green-600" : "border-gray-200 text-gray-500"} cursor-pointer`}
              >
                Pemasukan
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
              Nama Transaksi
            </label>
            <input
              type="text"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              placeholder="Misal: Starbucks Coffee"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-tertiary/20"
              required
            />
          </div>

          {/* Elemen Kategori dihapus, diganti input full-width untuk Tanggal */}
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
              Tanggal
            </label>
            <input
              type="date"
              value={inputDate}
              onChange={(e) => setInputDate(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-tertiary/20"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
              Nominal (Rp)
            </label>
            <input
              type="number"
              value={inputAmount}
              onChange={(e) => setInputAmount(e.target.value)}
              placeholder="55000"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-tertiary/20"
              required
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
              className="flex-1 bg-tertiary text-primary text-sm font-black py-3 rounded-xl hover:opacity-90 cursor-pointer"
            >
              Simpan Transaksi
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
