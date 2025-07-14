"use client";

import React from "react";
import { Button } from "./Button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface GridWithPaginationProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  itemsPerPage: number;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  isLoading?: boolean;
}

export const GridWithPagination = <T,>({
  items,
  renderItem,
  itemsPerPage,
  currentPage = 1,
  totalPages,
  onPageChange,
  isLoading = false,
}: GridWithPaginationProps<T>) => {
  // Use internal pagination if no external control provided
  const [internalPage, setInternalPage] = React.useState(1);

  const isExternalPagination = onPageChange && totalPages !== undefined;
  const page = isExternalPagination ? currentPage : internalPage;
  const pages = isExternalPagination
    ? totalPages
    : Math.ceil(items.length / itemsPerPage);

  const startIndex = isExternalPagination ? 0 : (page - 1) * itemsPerPage;
  const endIndex = isExternalPagination
    ? items.length
    : startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    if (isExternalPagination) {
      onPageChange(newPage);
    } else {
      setInternalPage(newPage);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        {isLoading ? (
          <div className="col-span-full flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7FC242]"></div>
          </div>
        ) : (
          currentItems.map((item, index) => (
            <div key={isExternalPagination ? index : startIndex + index}>
              {renderItem(item)}
            </div>
          ))
        )}
      </div>

      {pages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <Button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1 || isLoading}
            variant="outline"
            className="flex items-center gap-2 px-4 py-2"
            rounded
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 font-medium">
              Page {page} of {pages}
            </span>
            {isLoading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#7FC242]"></div>
            )}
          </div>

          <Button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === pages || isLoading}
            variant="outline"
            className="flex items-center gap-2 px-4 py-2"
            rounded
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
