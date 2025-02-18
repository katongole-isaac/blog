/**
 * SearchBox Component
 *
 */

import { Input } from "@/components/ui/input";

interface Props {
  searchQuery: string;
  placeholder?: string;
  onChange: (ev: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBox: React.FC<Props> = ({ searchQuery, placeholder, onChange }) => {
  return (
    <Input
      type="text"
      value={searchQuery}
      placeholder={placeholder || "Filter blog posts..."}
      className="w-72 focus:outline-0 dark:!ring-neutral-800 !ring-gray-200"
      onChange={(e) => onChange(e)}
    />
  );
};

export { SearchBox };
