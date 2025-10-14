"use client";

import { useEffect } from "react";
import gsap from "gsap";

const words = ["Community", "Hustle", "Huddle"];

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

    // Rotating word in the center
    const rotateText = (index = 0) => {
      const el = document.getElementById("text");
      if (!el) return;

      gsap.to(el, {
        opacity: 0,
        duration: 1,
        ease: "power2.in",
        onComplete: () => {
          el.textContent = words[index];

          gsap.to(el, {
            opacity: 1,
            duration: 2,
            ease: "power2.out",
            onComplete: () => {
              setTimeout(() => rotateText((index + 1) % words.length), 1000);
            },
          });
        },
      });
    };
    rotateText();
  }, []);

  return (
    <div
      className="relative py-8 flex h-full flex-col items-center justify-center text-gray-800"
    >
      <div className="relative flex items-center justify-center">
        <img
          id="discoball"
          src="/background/discoball.png"
          alt="disco-ball"
          className="w-40 h-40 select-none"
        />
        <div
          id="text"
          className="absolute text-4xl font-extrabold text-white drop-shadow-lg pointer-events-none"
        >
          Community
        </div>
      </div>
    </div>
  );
}
