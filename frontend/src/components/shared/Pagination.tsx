import React from "react";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex justify-center items-center gap-sm mt-xl">
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        className="bg-surface-container-lowest border border-outline-variant text-on-surface-variant px-md py-sm rounded hover:bg-surface-container-high transition-colors font-label-md flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="material-symbols-outlined text-[18px]">chevron_left</span> Prev
      </button>

      <div className="flex gap-xs">
        {getPageNumbers().map((page, index) =>
          typeof page === "number" ? (
            <button
              key={index}
              type="button"
              onClick={() => onPageChange(page)}
              className={`w-10 h-10 rounded flex items-center justify-center font-label-md transition-colors ${
                currentPage === page
                  ? "bg-primary text-on-primary border border-primary font-bold shadow-sm"
                  : "bg-surface-container-lowest border border-outline-variant text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              {page}
            </button>
          ) : (
            <span
              key={index}
              className="w-10 h-10 flex items-center justify-center text-on-surface-variant font-label-md"
            >
              {page}
            </span>
          )
        )}
      </div>

      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        className="bg-surface-container-lowest border border-outline-variant text-on-surface-variant px-md py-sm rounded hover:bg-surface-container-high transition-colors font-label-md flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next <span className="material-symbols-outlined text-[18px]">chevron_right</span>
      </button>
    </div>
  );
};
