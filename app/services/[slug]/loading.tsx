export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a1510]">
      <div className="flex flex-col items-center gap-4">
        {/* A simple spinning circle in your brand green */}
        <div className="w-12 h-12 border-4 border-white/10 border-t-[#14b866] rounded-full animate-spin"></div>
        <p className="text-[#F7E7CE] tracking-widest uppercase text-sm animate-pulse">
          Loading Service...
        </p>
      </div>
    </div>
  )
}