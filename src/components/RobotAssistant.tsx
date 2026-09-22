import { useEffect, useRef, useState, type CSSProperties } from "react";

type Props = { section?: string };

const waypoints = [
  { id: "hero", label: "START", x: 84, y: 28 },
  { id: "services", label: "SERVICES", x: 13, y: 39 },
  { id: "outcomes", label: "OUTCOMES", x: 82, y: 51 },
  { id: "process", label: "PROCESS", x: 16, y: 65 },
  { id: "tools", label: "TOOLS", x: 82, y: 78 },
  { id: "contact", label: "BOOK", x: 18, y: 90 },
];

export default function RobotAssistant({ section = "START" }: Props) {
  const [state, setState] = useState<"idle" | "moving" | "observing" | "celebrate">("idle");
  const [position, setPosition] = useState({ x: 84, y: 28 });
  const [look, setLook] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [label, setLabel] = useState(section);
  const positionRef = useRef(position);
  const targetRef = useRef(position);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const current = positionRef.current;
      const target = targetRef.current;
      const next = {
        x: current.x + (target.x - current.x) * 0.055,
        y: current.y + (target.y - current.y) * 0.055,
      };
      positionRef.current = next;
      setPosition(next);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const update = () => {
      const sections = waypoints
        .map((item) => ({ ...item, element: document.getElementById(item.id) }))
        .filter((item) => item.element);
      const marker = window.scrollY + window.innerHeight * 0.42;
      let current = sections[0];
      for (const item of sections) {
        if ((item.element?.offsetTop ?? 0) <= marker) current = item;
      }
      if (!current) return;
      targetRef.current = { x: current.x, y: current.y };
      setLabel(current.label);
      setState(current.id === "contact" ? "celebrate" : "moving");
      window.setTimeout(() => setState(current.id === "contact" ? "celebrate" : "observing"), 700);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    let raf = 0;
    const move = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * 2;
      setLook({ x, y });
      if (!raf) raf = requestAnimationFrame(() => { raf = 0; });
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <button
      type="button"
      className={`guide-robot is-${state} ${hovered ? "is-hovered" : ""}`}
      style={{
        "--rx": `${position.x}vw`,
        "--ry": `${position.y}vh`,
        "--look-x": look.x,
        "--look-y": look.y,
      } as CSSProperties}
      aria-label="Open the Studio project builder"
      onClick={() => document.getElementById("builder-trigger")?.click()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <span className="guide-robot__antenna" />
      <span className="guide-robot__head">
        <span className="guide-robot__eye" />
        <span className="guide-robot__eye" />
      </span>
      <span className="guide-robot__neck" />
      <span className="guide-robot__body">
        <span className="guide-robot__indicator" />
        <span className="guide-robot__panel" />
      </span>
      <span className="guide-robot__arm guide-robot__arm--left" />
      <span className="guide-robot__arm guide-robot__arm--right" />
      <span className="guide-robot__hand guide-robot__hand--left" />
      <span className="guide-robot__hand guide-robot__hand--right" />
      <span className="guide-robot__leg guide-robot__leg--left" />
      <span className="guide-robot__leg guide-robot__leg--right" />
      <span className="guide-robot__foot guide-robot__foot--left" />
      <span className="guide-robot__foot guide-robot__foot--right" />
      <span className="guide-robot__signal" />
      <span className="guide-robot__label mono">{label}</span>
    </button>
  );
}
