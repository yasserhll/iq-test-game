import { PRESS_QUOTES } from '../data/gameData';

export default function Press() {
  const doubled = [...PRESS_QUOTES, ...PRESS_QUOTES];

  return (
    <section className="press" id="press">
      <div className="press-track">
        {doubled.map((q, i) => (
          <div key={i} className="press-card">
            <p className="press-q">{q.quote}</p>
            <div className="press-score">{q.score}</div>
            <div className="press-src">{q.source}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
