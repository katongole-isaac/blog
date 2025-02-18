/**
 * Table Header component
 *
 */

import { ArrowDownIcon, ArrowUpIcon, SortDesc } from "lucide-react";
import { ITableColum, SortOptions } from "@/app/d/components/table";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Props {
  onSort: (sort: SortOptions) => void;
  sortOptions: SortOptions;
  columns: ITableColum[];
}

const AppTableHeader: React.FC<Props> = ({ columns, onSort, sortOptions }) => {
  const iconSize = 20;
  const { path, order } = sortOptions;

  const raiseSort = (path: string) => {
    const sortOpt = { ...sortOptions };

    if (path === "") return;

    if (path !== sortOptions.path) sortOpt.path = path;
    else sortOpt.order = sortOpt.order === "asc" ? "desc" : "asc";

    onSort(sortOpt);
  };

  return (
    <TableHeader className="">
      <TableRow className="w-full border border-gray-300/60 dark:border-neutral-800 ">
        {columns.map((column, idx) => (
          <TableHead
            key={column.path + idx.toString()}
            scope="col"
            onClick={() => !column.title.trim() || raiseSort(column.path!)}
            className={`rounded-md p-0 h-10  ${column?.className ? column.className : ""}`}
          >
            {column.content && (
              <div className="flex justify-center items-center"> {typeof column.content === "function" ? column.content() : column.content} </div>
            )}
            <div className="cursor-pointer flex justify- items-center gap-2 flex-1 w-full">
              <span className="font-medium">{column.title}</span>
              {path && column.path === path && <> {order === "asc" ? <ArrowUpIcon size={iconSize} /> : <ArrowDownIcon size={iconSize} />} </>}
            </div>
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
};

export { AppTableHeader };
