export default function Home() {
  return (
    <main className="home-shell">
      <div className="home-card">
        <div className="home-content">
          <p className="home-kicker">RAADS-R Test</p>
          <h1 className="home-title">Assess your autistic traits</h1>
          <p className="home-subtitle">
            Answer a short series of questions to review how your experiences compare across several categories.
          </p>
          <a href="/question" className="home-link">
            <button type="button" className="home-button">
              Start
            </button>
          </a>
        </div>
      </div>
    </main>
  );
}
