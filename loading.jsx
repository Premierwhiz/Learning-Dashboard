export default function Loading() {
  return (
    <div className="min-h-screen bg-[#050505] flex">
      <aside className="hidden md:flex w-20 lg:w-64 border-r border-white/5 shrink-0" />
      <main className="flex-1 p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 w-full animate-pulse">
          <div className="col-span-1 md:col-span-2 lg:col-span-8 h-[300px] bg-[#09090b]/80 border border-white/[0.05] rounded-2xl"></div>
          <div className="col-span-1 md:col-span-1 lg:col-span-4 h-[300px] bg-[#09090b]/80 border border-white/[0.05] rounded-2xl"></div>
          <div className="col-span-1 md:col-span-2 lg:col-span-12 h-64 bg-[#09090b]/80 border border-white/[0.05] rounded-2xl"></div>
        </div>
      </main>
    </div>
  );
}