"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

interface GridWithPaginationProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  itemsPerPage?: number;
  className?: string;
}

export function GridWithPagination<T>({
  items,
  renderItem,
  itemsPerPage = 9,
  className = "",
}: GridWithPaginationProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const t = useTranslations("Common");
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const paginatedItems = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {paginatedItems.map((item, index) => (
          <div key={index}>{renderItem(item)}</div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-12 space-x-4 items-center">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-[#7FC242] hover:bg-[#5A7D2C] text-white rounded disabled:opacity-50"
          >
            {t("previous")}
          </button>
          <span className="flex items-center">
            {t("page")} {currentPage} {t("of")} {totalPages}
          </span>
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-[#7FC242] hover:bg-[#5A7D2C] text-white rounded disabled:opacity-50"
          >
            {t("next")}
          </button>
        </div>
      )}
    </div>
  );
}
