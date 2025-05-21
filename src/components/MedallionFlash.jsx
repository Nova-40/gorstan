
export default function MedallionFlash() {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="animate-ping rounded-full border-4 border-yellow-400 bg-yellow-200/10 w-40 h-40 shadow-lg" />
      <div className="absolute text-yellow-300 text-xl font-bold glow">🧿 Medallion Unlocked!</div>
    </div>
  );
}
