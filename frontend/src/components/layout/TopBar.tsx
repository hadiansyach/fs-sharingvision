import React from "react";
import { Link } from "react-router-dom";

export const TopBar: React.FC = () => {
  return (
    <header className="flex justify-between items-center h-16 px-margin-mobile md:px-margin-desktop md:ml-[280px] bg-surface-container-lowest text-primary font-title-lg text-title-lg border-b border-outline-variant sticky top-0 z-30">
      <div className="flex items-center gap-sm">
        <Link
          to="/posts"
          className="font-headline-md text-headline-md font-bold text-primary"
        >
          ArticleFlow
        </Link>
      </div>
      <div className="flex items-center gap-lg">
        <div className="flex items-center gap-xs">
          <button
            type="button"
            className="text-on-surface-variant hover:bg-surface-container-high p-sm rounded-full transition-colors flex items-center justify-center"
            title="Notifications"
          >
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button
            type="button"
            className="text-on-surface-variant hover:bg-surface-container-high p-sm rounded-full transition-colors flex items-center justify-center"
            title="Account"
          >
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </div>
    </header>
  );
};
