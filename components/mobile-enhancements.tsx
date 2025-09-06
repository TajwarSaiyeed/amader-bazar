"use client";

import { useState } from "react";
import { FloatingActionButton } from "@/components/floating-action-button";
import { VoiceSearch } from "@/components/voice-search";

export function MobileEnhancements() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearchClick = () => {
    setIsSearchOpen(true);
  };

  return (
    <>
      <FloatingActionButton onSearchClick={handleSearchClick} />
      <VoiceSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
