import { useState, useEffect } from "react";
import { useDebounce } from "@/store/useDebounce";
import type { SortOption } from "@/types";

interface FilterState {
  category: string;
  priceRange: [number, number];
  sort: SortOption;
  newOnly: boolean;
}

interface UseDebouncedFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
  debounceDelay?: number;
}

export function useDebouncedFilters({
  onFiltersChange,
  debounceDelay = 300,
}: UseDebouncedFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    category: "",
    priceRange: [0, 10000],
    sort: "newest",
    newOnly: false,
  });

  // Debounce price range changes (most likely to cause rapid changes)
  const debouncedPriceRange = useDebounce(filters.priceRange, debounceDelay);

  // Immediate update for non-price filters
  const debouncedCategory = useDebounce(filters.category, 0);
  const debouncedSort = useDebounce(filters.sort, 0);
  const debouncedNewOnly = useDebounce(filters.newOnly, 0);

  // Update filters when debounced values change
  useEffect(() => {
    onFiltersChange({
      category: debouncedCategory,
      priceRange: debouncedPriceRange,
      sort: debouncedSort,
      newOnly: debouncedNewOnly,
    });
  }, [
    debouncedCategory,
    debouncedPriceRange,
    debouncedSort,
    debouncedNewOnly,
    onFiltersChange,
  ]);

  return {
    filters,
    setFilters,
    updateFilter: <K extends keyof FilterState>(
      key: K,
      value: FilterState[K]
    ) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
  };
}
