import React from "react";

export interface EmptyStateProps {
  icon?: string;
  message: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = "article",
  message,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-xl text-on-surface-variant">
      <span className="material-symbols-outlined text-[48px] mb-md text-outline">
        {icon}
      </span>
      <p className="font-body-lg text-body-lg">{message}</p>
    </div>
  );
};
