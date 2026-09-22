import { useEffect, useMemo, useState, type CSSProperties } from "react";
import "./styles/app.css";
import { serviceCategories } from "./data/services";
import { estimateProject, formatINR, type DeliverySpeed, type ProjectGoal, type ProjectScale } from "./data/pricing";
import RobotAssistant from "./components/RobotAssistant";
import ThemeToggle, { type ThemeMode } from "./components/ThemeToggle";

const outcomes: Array<[string, string, string, ProjectGoal]> = [
  ["01", "I need a stronger online presence.", "Website, landing page, portfolio or business presence.", "presence"],
  ["02", "I need to sell online.", "Storefront, catalogue, payments and commerce workflows.", "commerce"],
  ["03", "I need software built.", "Web app, dashboard, SaaS MVP or custom platform.", "application"],
  ["04", "I need a brand people remember.", "Identity, UI direction, content and brand systems.", "brand"],
  ["05", "I need more people to find and convert.", "SEO, analytics, content and conversion work.", "growth"],
];

const proofPoints = [
  ["01", "Clear before clever", "You see the route, scope and investment before a project becomes a commitment."],
  ["02", "Built around your goal", "The service follows the business problem. You do not have to know the technical vocabulary first."],
  ["03", "Transparent starting points", "Indicative ranges are visible early. Third-party costs and taxes stay separate."],
  ["04", "Human handoff", "Once a booking is confirmed, the work can move into the dedicated client dashboard."],
];

const tools = [
  ["01", "What Do I Need?", "Answer a few questions and get a recommended route."],
  ["02", "Budget Optimizer", "See what can fit without quietly changing the brief."],
  ["03", "Project Blueprint", "Turn a rough idea into a structured project outline."],
  ["04", "Timeline Builder", "Understand delivery phases before you commit."],
  ["05", "Digital Presence Score", "Find the gaps worth fixing first."],
];

const faq = [
  ["Do I need to know exactly what I want?", "No. Studio is designed to start from an outcome, not a technical specification."],
  ["Can I see an estimate before booking?", "Yes. The Studio estimate flow is designed to show an indicative range and the 2% booking amount before confirmation."],
  ["Are domain, hosting and other third-party costs included?", "No. Third-party charges, taxes and provider fees remain separate and are shown separately when applicable."],
  ["What happens after I book?", "A confirmed booking can initialize the client and project records, after which the ongoing project experience moves to the client dashboard."],
];

