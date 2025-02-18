/**
 * Pagination
 *
 */

import utils from "@/utils";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

/**
 *
 */

interface Props {
  totalCount: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (arg: number) => void;
}

const Pagination: React.FC<Props> = ({ totalCount, pageSize, currentPage, onPageChange }) => {
  const _pages = utils.pages(totalCount, pageSize);

  const firstPage = 1;

  const leftBtnsDisabled = currentPage === firstPage || _pages.length == 1;
  const rightBtnsDisabled = _pages.findIndex((p) => p == currentPage) === _pages.length - 1 || _pages.length == 1;

  return (
    <div className="flex gap-2">
      <div className="flex gap-1">
        <Button variant="outline" size="sm" className="w-9 h-8" disabled={leftBtnsDisabled} onClick={() => onPageChange(1)}>
          <ChevronsLeft />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-9 h-8"
          disabled={leftBtnsDisabled}
          onClick={() => onPageChange(currentPage === 1 ? 1 : currentPage - 1)}
        >
          <ChevronLeft />
        </Button>
      </div>
      <div className="flex gap-1">
        <Button variant="outline" size="sm" className="w-9 h-8" disabled={rightBtnsDisabled} onClick={() => onPageChange(currentPage + 1)}>
          <ChevronRight />
        </Button>
        <Button variant="outline" size="sm" className="w-9 h-8" disabled={rightBtnsDisabled} onClick={() => onPageChange(_pages[_pages.length - 1])}>
          <ChevronsRight />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
