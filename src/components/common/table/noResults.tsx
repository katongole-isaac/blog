/**
 * Table No Results
 *
 */

import { TableBody, TableCell, TableRow } from "@/components/ui/table";

const TableNoResults: React.FC<{ msg: string }> = ({ msg }) => {
  return (
    <TableBody>
      <TableRow className="w-100 ">
        <TableCell className="text-center py-10" colSpan={6}>
          {msg || "No results"}
        </TableCell>
      </TableRow>
    </TableBody>
  );
};

export { TableNoResults };
