/**
 * Table Body Component
 *
 */

import { ITableColum } from "@/app/d/components/table";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import _ from "lodash";

interface Props {
  data: any[];
  columns: ITableColum[];
  /**Determines how an item is considered to be selected */
  isSelected?: (selected: any[], item: any) => boolean;
  selected?: any[];
}
const AppTableBody: React.FC<Props> = ({ data, columns, isSelected, selected }) => {
  return (
    <TableBody>
      {data.map((item, id) => (
        <TableRow
          key={item[columns[1]?.path!] || id}
          className={`${
            selected && isSelected
              ? isSelected(selected, item)
                ? "dark:bg-neutral-800 dark:hover:!bg-neutral-800 bg-gray-300/40 hover:bg-gray-300/40 "
                : ""
              : ""
          }  `}
        >
          {columns.map((column, idx: number) => {
            if (!column.content)
              return (
                <TableCell className="" key={column.path}>
                  {item[column.path as string]}
                </TableCell>
              );

            return (
              <TableCell key={idx} className={`py-2 ${column?.className ? column.className : ""}`}>
                {typeof column.content === "function" ? column.content(item) : column.content}
              </TableCell>
            );
          })}
        </TableRow>
      ))}
    </TableBody>
  );
};

export { AppTableBody };
