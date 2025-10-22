"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Logo() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <a href="/">
        <img
          src="https://res.cloudinary.com/dpgdy4ayz/image/upload/v1761165608/logo-light_wc1gkc.png"
          alt="Logo"
          width={150}
          height={150}
          className="opacity-0"
        />
      </a>
    );
  }

  return (
    <a href="/">
      <img
        src={
          resolvedTheme === "dark"
            ? "https://res.cloudinary.com/dpgdy4ayz/image/upload/v1761165607/logo-dark_rqcbep.png"
            : "https://res.cloudinary.com/dpgdy4ayz/image/upload/v1761165608/logo-light_wc1gkc.png"
        }
        alt="Logo"
        width={150}
        height={150}
        className="transition-opacity duration-300"
      />
    </a>
  );
}
