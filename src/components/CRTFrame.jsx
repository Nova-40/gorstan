import React from "react";

const CRTFrame = ({ children }) => {
  return (
    <div className="border-4 border-green-500 rounded-2xl p-6 shadow-[0_0_12px_#00ff00] bg-black text-green-300 font-mono max-w-3xl mx-auto mt-10">
      {children}
    </div>
  );
};

export default CRTFrame;