"use client";

import React from "react";

interface GridWithPaginationProps {
  children: React.ReactNode;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const GridWithPagination: React.FC<GridWithPaginationProps> = ({
  children,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        {children}
      </div>
      <div className="flex justify-center items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default GridWithPagination;
