import React from "react";

interface SystemMessageProps {
  text: string;
  variant?: "info" | "warning" | "error" | "success";
  icon?: string;
}

export const SystemMessage: React.FC<SystemMessageProps> = ({
  text,
  variant = "info",
  icon,
}) => {
  const variantClasses = {
    info: "bg-blue-50 border-blue-200 text-blue-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    error: "bg-red-50 border-red-200 text-red-800",
    success: "bg-green-50 border-green-200 text-green-800",
  };

  const iconMap = {
    info: "ℹ️",
    warning: "⚠️",
    error: "❌",
    success: "✅",
  };

  return (
    <div className={`border rounded p-3 ${variantClasses[variant]}`}>
      <div className="flex items-center gap-2">
        {icon && <span>{icon}</span>}
        {!icon && <span>{iconMap[variant]}</span>}
        <span className="text-sm">{text}</span>
      </div>
    </div>
  );
}; 