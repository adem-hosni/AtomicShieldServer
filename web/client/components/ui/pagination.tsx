import React from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  className = "",
}: PaginationProps) {
  // Generate page numbers to show
  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show abbreviated pagination
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - delta; i <= currentPage + delta; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      {/* First page */}
      {showFirstLast && (
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onPageChange(1);
          }}
          disabled={currentPage === 1}
          className="border-primary/20 hover:bg-primary/10 min-w-[40px] h-9"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
      )}

      {/* Previous page */}
      <Button
        variant="outline"
        size="sm"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onPageChange(currentPage - 1);
        }}
        disabled={currentPage === 1}
        className="border-primary/20 hover:bg-primary/10"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Page numbers */}
      {getPageNumbers().map((page, index) => (
        <React.Fragment key={index}>
          {page === "..." ? (
            <div className="px-4 py-2 flex items-center justify-center min-w-[40px]">
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </div>
          ) : (
            <Button
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onPageChange(Number(page));
              }}
              className={`min-w-[40px] h-9 ${
                currentPage === page
                  ? "bg-primary text-primary-foreground"
                  : "border-primary/20 hover:bg-primary/10"
              }`}
            >
              {page}
            </Button>
          )}
        </React.Fragment>
      ))}

      {/* Next page */}
      <Button
        variant="outline"
        size="sm"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onPageChange(currentPage + 1);
        }}
        disabled={currentPage === totalPages}
        className="border-primary/20 hover:bg-primary/10"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Last page */}
      {showFirstLast && (
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onPageChange(totalPages);
          }}
          disabled={currentPage === totalPages}
          className="border-primary/20 hover:bg-primary/10 min-w-[40px] h-9"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

// Page size selector component
interface PageSizeSelectorProps {
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  options?: number[];
  className?: string;
}

export function PageSizeSelector({
  pageSize,
  onPageSizeChange,
  options = [10, 25, 50, 100],
  className = "",
}: PageSizeSelectorProps) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className="text-sm text-muted-foreground">Show</span>
      <select
        value={pageSize}
        onChange={(e) => onPageSizeChange(Number(e.target.value))}
        className="bg-background border border-primary/20 rounded px-2 py-1 text-sm focus:border-primary/40 focus:outline-none"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <span className="text-sm text-muted-foreground">per page</span>
    </div>
  );
}

// Pagination info component
interface PaginationInfoProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  className?: string;
}

export function PaginationInfo({
  currentPage,
  pageSize,
  totalItems,
  className = "",
}: PaginationInfoProps) {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className={`text-sm text-muted-foreground ${className}`}>
      {totalItems === 0
        ? "No items found"
        : totalItems === 1
          ? "1 item"
          : `${startItem.toLocaleString()}–${endItem.toLocaleString()} of ${totalItems.toLocaleString()}`}
    </div>
  );
}
