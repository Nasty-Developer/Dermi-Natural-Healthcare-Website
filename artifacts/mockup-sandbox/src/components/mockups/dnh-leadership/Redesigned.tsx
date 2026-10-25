import { useEffect, useRef, useState } from "react";
import "./_group.css";
import "./Redesigned.css";

const directors = [
  {
    id: "israr-siddique",
    name: "Israr Siddique",
    image: "/__mockup/images/israr-siddique.jpg",
    width: 1086,
    height: 1448,
  },
  {
    id: "g-moinuddin",
    name: "G. Moinuddin",
    image: "/__mockup/images/g-moinuddin.jpg",
    width: 704,
    height: 1524,
  },
] as const;

export function Redesigned() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <main className="leadership-preview dnh-redesign">
      <section
        ref={sectionRef}
        className={`dnh-leadership page-wrap${isVisible ? " is-visible" : ""}`}
        aria-labelledby="dnh-leadership-title"
      >
        <header className="dnh-heading">
          <span className="dnh-eyebrow">Leadership</span>
          <h2 id="dnh-leadership-title" className="serif">
            Our <em>Directors</em>
          </h2>
          <span className="dnh-heading-rule" aria-hidden="true" />
        </header>

        <div className="dnh-director-pair">
          {directors.map((director, index) => (
            <article className="dnh-director" key={director.id}>
              <figure className="dnh-portrait">
                <span className="dnh-portrait-halo" aria-hidden="true" />
                <div className="dnh-portrait-image">
                  <img
                    src={director.image}
                    alt={`Portrait of ${director.name}`}
                    width={director.width}
                    height={director.height}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </figure>
              <div className="dnh-profile-copy">
                <span className="dnh-profile-index" aria-hidden="true">
                  0{index + 1}
                </span>
                <div>
                  <h3>{director.name}</h3>
                  <p>Director of Dermi Natural Healthcare Pvt Ltd</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}