import { useEffect, useState } from "react";

export default function MultiverseReset({ onComplete }) {
  const [lines, setLines] = useState([]);
  const [falling, setFalling] = useState(false);

  useEffect(() => {
    let count = 0;
    const interval = setInterval(() => {
      if (count < 10) {
        setLines((prev) => [...prev, "Multiverse resetting..."]);
        count++;
      } else {
        clearInterval(interval);
        setFalling(true);
        setTimeout(() => onComplete(), 2000);
      }
    }, count < 6 ? 100 : 300);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-end h-full overflow-hidden text-green-400 font-mono">
      {lines.map((line, idx) => (
        <div
          key={idx}
          className={`transition-transform duration-500 ${
            falling ? "animate-fall text-transparent" : ""
          }`}
        >
          {line}
        </div>
      ))}
    </div>
  );
}
