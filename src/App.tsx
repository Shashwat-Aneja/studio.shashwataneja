import { useEffect, useMemo, useState } from "react";
import "./styles/app.css";
import { serviceCategories } from "./data/services";
import RobotAssistant from "./components/RobotAssistant";

const routes = [
  ["01", "Discover", "Start with the outcome, not a technical checklist."],
  ["02", "Configure", "Shape the requirement into a clear project route."],
  ["03", "Estimate", "See indicative scope, investment and delivery."],
  ["04", "Book", "Review the route before a project is confirmed."],
];

const tools = [
  ["01", "What Do I Need?", "Translate a goal into the right service path."],
  ["02", "Budget Optimizer", "Explore what can fit inside a defined budget."],
  ["03", "Project Blueprint", "Turn an idea into a structured scope."],
  ["04", "Timeline Builder", "See how a project can move from idea to launch."],
  ["05", "Digital Presence Score", "Identify gaps across an existing digital presence."],
];

export default function App() {
  const [activeCategory, setActiveCategory] = useState("web");
  const [builderOpen, setBuilderOpen] = useState(false);
  const [cursorActive, setCursorActive] = useState(false);

  const activeService = useMemo(
    () => serviceCategories.find((category) => category.id === activeCategory) ?? serviceCategories[0],
    [activeCategory],
  );

  useEffect(() => {
    const root = document.documentElement;
    const move = (event: PointerEvent) => {
      root.style.setProperty("--cursor-x", `${event.clientX}px`);
      root.style.setProperty("--cursor-y", `${event.clientY}px`);
    };
    const over = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      setCursorActive(Boolean(target?.closest("a,button,[data-interactive]")));
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("mouseover", over);
    };
  }, []);

  return (
    <main className="studio-site">
      <div className="studio-environment" aria-hidden="true">
        <div className="environment-field environment-field--one" />
        <div className="environment-field environment-field--two" />
        <div className="environment-field environment-field--three" />
        <div className="environment-vignette" />
        <div className="grain" />
      </div>

      <div className={`custom-cursor ${cursorActive ? "is-active" : ""}`} aria-hidden="true">
        <span />
        <small>EXPLORE</small>
      </div>

      <header className="site-nav">
        <a className="wordmark" href="#top" aria-label="Shashwat Aneja Studio">
          SA<span>/</span>STUDIO
        </a>
        <nav aria-label="Primary">
          <a href="#services">Services</a>
          <a href="#process">Process</a>
          <a href="#tools">Tools</a>
          <a href="#contact">Contact</a>
        </nav>
        <span className="nav-status">Available for selected work</span>
      </header>

      <div className="scroll-codebar" aria-hidden="true">
        <div className="scroll-codebar__track"><span /><b>&lt;/&gt;</b></div>
      </div>

      <RobotAssistant section="ORIGIN" />

      <section className="hero" id="top">
        <div className="hero-inner">
          <div className="hero-kicker mono">DIGITAL STUDIO / 01</div>
          <h1 className="hero-title">
            <span>Build something</span>
            <span>worth</span>
            <span className="hero-title-accent">exploring.</span>
          </h1>
          <p className="hero-copy">
            Websites, software, brands and digital systems shaped from the question
            underneath the brief, then built into something real.
          </p>
          <div className="hero-actions">
            <button className="hero-cta hero-cta--solid" onClick={() => setBuilderOpen(true)} data-interactive>
              <span>Start a project</span><span>↘</span>
            </button>
            <a className="hero-cta" href="#services" data-interactive>
              <span>Explore services</span><span>↘</span>
            </a>
          </div>
          <div className="hero-meta mono">
            <span>01 — STUDIO</span>
            <span>DISCOVER → CONFIGURE → BOOK</span>
          </div>
        </div>
        <div className="hero-mark" aria-hidden="true">SA</div>
      </section>

      <section className="studio-intro">
        <div className="section-heading">
          <h2 className="mono">02 / THE STUDIO</h2>
          <p>A child of the same field as the portfolio, but with a different purpose: turning a client's question into a buildable route.</p>
        </div>
        <div className="studio-intro-grid">
          <p className="studio-lead">Not a catalogue of packages.<br /><em>A place to figure out what should be built.</em></p>
          <div className="studio-copy">
            <p>Studio starts before development. It helps define the problem, identify the right capability, shape the scope and make the investment understandable.</p>
            <p>For now, the deeper tools are represented as interface placeholders. The visual system and interaction language are being locked first.</p>
          </div>
        </div>
      </section>

      <section className="services-section" id="services">
        <div className="section-heading">
          <div>
            <h2 className="mono">03 / CAPABILITY FIELD</h2>
            <p className="section-lead">Nine capability territories. Choose the problem and the route follows.</p>
          </div>
          <span className="section-index mono">FIELD / 09</span>
        </div>

        <div className="capability-field">
          <nav className="capability-list" aria-label="Studio services">
            {serviceCategories.map((category) => (
              <button
                key={category.id}
                className={activeCategory === category.id ? "capability-row is-active" : "capability-row"}
                onClick={() => setActiveCategory(category.id)}
                data-interactive
              >
                <span className="mono">{category.number}</span>
                <strong>{category.name}</strong>
                <span>↗</span>
              </button>
            ))}
          </nav>

          <article className="capability-detail">
            <span className="mono detail-label">{activeService.number} / {activeService.name}</span>
            <h3>{activeService.name}</h3>
            <p>{activeService.description}</p>
            <div className="service-index">
              {activeService.services.map((service) => (
                <span key={service}>{service}</span>
              ))}
            </div>
            <button className="text-action" onClick={() => setBuilderOpen(true)} data-interactive>
              Configure this route <span>↗</span>
            </button>
          </article>
        </div>
      </section>

      <section className="build-section" id="build">
        <div className="section-heading">
          <div>
            <h2 className="mono">04 / BUILD FIELD</h2>
            <p className="section-lead">The product journey begins here. The full configurator is coming after the visual system is locked.</p>
          </div>
          <span className="section-index mono">BUILD / PLACEHOLDER</span>
        </div>

        <div className="build-console">
          <div className="build-console__top">
            <span className="mono">PROJECT ROUTE / PREVIEW</span>
            <span className="mono">SYSTEM READY</span>
          </div>
          <div className="build-console__main">
            <div>
              <span className="mono">START WITH THE OUTCOME</span>
              <h3>What are you trying to make real?</h3>
              <p>Selecting an outcome will eventually open the guided Studio builder, pricing logic, scope model and timeline engine.</p>
            </div>
            <button className="console-action" onClick={() => setBuilderOpen(true)} data-interactive>
              <span>Open builder placeholder</span><span>↗</span>
            </button>
          </div>
          <div className="build-console__route">
            {routes.map(([number, title, copy]) => (
              <article key={number}>
                <span className="mono">{number}</span>
                <strong>{title}</strong>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="process-section" id="process">
        <div className="section-heading">
          <div>
            <h2 className="mono">05 / WORKSHOP</h2>
            <p className="section-lead">The same principle as the parent site: make the system visible, then make it useful.</p>
          </div>
          <span className="section-index mono">MAKE / SHAPE / BUILD</span>
        </div>

        <div className="workshop-intro">
          <div className="workshop-word" aria-hidden="true">DISCOVER<br /><em>SHAPE</em><br />BUILD</div>
          <p>Every project should have a reason for existing, a clear boundary and enough structure to disagree with the first idea. The Studio experience will expose that reasoning instead of hiding it behind a generic contact form.</p>
        </div>

        <div className="workshop-stations">
          {[
            ["01 / DISCOVER", "Find the actual question.", "Outcome, audience, constraints and the thing that needs to change."],
            ["02 / SHAPE", "Turn the question into scope.", "Services, requirements, complexity, dependencies and useful boundaries."],
            ["03 / BUILD", "Make the system tangible.", "Design and implementation with visible milestones and decisions."],
            ["04 / LAUNCH", "Put the finished thing into the world.", "Infrastructure, deployment, handoff and the path into the client dashboard."],
          ].map(([label, title, copy]) => (
            <article className="workshop-station" key={label}>
              <div className="workshop-station__top"><span className="mono">{label}</span><span>↗</span></div>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="tools-section" id="tools">
        <div className="section-heading">
          <div>
            <h2 className="mono">06 / STUDIO TOOLS</h2>
            <p className="section-lead">Product-like utilities that will make the Studio more useful before a booking ever happens.</p>
          </div>
          <span className="section-index mono">05 TOOLS</span>
        </div>

        <div className="tools-index">
          {tools.map(([number, title, copy]) => (
            <button className="tool-row" key={number} onClick={() => setBuilderOpen(true)} data-interactive>
              <span className="mono">{number}</span>
              <div><h3>{title}</h3><p>{copy}</p></div>
              <span className="tool-status mono">COMING / BUILD ↗</span>
            </button>
          ))}
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="contact-inner">
          <span className="mono">07 / BOOKING</span>
          <h2>Let's make something<br /><em>worth exploring.</em></h2>
          <p>Start with a project idea, a problem, or simply a question about what should be built.</p>
          <button className="contact-link" onClick={() => setBuilderOpen(true)} data-interactive>
            Start the Studio route <span>↗</span>
          </button>
        </div>
        <footer>
          <span>SHASHWAT ANEJA / STUDIO</span>
          <span>DIGITAL PRODUCT STUDIO</span>
          <span>WORK IN PROGRESS</span>
          <span><a href="https://shashwataneja.com">PARENT / 01</a></span>
        </footer>
      </section>

      {builderOpen && (
        <div className="placeholder-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setBuilderOpen(false);
        }}>
          <section className="placeholder-panel" role="dialog" aria-modal="true" aria-labelledby="placeholder-title">
            <div className="placeholder-panel__head">
              <span className="mono">BUILD FIELD / PLACEHOLDER</span>
              <button onClick={() => setBuilderOpen(false)} aria-label="Close" data-interactive>×</button>
            </div>
            <h2 id="placeholder-title">The Studio builder comes next.</h2>
            <p>The UI shell is intentionally locked first. This placeholder proves the route without pretending the pricing, agreement, payment and dashboard handoff are production-ready.</p>
            <div className="placeholder-route">
              {["Outcome", "Requirements", "Scope", "Estimate", "Agreement", "Booking"].map((item, index) => (
                <span key={item}><b>{String(index + 1).padStart(2, "0")}</b>{item}</span>
              ))}
            </div>
            <button className="text-action" onClick={() => setBuilderOpen(false)} data-interactive>Return to Studio <span>↗</span></button>
          </section>
        </div>
      )}
    </main>
  );
}
