import React from "react";

const AppBackground = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-navy">
      <div className="absolute top-0 left-0 right-0 h-[300px] border-b border-white/20 rounded-b-[50%]"></div>
      <div className="absolute bottom-0 left-0 right-0 h-[300px] border-t border-white/20 rounded-t-[50%]"></div>
      <div className="absolute left-0 top-1/4 bottom-1/4 w-[100px] border-r border-white/20"></div>
      <div className="absolute right-0 top-1/4 bottom-1/4 w-[100px] border-l border-white/20"></div>
    </div>
  );
};

export default AppBackground;
