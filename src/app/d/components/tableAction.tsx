import { MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface Props {
  item?: any;
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
}
const TableActions: React.FC<Props> = ({ item, onDelete, onEdit }) => {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" onCloseAutoFocus={(e) => e.preventDefault()}>
          <DropdownMenuItem onClick={() => onEdit(item)}>Edit</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDelete(item)} className={cn("text-rose-600  hover:!text-rose-600 hover:!bg-rose-500/10 ")}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default TableActions;
