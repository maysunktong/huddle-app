"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface SearchInputProps {
  onSearchChange: (searchTerm: string) => void;
}

export default function SearchBar({
  onSearchChange,
}: SearchInputProps) {
  const [userInput, setUserInput] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(userInput.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [userInput, onSearchChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  return (
    <div className="mx-auto max-w-3xl my-0 md:my-3">
      <Input
        type="search"
        name="search"
        placeholder="Search post..."
        value={userInput}
        onChange={handleChange}
      />
    </div>
  );
}
