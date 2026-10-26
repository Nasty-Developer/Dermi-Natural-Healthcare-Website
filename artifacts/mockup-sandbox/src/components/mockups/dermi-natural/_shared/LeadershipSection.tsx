import { type ReactNode } from 'react';
import { leadershipProfiles } from '@/data/leadership';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';

function Eyebrow({ children }: { children: ReactNode }) {
  return <span className="eyebrow">{children}</span>;
}

export function LeadershipSection() {
  const { ref, isVisible } = useScrollReveal<HTMLElement>();
  return <section
    id="leadership"
    ref={ref}
    className={`leadership-section page-wrap${isVisible ? ' is-visible' : ''}`}
    aria-labelledby="leadership-title"
    data-testid="section-leadership"
  >
    <header className="leadership-heading">
      <Eyebrow>LEADERSHIP</Eyebrow>
      <h2 id="leadership-title" className="serif">Meet Our <em>Directors</em></h2>
    </header>
    <div className="leadership-grid">
      {leadershipProfiles.map((director, index) => (
        <article className="leadership-card" key={director.id} data-testid={`card-director-${director.id}`}>
          <figure className="leadership-portrait">
            <div className="leadership-photo-frame">
              <img
                src={director.image}
                alt={`Portrait of ${director.name}`}
                loading="lazy"
                decoding="async"
                style={director.imageObjectPosition ? { objectPosition: director.imageObjectPosition } : undefined}
                data-testid={`img-director-${director.id}`}
              />
            </div>
            <figcaption className="leadership-photo-caption">
              <span>OFFICIAL PORTRAIT</span>
              <span>{String(index + 1).padStart(2, '0')} / LEADERSHIP</span>
            </figcaption>
          </figure>
          <div className="leadership-copy">
            <div className="leadership-meta">
              <span className="leadership-meta-number">{String(index + 1).padStart(2, '0')}</span>
              <i aria-hidden="true" />
              <span>{director.role}</span>
            </div>
            <h3>{director.name}</h3>
            <p className="leadership-company">{director.company}</p>
          </div>
        </article>
      ))}
    </div>
  </section>;
}
