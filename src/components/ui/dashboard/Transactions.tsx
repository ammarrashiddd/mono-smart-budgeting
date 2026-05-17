export default function TransactionHistory() {
  const transactions = [
    {
      id: 1,
      name: "Starbucks Coffee",
      date: "15 May 2026",
      category: "Lifestyle",
      amount: 55000,
      type: "expense",
    },
    {
      id: 2,
      name: "Listrik & Air",
      date: "05 May 2026",
      category: "Bills",
      amount: 450000,
      type: "expense",
    },
    {
      id: 3,
      name: "Subscription Netflix",
      date: "10 May 2026",
      category: "Entertainment",
      amount: 186000,
      type: "expense",
    },
    {
      id: 4,
      name: "Subscription Netflix",
      date: "10 May 2026",
      category: "Entertainment",
      amount: 186000,
      type: "income",
    },
  ];

  return (
    <main>
      <div className="bg-white rounded-lg p-6 md:p-10 border border-secondary/5 shadow-xl shadow-secondary/5">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-secondary">
            Transaksi
          </h3>
          <button className="text-tertiary text-[10px] md:text-xs font-black uppercase tracking-widest hover:underline transition-all whitespace-nowrap">
            Kelola Transaksi
          </button>
        </div>

        <div className="space-y-4">
          {transactions.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 md:p-4 rounded-xl hover:bg-secondary/2 transition-all border border-transparent hover:border-secondary/15"
            >
              <div className="flex items-center gap-3 md:gap-4">
                {/* Info */}
                <div className="max-w-30 sm:max-w-none">
                  <p className="text-sm md:text-base font-bold text-secondary tracking-tight truncate">
                    {item.name}
                  </p>
                  <div className="mt-0.5">
                    <span className="text-[8px] md:text-[9px] font-medium text-secondary/30 hidden sm:block">
                      {item.date}
                    </span>
                  </div>
                </div>
              </div>

              {/* Amount */}
              <div className="text-right">
                <p
                  className={`text-sm md:text-lg font-black tracking-tighter ${item.type === "income" ? "text-green-600" : "text-red-500"}`}
                >
                  {item.type === "income" ? "+" : "-"}
                  {new Intl.NumberFormat("id-ID").format(item.amount)}
                </p>
                <p className="text-[8px] md:text-[9px] font-bold text-secondary/20 uppercase tracking-widest">
                  IDR
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
