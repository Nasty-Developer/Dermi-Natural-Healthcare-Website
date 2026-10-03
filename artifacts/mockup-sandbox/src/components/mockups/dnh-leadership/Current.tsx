import { useEffect, useRef, useState } from "react";
import "./_group.css";

const leadershipProfiles = [
  {
    id: "israr-siddique",
    name: "Israr Siddique",
    role: "Director",
    company: "Dermi Natural Healthcare Pvt Ltd",
    image: "/__mockup/images/israr-siddique.jpg",
    imageWidth: 1086,
    imageHeight: 1448,
  },
  {
    id: "g-moinuddin",
    name: "G. Moinuddin",
    role: "Director",
    company: "Dermi Natural Healthcare Pvt Ltd",
    image: "/__mockup/images/g-moinuddin.jpg",
    imageWidth: 704,
    imageHeight: 1524,
  },
] as const;

function Eyebrow({ children }: { children: string }) {
  return <span className="eyebrow">{children}</span>;
}

export function Current() {
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

  const maxPortraitHeight = 540;

  return (
    <main className="leadership-preview">
      <section
        ref={sectionRef}
        className={`leadership-section page-wrap${isVisible ? " is-visible" : ""}`}
        aria-labelledby="leadership-title"
      >
        {leadershipProfiles.map((director, index) => {
          const portraitWidth = Math.min(
            450,
            (director.imageWidth / director.imageHeight) * maxPortraitHeight,
          );

          return (
            <article className="leadership-profile" key={director.id}>
              <figure className="leadership-portrait">
                <div
                  className="leadership-photo-frame"
                  style={{
                    width: `min(100%, ${portraitWidth}px)`,
                    aspectRatio: `${director.imageWidth} / ${director.imageHeight}`,
                  }}
                >
                  <img
                    src={director.image}
                    alt={`Portrait of ${director.name}`}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <figcaption
                  className="leadership-photo-caption"
                  style={{ width: `min(100%, ${portraitWidth}px)` }}
                >
                  <span>OFFICIAL PORTRAIT</span>
                  <span>{String(index + 1).padStart(2, "0")} / LEADERSHIP</span>
                </figcaption>
              </figure>
              <div className="leadership-copy">
                {index === 0 && (
                  <>
                    <Eyebrow>LEADERSHIP</Eyebrow>
                    <h2 id="leadership-title" className="serif">
                      Meet Our
                      <br />
                      <em>Directors</em>
                    </h2>
                  </>
                )}
                <div className="leadership-meta">
                  <span className="leadership-meta-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <i aria-hidden="true" />
                  <span>{director.role}</span>
                </div>
                <h3>{director.name}</h3>
                <p className="leadership-company">{director.company}</p>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}