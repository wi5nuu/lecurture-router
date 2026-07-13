"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  placeholder?: string;
  large?: boolean;
}

export function SearchBar({ placeholder = "Cari mata kuliah, topik, atau dosen...", large }: SearchBarProps) {
  const [query, setQuery] = useState("");

  return (
    <div className={cn("relative w-full", large && "max-w-2xl mx-auto")}>
      <div className={cn(
        "relative flex items-center rounded-xl border border-border bg-background shadow-lg shadow-emerald/5 transition-all duration-300",
        "focus-within:border-emerald/50 focus-within:shadow-emerald/10 focus-within:ring-1 focus-within:ring-emerald/30",
        large ? "h-16" : "h-12"
      )}>
        <Search className={cn(
          "text-muted-foreground shrink-0",
          large ? "ml-5 h-5 w-5" : "ml-4 h-4 w-4"
        )} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "flex-1 bg-transparent outline-none placeholder:text-muted-foreground",
            large ? "px-4 text-lg" : "px-3 text-sm"
          )}
        />
        {query && (
          <button onClick={() => setQuery("")} className="mr-2 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        )}
        <div className="hidden sm:flex items-center gap-1 mr-2">
          <span className="w-px h-6 bg-border" />
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
            <SlidersHorizontal className="h-4 w-4" />
            <span className="text-xs">Filter</span>
          </Button>
        </div>
        <Button className={cn(
          "bg-emerald hover:bg-emerald-dark shrink-0",
          large ? "h-12 px-6 mr-2 rounded-lg" : "h-9 px-4 mr-1.5 rounded-md text-xs"
        )}>
          Cari
        </Button>
      </div>
    </div>
  );
}