function App() {
  const [activeCategory, setActiveCategory] = useState("web");
  const [builderOpen, setBuilderOpen] = useState(false);
  const [builderStep, setBuilderStep] = useState(1);
  const [goal, setGoal] = useState<ProjectGoal>("presence");
  const [scale, setScale] = useState<ProjectScale>("standard");
  const [speed, setSpeed] = useState<DeliverySpeed>("standard");
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem("studio-theme") as ThemeMode | null;
    return saved === "light" || saved === "dark" || saved === "system" ? saved : "system";
  });
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const activeService = useMemo(
    () => serviceCategories.find((category) => category.id === activeCategory) ?? serviceCategories[0],
    [activeCategory],
  );

  const estimate = useMemo(() => estimateProject(goal, scale, speed), [goal, scale, speed]);

  useEffect(() => {
    const root = document.documentElement;
    const applyTheme = () => {
      const resolved = theme === "system"
        ? (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark")
        : theme;
      root.dataset.theme = resolved;
      root.style.colorScheme = resolved;
    };
    applyTheme();
    localStorage.setItem("studio-theme", theme);
    const media = matchMedia("(prefers-color-scheme: light)");
    media.addEventListener?.("change", applyTheme);
    return () => media.removeEventListener?.("change", applyTheme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    const move = (event: PointerEvent) => {
      root.style.setProperty("--cursor-x", `${event.clientX}px`);
      root.style.setProperty("--cursor-y", `${event.clientY}px`);
      root.style.setProperty("--pointer-x", `${((event.clientX / innerWidth) - .5) * 10}px`);
      root.style.setProperty("--pointer-y", `${((event.clientY / innerHeight) - .5) * 10}px`);
    };
    const over = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      document.documentElement.classList.toggle("cursor-active", Boolean(target?.closest("a,button,[data-interactive]")));
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("mouseover", over);
    };
  }, []);

  useEffect(() => {
    const items = [...document.querySelectorAll<HTMLElement>("[data-reveal]")];
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -8% 0px" });
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  const openBuilder = (nextGoal?: ProjectGoal) => {
    if (nextGoal) setGoal(nextGoal);
    setBuilderStep(1);
    setBuilderOpen(true);
  };

  return (
    <main className="studio-site">
      <div className="studio-environment" aria-hidden="true">
        <div className="environment-field environment-field--one" />
        <div className="environment-field environment-field--two" />
        <div className="environment-field environment-field--three" />
        <div className="environment-vignette" />
        <div className="grain" />
      </div>

      <div className="custom-cursor" aria-hidden="true"><span /><small>EXPLORE</small></div>

      <header className="site-nav">
        <a className="wordmark" href="#top" aria-label="Shashwat Aneja Studio">SA<span>/</span>STUDIO</a>
        <nav aria-label="Primary">
          <a href="#services">Services</a>
          <a href="#outcomes">Solutions</a>
          <a href="#process">How it works</a>
          <a href="#tools">Tools</a>
        </nav>
        <div className="nav-right">
          <span className="nav-status">Projects open · India / Online</span>
          <ThemeToggle mode={theme} onChange={setTheme} />
        </div>
      </header>

      <div className="scroll-codebar" aria-hidden="true">
        <div className="scroll-codebar__track"><span /><b>&lt;/&gt;</b></div>
      </div>

      <RobotAssistant section="START" />

      <section className="hero" id="top">
        <div className="hero-inner">
          <div className="hero-kicker mono reveal reveal--up" data-reveal>STUDIO / DIGITAL SERVICES</div>
          <h1 className="hero-title reveal reveal--up reveal--delay-1" data-reveal>
            <span>Don't just</span>
            <span>build a website.</span>
            <span className="hero-title-accent">Build what it needs to do.</span>
          </h1>
          <p className="hero-copy reveal reveal--up reveal--delay-2" data-reveal>
            Websites, software, design, branding, infrastructure, automation and growth, configured around the outcome you actually need.
          </p>
          <div className="hero-actions reveal reveal--up reveal--delay-3" data-reveal>
            <button id="builder-trigger" className="hero-cta hero-cta--solid" onClick={() => openBuilder()} data-interactive>
              <span>Build my project</span><span>↘</span>
            </button>
            <a className="hero-cta" href="#services" data-interactive><span>See what I can do</span><span>↘</span></a>
          </div>
          <div className="hero-meta mono reveal reveal--up reveal--delay-4" data-reveal>
            <span>STARTING FROM ₹4,999</span><span>2% BOOKING · NO LONG-TERM ACCOUNT REQUIRED</span>
          </div>
        </div>
        <div className="hero-mark" aria-hidden="true">SA</div>
        <div className="hero-coordinate mono" aria-hidden="true">28.6139 / 77.2090</div>
      </section>

      <section className="conversion-strip" aria-label="Studio benefits">
        <div><span className="mono">01</span><strong>Tell us the outcome.</strong><small>No technical brief required.</small></div>
        <div><span className="mono">02</span><strong>Shape the scope.</strong><small>Services and requirements become clear.</small></div>
        <div><span className="mono">03</span><strong>See the investment.</strong><small>Indicative range before booking.</small></div>
        <div><span className="mono">04</span><strong>Book when ready.</strong><small>2% of the estimated project cost.</small></div>
      </section>

      <section className="services-section" id="services">
        <div className="section-heading reveal reveal--up" data-reveal>
          <div><h2 className="mono">01 / SERVICES</h2><p className="section-lead">Everything you need to make the digital side of the business work harder.</p></div>
          <span className="section-index mono">09 CAPABILITIES</span>
        </div>

        <div className="services-layout">
          <nav className="capability-list" aria-label="Studio services">
            {serviceCategories.map((category, index) => (
              <button
                key={category.id}
                className={activeCategory === category.id ? "capability-row is-active" : "capability-row"}
                onClick={() => setActiveCategory(category.id)}
                data-interactive
                style={{ "--row-index": index } as CSSProperties}
              >
                <span className="mono">{category.number}</span>
                <strong>{category.name}</strong>
                <span>↗</span>
              </button>
            ))}
          </nav>

          <article className="service-preview" key={activeService.id}>
            <div className="service-preview__top">
              <span className="mono">{activeService.number} / {activeService.name}</span>
              <span className="service-preview__pulse">READY TO CONFIGURE</span>
            </div>
            <h3>{activeService.name}</h3>
            <p>{activeService.description}</p>
            <div className="service-index">
              {activeService.services.map((service) => <span key={service}>{service}</span>)}
            </div>
            <div className="service-preview__bottom">
              <span className="mono">FROM ₹{activeCategory === "web" ? "4,999" : "299"}</span>
              <button className="text-action" onClick={() => openBuilder(activeCategory === "commerce" ? "commerce" : activeCategory === "application" ? "application" : activeCategory === "branding" ? "brand" : activeCategory === "growth" ? "growth" : "presence")} data-interactive>
                Configure this service <span>↗</span>
              </button>
            </div>
          </article>
        </div>
      </section>

      <section className="outcomes-section" id="outcomes">
        <div className="section-heading reveal reveal--up" data-reveal>
          <div><h2 className="mono">02 / START WITH THE PROBLEM</h2><p className="section-lead">You do not need to choose a service first. Choose what needs to change.</p></div>
          <span className="section-index mono">5 ROUTES</span>
        </div>

        <div className="outcome-grid">
          {outcomes.map(([number, title, copy, value], index) => (
            <button
              className="outcome-card reveal reveal--up"
              data-reveal
              key={number}
              onClick={() => openBuilder(value)}
              data-interactive
              style={{ "--card-index": index } as CSSProperties}
            >
              <span className="mono">{number}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
              <span className="outcome-card__cta">Find my route ↗</span>
            </button>
          ))}
        </div>
      </section>

      <section className="estimate-section" id="estimate">
        <div className="estimate-copy reveal reveal--left" data-reveal>
          <span className="mono">03 / PRICE WITHOUT THE GUESSWORK</span>
          <h2>See what your project could look like before you talk to anyone.</h2>
          <p>Pick a goal, project scale and delivery speed. This is the same direction the full Studio configurator will use to build a more detailed estimate.</p>
          <button className="hero-cta hero-cta--solid" onClick={() => openBuilder()} data-interactive><span>Open estimate builder</span><span>↘</span></button>
        </div>
        <div className="estimate-card reveal reveal--up" data-reveal>
          <div className="estimate-card__top"><span className="mono">LIVE INDICATIVE RANGE</span><span className="estimate-live"><i /> CALCULATING</span></div>
          <div className="estimate-number">{formatINR(estimate.low)} <span>— {formatINR(estimate.high)}</span></div>
          <div className="estimate-booking"><span>Booking amount</span><strong>{formatINR(Math.max(estimate.booking, 4999))}</strong></div>
          <div className="estimate-tags"><span>{goal}</span><span>{scale}</span><span>{speed}</span></div>
          <div className="estimate-card__hint">Final scope, third-party costs and taxes are confirmed before payment.</div>
        </div>
      </section>

      <section className="proof-section">
        <div className="section-heading reveal reveal--up" data-reveal>
          <div><h2 className="mono">04 / WHY THE STUDIO EXISTS</h2><p className="section-lead">The sales experience should reduce uncertainty, not manufacture pressure.</p></div>
        </div>
        <div className="proof-grid">
          {proofPoints.map(([number, title, copy]) => (
            <article className="proof-card reveal reveal--up" data-reveal key={number}>
              <span className="mono">{number}</span><h3>{title}</h3><p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="process-section" id="process">
        <div className="section-heading reveal reveal--up" data-reveal>
          <div><h2 className="mono">05 / HOW IT WORKS</h2><p className="section-lead">A sales journey that feels like a product, not a form.</p></div>
          <span className="section-index mono">DISCOVER → BOOK</span>
        </div>
        <div className="process-rail">
          {[
            ["01", "Discover", "Start with your outcome. Studio recommends where to begin."],
            ["02", "Configure", "Add requirements, complexity and delivery preferences."],
            ["03", "Estimate", "See indicative scope, investment, booking amount and timeline."],
            ["04", "Review", "Confirm the route and agreement before payment."],
            ["05", "Book", "Pay 2% to confirm. Only then is the client/project record initialized."],
          ].map(([number, title, copy], index) => (
            <article className="process-card reveal reveal--up" data-reveal key={number} style={{ "--card-index": index } as CSSProperties}>
              <span className="mono">{number}</span>
              <div className="process-card__line" />
              <h3>{title}</h3><p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="tools-section" id="tools">
        <div className="section-heading reveal reveal--up" data-reveal>
          <div><h2 className="mono">06 / FREE STUDIO TOOLS</h2><p className="section-lead">Useful enough to try before you are ready to buy.</p></div>
          <span className="section-index mono">NO SIGN-UP / PREVIEW</span>
        </div>
        <div className="tools-index">
          {tools.map(([number, title, copy], index) => (
            <button className="tool-row reveal reveal--up" data-reveal key={number} onClick={() => openBuilder()} data-interactive style={{ "--tool-index": index } as CSSProperties}>
              <span className="mono">{number}</span>
              <div><h3>{title}</h3><p>{copy}</p></div>
              <span className="tool-status mono">TRY PREVIEW ↗</span>
            </button>
          ))}
        </div>
      </section>

      <section className="faq-section">
        <div className="section-heading reveal reveal--up" data-reveal>
          <div><h2 className="mono">07 / BEFORE YOU START</h2><p className="section-lead">The useful answers, before the sales conversation.</p></div>
        </div>
        <div className="faq-list">
          {faq.map(([question, answer], index) => (
            <button className={openFaq === index ? "faq-row is-open" : "faq-row"} key={question} onClick={() => setOpenFaq(openFaq === index ? null : index)} data-interactive>
              <span className="mono">0{index + 1}</span>
              <div><h3>{question}</h3>{openFaq === index && <p>{answer}</p>}</div>
              <strong>{openFaq === index ? "−" : "+"}</strong>
            </button>
          ))}
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="contact-inner reveal reveal--up" data-reveal>
          <span className="mono">08 / START HERE</span>
          <h2>Have the idea.<br /><em>Let's shape the build.</em></h2>
          <p>You can arrive with a complete brief, a half-formed idea or just a business problem. The Studio route starts there.</p>
          <div className="contact-actions">
            <button className="hero-cta hero-cta--solid" onClick={() => openBuilder()} data-interactive><span>Build my project</span><span>↘</span></button>
            <a className="hero-cta" href="mailto:studio@shashwataneja.com" data-interactive><span>Ask a question</span><span>↗</span></a>
          </div>
        </div>
        <footer><span>SHASHWAT ANEJA / STUDIO</span><span>DIGITAL SERVICES · INDIA / ONLINE</span><span>2% BOOKING</span><span><a href="https://shashwataneja.com">PARENT / 01</a></span></footer>
      </section>

      {builderOpen && (
        <div className="builder-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setBuilderOpen(false); }}>
          <section className="builder-panel" role="dialog" aria-modal="true" aria-labelledby="builder-title">
            <div className="builder-head">
              <div><span className="mono">STUDIO BUILDER / {String(builderStep).padStart(2, "0")} OF 03</span><h2 id="builder-title">{builderStep === 1 ? "What are you trying to achieve?" : builderStep === 2 ? "How much build do you need?" : "How quickly do you need it?"}</h2></div>
              <button className="builder-close" onClick={() => setBuilderOpen(false)} aria-label="Close" data-interactive>×</button>
            </div>

            <div className="builder-progress"><span style={{ width: `${builderStep * 33.333}%` }} /></div>

            {builderStep === 1 && (
              <div className="builder-options">
                {outcomes.map(([number, title, copy, value]) => (
                  <button key={value} className={goal === value ? "builder-option active" : "builder-option"} onClick={() => setGoal(value)} data-interactive>
                    <span className="mono">{number}</span><div><strong>{title}</strong><small>{copy}</small></div><b>↗</b>
                  </button>
                ))}
              </div>
            )}

            {builderStep === 2 && (
              <div className="builder-options builder-options--three">
                {[
                  ["lean", "Lean", "Focused launch or smaller scope."],
                  ["standard", "Standard", "A complete business-ready build."],
                  ["advanced", "Advanced", "Complex product, platform or growth system."],
                ].map(([value, title, copy]) => (
                  <button key={value} className={scale === value ? "builder-option active" : "builder-option"} onClick={() => setScale(value as ProjectScale)} data-interactive>
                    <span className="mono">/</span><div><strong>{title}</strong><small>{copy}</small></div><b>↗</b>
                  </button>
                ))}
              </div>
            )}

            {builderStep === 3 && (
              <div className="builder-final">
                <div className="speed-options">
                  {[
                    ["standard", "Standard", "Normal delivery"],
                    ["priority", "Priority", "+25%"],
                    ["rush", "Rush", "+20%"],
                  ].map(([value, title, copy]) => (
                    <button key={value} className={speed === value ? "speed-option active" : "speed-option"} onClick={() => setSpeed(value as DeliverySpeed)} data-interactive>
                      <strong>{title}</strong><span>{copy}</span>
                    </button>
                  ))}
                </div>
                <div className="builder-summary">
                  <span className="mono">INDICATIVE INVESTMENT</span>
                  <strong>{formatINR(estimate.low)} — {formatINR(estimate.high)}</strong>
                  <div><span>Estimated booking</span><b>{formatINR(Math.max(estimate.booking, 4999))}</b></div>
                  <small>Placeholder for the production scope engine. Final quote is confirmed from the actual selected services and requirements.</small>
                </div>
              </div>
            )}

            <div className="builder-footer">
              <button className="text-action" onClick={() => builderStep > 1 ? setBuilderStep(builderStep - 1) : setBuilderOpen(false)} data-interactive>{builderStep > 1 ? "Back" : "Close"} <span>↖</span></button>
              {builderStep < 3
                ? <button className="hero-cta hero-cta--solid" onClick={() => setBuilderStep(builderStep + 1)} data-interactive><span>Continue</span><span>↘</span></button>
                : <button className="hero-cta hero-cta--solid" onClick={() => setBuilderOpen(false)} data-interactive><span>Keep this route</span><span>↘</span></button>}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default App;
