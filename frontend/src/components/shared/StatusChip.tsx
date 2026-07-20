import React from "react";

export interface StatusChipProps {
  label: string;
  variant?: "primary" | "tertiary" | "secondary" | "error" | string;
}

export const StatusChip: React.FC<StatusChipProps> = ({ label, variant }) => {
  // Determine color styling based on variant or label name
  const getStyleClass = () => {
    if (variant === "tertiary" || label.toLowerCase() === "development" || label.toLowerCase() === "business") {
      return "bg-tertiary-container/10 text-tertiary-container";
    }
    if (variant === "secondary" || label.toLowerCase() === "lifestyle" || label.toLowerCase() === "strategy") {
      return "bg-secondary-container/20 text-secondary";
    }
    if (variant === "error" || label.toLowerCase() === "thrash" || label.toLowerCase() === "trashed") {
      return "bg-error-container/30 text-error";
    }
    // Default / primary / design / technology
    return "bg-primary-container/10 text-primary";
  };

  return (
    <span className={`inline-flex items-center px-sm py-xs rounded-full font-label-sm text-label-sm font-medium ${getStyleClass()}`}>
      {label}
    </span>
  );
};
