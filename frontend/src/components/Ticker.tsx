import { TICKER_ITEMS } from '../data/gameData';

export default function Ticker() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="ticker">
      <div className="ticker-track">
        {doubled.map((item, i) => (
          <span key={i} className="t-item">
            {item} <span className="t-sep">&#9733;</span>
          </span>
        ))}
      </div>
    </div>
  );
}
