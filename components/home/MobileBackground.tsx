"use client";

import {  useEffect } from "react";
import gsap from "gsap";

const palette = ["#E5AFAF", "#C4BCFF", "#C2D8BE"];

export default function MobileBackground() {
  useEffect(() => {
    const flashBackground = () => {
      const randomColor = palette[Math.floor(Math.random() * palette.length)];
      gsap.to("body", {
        backgroundColor: randomColor,
        duration: 1.2,
        ease: "power2.inOut",
        onComplete: flashBackground,
      });
    };
    flashBackground();

    return () => gsap.killTweensOf("body"); 
  }, []);

  return null;
}
