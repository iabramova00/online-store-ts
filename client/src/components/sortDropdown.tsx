import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { setSortBy } from "../store/filterSlice";

const sortOptions = [
  { value: "popularity", label: "Popularity" },
  { value: "price-low-high", label: "Price: Low to High" },
  { value: "price-high-low", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
  { value: "rating", label: "Rating" },
];

export const SortDropdown: React.FC = () => {
  const sortBy = useSelector((state: RootState) => state.filters.sortBy);
  const dispatch = useDispatch();

  const selected =
    sortOptions.find((s) => s.value === sortBy) || sortOptions[0];

  return (
    <div className="space-y-2">
      <Listbox
        value={selected}
        onChange={(option) => dispatch(setSortBy(option.value))}
      >
        <div className="relative">
          <ListboxButton className="relative w-full cursor-pointer rounded bg-white py-2 pl-2 pr-10 text-left font-semibold text-primary text-xl shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
            <span className="block truncate">{selected.label}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-primary"
                aria-hidden="true"
              />
            </span>
          </ListboxButton>

          <ListboxOptions className="absolute max-h-70 w-full overflow-auto rounded bg-white py-2 px-2 space-y-2 text-xl text-primary shadow-lg ring-1 ring-primary ring-opacity-5 focus:outline-none z-10">
            {sortOptions.map((option) => (
              <ListboxOption
                value={option}
                className="cursor-pointer select-none px-4 py-2 
                hover:bg-teal-500 hover:text-white"
              >
                {({ selected }: { selected: boolean }) => (
                  <span
                    className={`block truncate ${
                      selected ? "font-semibold" : "font-medium"
                    }`}
                  >
                    {option.label}
                  </span>
                )}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>
    </div>
  );
};
