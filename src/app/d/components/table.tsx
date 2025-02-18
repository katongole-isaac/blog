import _ from "lodash";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import utils from "@/utils";
import { Table } from "@/components/ui/table";
import Pagination from "@/components/common/pagination";
import { AppTableBody, AppTableHeader, TableNoResults, TableSelect, SearchBox } from "@/components/common/table";

export type SortOrder = boolean | "asc" | "desc";

export interface SortOptions {
  path: string;
  order: SortOrder;
}

export interface ITableColum {
  title: string;
  path?: string;
  content?: React.ReactNode | ((item?: any) => React.ReactNode);
  className?: string;
}

interface Props {
  /**data for the table */
  data: any[];
  /**Table columns */
  columns: ITableColum[];
  /**Describe which `column` to use for the default sort and filtering  */
  sortOptions: Pick<SortOptions, "path">;
  /**Provides paginated items as an `arg` */
  getPaginatedItems?: (paginatedItems: any[]) => void;
  /**
   * Checks whether a given item is selected or not.
   * @param selectedItems Selected items
   * @param item Selected item
   * @returns {boolean} Boolean that indicates whether an item is selected or not. Returns `True` if selected otherwise `False`
   */
  isItemSelected?: (selectedItems: any[], item: any) => boolean;

  /**An array of items that are selected */
  selectedItems: any[];

  onDeleteAll?: () => void;

  /**A column to use while search the table */
  searchByColumn?: string;
}

const BlogTable: React.FC<Props> = ({
  columns,
  data,
  getPaginatedItems,
  selectedItems,
  isItemSelected,
  sortOptions: _sortOpts,
  onDeleteAll,
  searchByColumn,
}) => {
  const rows = [5, 10, 20, 30, 40, 50]; // For pagination purposes.

  const [pageSize, setpageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const [sortOptions, setSortOptions] = useState<SortOptions>({
    path: _sortOpts.path,
    order: "desc",
  });

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleSort = (sort: SortOptions) => setSortOptions(sort);

  const handleSelectChange = (value: string) => {
    setpageSize(parseInt(value, 10));
    setCurrentPage(1);
  };

  const handleSearchQuery: React.ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    setSearchQuery(target.value.toLowerCase());
    setCurrentPage(1);
  };

  const filterByDefault = () => [...new Set([...utils.filter(data, searchByColumn || sortOptions.path, searchQuery.trim())])];

  const filteredItems = utils.sort(filterByDefault(), sortOptions.path, sortOptions.order);

  const paginatedItems = utils.paginate(filteredItems, pageSize, currentPage);

  useEffect(() => {
    if (getPaginatedItems && paginatedItems.length > 0) getPaginatedItems(paginatedItems);
  }, [paginatedItems]);

  return (
    <div className="">
      <div className="flex mb-5  justify-between items-center ">
        <div className=" py-1">
          <SearchBox searchQuery={searchQuery} onChange={handleSearchQuery} />
        </div>
        <div className="">
          {selectedItems.length > 0 && (
            <Trash2 role="button" className="text-rose-600 hover:text-rose-700 !scale-90" onClick={() => (onDeleteAll ? onDeleteAll() : null)} />
          )}
        </div>
      </div>
      <Table className="w-full border rounded-lg">
        <AppTableHeader columns={columns} onSort={handleSort} sortOptions={sortOptions} />
        {paginatedItems.length === 0 ? (
          <TableNoResults msg="No results" />
        ) : (
          <AppTableBody data={paginatedItems} columns={columns} selected={selectedItems} isSelected={isItemSelected} />
        )}
      </Table>
      <div className="flex flex-wrap justify-center md:justify-between md:gap-0 gap-2 items-center py-4 px-2 w-full">
        <span className="block text-muted-foreground dark:text-neutral-400/80">
          {searchQuery.trim() ? _.intersectionWith(paginatedItems, selectedItems, _.isEqual).length : selectedItems.length} of{" "}
          {searchQuery.trim() ? paginatedItems.length : data.length} row(s) selected{" "}
        </span>
        <div className="flex flex-wrap justify-center items-center gap-8">
          <div className="flex gap-2 items-center flex-1 ">
            <span className="font-weight-bold inline-block ">Rows per page</span>
            <TableSelect onChange={handleSelectChange} value={pageSize} options={rows} />
          </div>

          <div className="">
            <p className="font-medium">
              Page {currentPage} of {utils.pages(filteredItems.length, pageSize).length}{" "}
            </p>
          </div>

          <Pagination totalCount={filteredItems.length} pageSize={pageSize} onPageChange={handlePageChange} currentPage={currentPage} />
        </div>
      </div>
    </div>
  );
};

export default BlogTable;
