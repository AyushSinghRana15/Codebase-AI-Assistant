// useScrollReveal — IntersectionObserver to animate .scroll-reveal elements on scroll

"use client";

import { useEffect } from "react";

export function useScrollReveal() {
  useEffect(() => {
    // Observe .scroll-reveal elements and add .visible when they enter the viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const elements = document.querySelectorAll(".scroll-reveal");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}
