import Image from "next/image";
import Nav from "./components/Nav";
import GaitFigure from "./components/GaitFigure";
import CopyEmail from "./components/CopyEmail";
import { profile, roles, projects, stack, education } from "./data/portfolio-data";

function Tags({ items }: { items: string[] }) {
  return (
    <ul className="tags" aria-label="Skills used">
      {items.map((s) => (
        <li key={s}>{s}</li>
      ))}
    </ul>
  );
}

export default function Home() {
  return (
    <>
      <Nav name={profile.name} />

      <main id="top">
        {/* Intro */}
        <section className="hero wrap">
          <div className="hero__text">
            <div className="hero__id">
              <div className="avatar">
                <Image src="/portrait.jpg" alt="Portrait of Taabish Sutriwala" width={240} height={252} priority />
                <span className="avatar__mark avatar__mark--a" aria-hidden="true" />
                <span className="avatar__mark avatar__mark--b" aria-hidden="true" />
                <span className="avatar__mark avatar__mark--c" aria-hidden="true" />
              </div>
              <p className="status">
                <span className="status__pip" aria-hidden="true" />
                <span>
                  {profile.status}
                  <br />
                  Based in the {profile.location}
                </span>
              </p>
            </div>
            <h1>
              Taabish <em>Sutriwala</em>
            </h1>
            <p className="hero__tagline">{profile.tagline}</p>
            <p className="hero__intro">{profile.intro}</p>
            <div className="cta">
              <a className="btn btn--ink" href="#projects">See the work</a>
              <a className="btn" href={profile.github} target="_blank" rel="noreferrer">GitHub ↗</a>
              <a className="btn" href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
            </div>
          </div>
          <div className="hero__fig">
            <GaitFigure />
            <p className="fig-note">
              A walker drawn from joint angles, using the same math my lab pipeline runs on patient video. Scroll faster
              and it picks up the pace.
            </p>
          </div>
        </section>

        {/* Skills */}
        <section id="skills" className="wrap section" aria-labelledby="s-h">
          <h2 id="s-h" className="h2">Skills</h2>
          <dl className="index">
            {stack.map((g) => (
              <div key={g.group} className="index__row">
                <dt>{g.group}</dt>
                <dd>{g.items.join(" · ")}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Experience */}
        <section id="experience" className="wrap section" aria-labelledby="w-h">
          <h2 id="w-h" className="h2">Experience</h2>
          <ol className="roles">
            {roles.map((r) => (
              <li key={r.org} className="role">
                <div className="role__meta">
                  <p className="mono">{r.period}</p>
                  <p className="mono dim">{r.place}</p>
                </div>
                <div className="role__body">
                  <h3>
                    {r.title}
                    <span className="role__org"> · {r.org}</span>
                  </h3>
                  <p className="role__team">{r.team}</p>
                  <ul className="role__points">
                    {r.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                  <Tags items={r.stack} />
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Projects */}
        <section id="projects" className="wrap section" aria-labelledby="p-h">
          <h2 id="p-h" className="h2">Projects</h2>
          <div className="projects">
            {projects.map((p, i) => (
              <article key={p.id} className={`project ${i % 2 ? "project--flip" : ""}`}>
                <div className="project__text">
                  <p className="mono dim">
                    {p.kind} · {p.period}
                  </p>
                  <h3>{p.name}</h3>
                  {p.links.length > 0 && (
                    <p className="links">
                      {p.links.map((l, j) => (
                        <a
                          key={l.href}
                          href={l.href}
                          target="_blank"
                          rel="noreferrer"
                          className={j === 0 ? "link-btn link-btn--primary" : "link-btn"}
                        >
                          {l.label} ↗
                        </a>
                      ))}
                    </p>
                  )}
                  <dl>
                    <dt>Problem</dt>
                    <dd>{p.problem}</dd>
                    <dt>Built</dt>
                    <dd>{p.built}</dd>
                    <dt>Result</dt>
                    <dd className="result">{p.result}</dd>
                  </dl>
                  <Tags items={p.stack} />
                </div>
                <figure className="project__fig">
                  {p.figure.type === "image" ? (
                    <div className="plate">
                      <Image src={p.figure.src} alt={p.figure.alt} fill sizes="(max-width: 860px) 100vw, 480px" />
                    </div>
                  ) : (
                    <pre className="plate plate--log">
                      {p.figure.lines.map((l) => {
                        const [t, tag, ...rest] = l.split(/\s{2,}/);
                        return (
                          <span key={l} className={`log log--${tag.toLowerCase()}`}>
                            <i>{t}</i> <b>{tag}</b> {rest.join("  ")}
                            {"\n"}
                          </span>
                        );
                      })}
                    </pre>
                  )}
                  <figcaption>{p.figure.caption}</figcaption>
                </figure>
              </article>
            ))}
          </div>
        </section>

        {/* Education */}
        <section id="education" className="wrap section" aria-labelledby="e-h">
          <h2 id="e-h" className="h2">Education</h2>
          <ul className="edu">
            {education.map((e) => (
              <li key={e.school}>
                <div>
                  <p className="edu__deg">{e.degree}</p>
                  <p className="edu__school">{e.school}</p>
                  {e.detail && <p className="edu__detail">{e.detail}</p>}
                </div>
                <div className="edu__meta mono">
                  <span>{e.period}</span>
                  <span>GPA {e.gpa}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Contact */}
        <section id="contact" className="wrap section contact" aria-labelledby="c-h">
          <h2 id="c-h" className="h2">Contact</h2>
          <p className="contact__lede">The fastest way to reach me is email.</p>
          <CopyEmail email={profile.email} />
          <p className="contact__links">
            <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
            <a href={profile.github} target="_blank" rel="noreferrer">GitHub ↗</a>
            <a href={`tel:${profile.phone.replace(/[^+\d]/g, "")}`}>{profile.phone}</a>
          </p>
        </section>
      </main>

      <footer className="wrap footer">
        <span>© {new Date().getFullYear()} {profile.name}</span>
      </footer>
    </>
  );
}
