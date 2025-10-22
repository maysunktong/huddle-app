"use client";

import { useEffect } from "react";
import gsap from "gsap";

export default function DiscoBallWithWords() {
  useEffect(() => {
    const tween = gsap.to("#discoball", {
      rotation: 360,
      duration: 10,
      repeat: -1,
      ease: "none",
      transformOrigin: "50% 50%",
    });
    const disco = document.getElementById("discoball");
    if (disco) {
      disco.addEventListener("mouseenter", () => tween.timeScale(6));
      disco.addEventListener("mouseleave", () => tween.timeScale(1));
    }
  }, []);

  return (
    <div
      className="relative py-8 flex h-full flex-col items-center justify-center text-gray-800"
    >
      <div className="relative flex items-center justify-center">
        <img
          id="discoball"
          src="/images/discoball.png"
          alt="disco-ball"
          className="w-40 h-40 select-none"
        />
      </div>
    </div>
  );
}
