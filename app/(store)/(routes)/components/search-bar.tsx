"use client";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/store/useDebounce";

const SearchBar = () => {
  const [value, setValue] = useState<string>("");
  const debouncedValue = useDebounce(value);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();
  const currentCategory = searchParams.get("category");

  useEffect(() => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (currentCategory) params.set("category", currentCategory);
    if (debouncedValue) params.set("name", debouncedValue);
    if (!debouncedValue) params.delete("name");
    const url = `${pathName}?${params.toString()}`;
    router.push(url);
  }, [router, searchParams, debouncedValue, pathName, currentCategory]);

  return (
    <div className={"relative mt-4"}>
      <Search
        className={"absolute top-3 left-3 transform h-4 w-4 text-slate-600"}
      />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={
          "w-full md:max-w-[500px] pl-9 rounded-lg bg-slate-100 focus-visible:ring-slate-200 dark:bg-slate-800 dark:focus-visible:ring-slate-700"
        }
        placeholder={"Search for a product"}
      />
    </div>
  );
};

export default SearchBar;
