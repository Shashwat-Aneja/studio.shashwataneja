import { useEffect, useState } from "react";
import "./styles/app.css";

type Theme = "light" | "dark";

const THEME_KEY = "studio-theme";

function getInitialTheme(): Theme {
  const stored = window.localStorage.getItem(THEME_KEY);
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function App() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  return (
    <main className="studio-shell">
      <header className="topbar">
        <a className="wordmark" href="/" aria-label="Shashwat Aneja Studio home">
          <span>SA</span>
          <strong>STUDIO</strong>
        </a>

        <div className="topbar-meta">
          <span className="status-dot" aria-hidden="true" />
          <span>Digital product studio</span>
          <button
            className="theme-toggle"
            type="button"
            onClick={() => setTheme((current) => (current === "light" ? "dark" : "light"))}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
          >
            {theme === "light" ? "Dark" : "Light"}
          </button>
        </div>
      </header>

      <section className="hero">
        <p className="eyebrow">STUDIO / FOUNDATION 01</p>
        <h1>Build the digital presence your idea actually needs.</h1>
        <p className="hero-copy">
          Explore services, define the requirement, understand the scope and get to a clear
          project path before anything is booked.
        </p>

        <div className="hero-actions">
          <button className="primary-action" type="button">Build Your Project</button>
          <button className="secondary-action" type="button">What Do I Need?</button>
        </div>
      </section>

      <section className="foundation-grid" aria-label="Studio foundation">
        {[
          ["01", "Discover", "Find the capability that matches the problem."],
          ["02", "Configure", "Turn an idea into a structured requirement."],
          ["03", "Estimate", "See scope, timeline and pricing logic."],
          ["04", "Book", "Confirm the project only when it is ready."],
        ].map(([number, title, description]) => (
          <article className="foundation-card" key={number}>
            <span>{number}</span>
            <h2>{title}</h2>
            <p>{description}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
