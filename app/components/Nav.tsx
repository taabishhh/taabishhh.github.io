"use client";

import { useEffect, useState } from "react";

const items = [
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];

export default function Nav({ name }: { name: string }) {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const els = items
      .map((i) => document.getElementById(i.id))
      .filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);

  return (
    <header className="nav">
      <a href="#top" className="nav__name">
        {name}
        <span className="nav__dot" aria-hidden="true" />
      </a>
      <nav aria-label="Sections">
        {items.map((i) => (
          <a key={i.id} href={`#${i.id}`} className={active === i.id ? "is-active" : ""}>
            {i.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
