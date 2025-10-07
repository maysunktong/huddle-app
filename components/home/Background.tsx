"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { Spool } from "lucide-react";

const palette = ["#E5AFAF", "#C4BCFF", "#C2D8BE"];
const words = ["Community", "Hustle", "Huddle"];
const lines = [
  "Build your community",
  "Discover new hustles",
  "Huddle every day",
];
const avatars = [
  "/avatars/avatar1.png",
  "/avatars/avatar2.png",
  "/avatars/avatar3.png",
];

export default function Background() {
  useEffect(() => {
    const flashBackground = () => {
      const randomColor = palette[Math.floor(Math.random() * palette.length)];
      gsap.to("#bg", {
        backgroundColor: randomColor,
        duration: 1,
        delay: 0.2,
        ease: "power1.inOut",
        onComplete: flashBackground,
      });
    };
    flashBackground();

    // Disco ball rotation
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

    // Lines animation (word chunks)
    const container = document.getElementById("text-container");
    if (!container) return;

    container.innerHTML = lines
      .map(
        (line) =>
          `<div class="line absolute opacity-0 text-4xl font-bold text-white whitespace-nowrap"></div>`
      )
      .join("");

    const linesEl = container.querySelectorAll(".line");

    linesEl.forEach((lineEl, i) => {
      const words = lines[i].split(" ");
      lineEl.innerHTML = words
        .map(
          (w) =>
            `<span class="word inline-block opacity-0 mr-2 font-thin">${w}</span>`
        )
        .join(" ");
    });

    let currentLine = 0;

    const animateLine = () => {
      const line = linesEl[currentLine];
      if (!line) return;

      const words = line.querySelectorAll(".word");

      gsap.to(words, {
        opacity: 1,
        repeat: -1,
        y: [20, 0],
        duration: 2,
        stagger: 0.5,
        ease: "power2.inOut",
        onComplete: () => {
          gsap.to(line, {
            opacity: 0,
            duration: 1,
            delay: 1,
            onComplete: () => {
              currentLine = (currentLine + 1) % linesEl.length;
              animateLine();
            },
          });
        },
      });
      gsap.set(line, { opacity: 1 });
    };
    animateLine();

    /* Avatars */
    const avatarEls: HTMLImageElement[] = [];
    avatars.forEach((src, i) => {
      const avatar = document.getElementById(`avatar-${i}`) as HTMLImageElement;
      if (avatar) avatarEls.push(avatar);
    });

    if (avatarEls.length) {
      const spreadDistance = 50;

      const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });

      tl.to(avatarEls, {
        x: (i) => (i - (avatarEls.length - 1) / 2) * spreadDistance,
        opacity: 1,
        scale: 1.2,
        duration: 1.5,
        ease: "power2.inOut",
        stagger: 0.7,
      }).to(
        avatarEls,
        {
          x: 0,
          opacity: 0.8,
          scale: 1,
          duration: 1,
          ease: "power2.inOut",
          stagger: 0.2,
        },
        "+=0.5"
      );
    }
  }, []);

  return (
    <>
    <div
      id="bg"
      className="relative flex h-screen flex-col items-center justify-center text-gray-800"
    >
      
      <div className="relative flex items-center justify-center">
        <img
          id="discoball"
          src="/background/discoball.png"
          alt="disco-ball"
          className="w-80 h-80 select-none"
        />
        <div
          id="text"
          className="absolute text-4xl font-extrabold text-white drop-shadow-lg pointer-events-none"
        >
          Community
        </div>
      </div>

      {/* Avatars container */}
      <div className="relative mt-10 flex items-center justify-center h-24 w-full">
        {avatars.map((src, i) => (
          <img
            key={i}
            id={`avatar-${i}`}
            src={src}
            alt={`avatar-${i}`}
            className="w-16 h-16 rounded-full border border-white absolute object-cover shadow-sm"
          />
        ))}
      </div>

      <div
        id="text-container"
        className="mt-12 flex flex-col items-center justify-center text-center w-full pointer-events-none"
      ></div>
    </div>
    </>
  );
}
