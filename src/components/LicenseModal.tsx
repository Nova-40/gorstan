import React, { useEffect, useState } from 'react';

interface LicenseModalProps {
  open: boolean;
  onClose: () => void;
}

const fetchEula = async () => {
  try {
    const res = await fetch('/EULA.md');
    if (!res.ok) return 'Licence not available.';
    return await res.text();
  } catch (e) {
    return 'Failed to load licence.';
  }
};

const LicenseModal: React.FC<LicenseModalProps> = ({ open, onClose }) => {
  const [fullText, setFullText] = useState('');
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    (async () => {
      const txt = await fetchEula();
      if (cancelled) return;
      setFullText(txt);
      setDisplayed('');
      // teletype animation
      let i = 0;
      const speed = 12; // ms per char
      const t = setInterval(() => {
        i += 1;
        setDisplayed(txt.slice(0, i));
        if (i >= txt.length) clearInterval(t);
      }, speed);
    })();

    return () => { cancelled = true; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black text-white z-60 flex items-start justify-center p-6">
      <div className="max-w-4xl w-full h-full overflow-auto">
        <pre className="whitespace-pre-wrap font-mono text-sm leading-6">{displayed}</pre>
        <div className="mt-4 flex justify-center">
          <button onClick={onClose} className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded">Close</button>
        </div>
      </div>
    </div>
  );
};

export default LicenseModal;
