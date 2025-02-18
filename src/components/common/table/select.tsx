/**
 * Select Component
 *
 */

import { Select, SelectTrigger, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectValue } from "@/components/ui/select";

interface Props {
  value: number | string;
  options: any[];
  onChange: (arg: string) => void;
}

const TableSelect: React.FC<Props> = ({ onChange, value, options }) => {
  return (
    <Select onValueChange={onChange} value={value as string} name="options" >
      <SelectTrigger className="w-20 h-8 !ring-0 !focus:ring-0 !ring-offset-0"  >
        <SelectValue placeholder={value} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export { TableSelect };
