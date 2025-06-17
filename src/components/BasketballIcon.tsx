import React from "react";

interface BasketballIconProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const BasketballIcon: React.FC<BasketballIconProps> = ({
  className = "",
  size = "md",
}) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const iconSizeClasses = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  return (
    <div
      className={`bg-blue-500 rounded-full flex items-center justify-center ${sizeClasses[size]} ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        className={`text-white ${iconSizeClasses[size]}`}
        fill="none"
        stroke="currentColor"
      >
        <path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
          fill="currentColor"
          opacity="0.3"
        />
        <path
          d="M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10z"
          stroke="currentColor"
          strokeWidth="0.5"
          fill="none"
        />
        <path
          d="M15 12c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3z"
          fill="white"
        />
        <path d="M6 12c0-3.31 2.69-6 6-6" stroke="white" strokeWidth="1" />
        <path d="M18 12c0 3.31-2.69 6-6 6" stroke="white" strokeWidth="1" />
        <path d="M12 6v12" stroke="white" strokeWidth="1" />
        <path d="M6 12h12" stroke="white" strokeWidth="1" />
      </svg>
    </div>
  );
};

export default BasketballIcon;
