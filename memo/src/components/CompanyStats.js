import React from "react";

const CompanyStats = ({ stats = {} }) => {
  const countries = Number(stats.countries) || 0;
  const sales = Number(stats.sales) || 0;
  const satisfaction = Math.max(0, Math.min(100, Number(stats.satisfaction) || 0));

  const countryGoal = 50; // meta de referencia
  const salesGoal = 2000; // meta de referencia

  const pctCountries = Math.max(0, Math.min(100, (countries / countryGoal) * 100));
  const pctSales = Math.max(0, Math.min(100, (sales / salesGoal) * 100));

  const radius = 36;
  const stroke = 8;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - satisfaction / 100);

  const cardStyle = {
    background: "#f7f7f8",
    border: "1px solid #e6e6ea",
    borderRadius: 12,
    padding: 16
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 16,
    marginTop: 16
  };

  const titleStyle = { margin: 0, fontSize: "1.1rem" };
  const valueStyle = { margin: "6px 0 12px 0", fontSize: "1.4rem", fontWeight: 600 };

  return (
    <section className="company-stats" style={{ marginTop: 24 }}>
      <h2 style={{ marginBottom: 8 }}>Estadísticas</h2>
      <div style={gridStyle}>
        <div style={cardStyle}>
          <h3 style={titleStyle}>Países visitados</h3>
          <div style={valueStyle}>{countries} países</div>
          <svg width="100%" height="28" viewBox="0 0 220 28" role="img" aria-label={`Progreso países ${Math.round(pctCountries)}%`}>
            <rect x="0" y="6" width="220" height="16" rx="8" fill="#e6e6ea" />
            <rect x="0" y="6" width={220 * (pctCountries / 100)} height="16" rx="8" fill="#16a34a" />
          </svg>
          <div style={{ fontSize: "0.9rem", color: "#6b7280", marginTop: 6 }}>{Math.round(pctCountries)}% de la meta ({countryGoal})</div>
        </div>

        <div style={cardStyle}>
          <h3 style={titleStyle}>Ventas al año</h3>
          <div style={valueStyle}>{sales} ventas</div>
          <svg width="100%" height="28" viewBox="0 0 220 28" role="img" aria-label={`Progreso ventas ${Math.round(pctSales)}%`}>
            <rect x="0" y="6" width="220" height="16" rx="8" fill="#e6e6ea" />
            <rect x="0" y="6" width={220 * (pctSales / 100)} height="16" rx="8" fill="#16a34a" />
          </svg>
          <div style={{ fontSize: "0.9rem", color: "#6b7280", marginTop: 6 }}>{Math.round(pctSales)}% de la meta ({salesGoal})</div>
        </div>

        <div style={cardStyle}>
          <h3 style={titleStyle}>Clientes satisfechos</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <svg width="96" height="96" viewBox="0 0 96 96" role="img" aria-label={`Satisfacción ${Math.round(satisfaction)}%`}>
              <circle cx="48" cy="48" r={radius} fill="none" stroke="#e6e6ea" strokeWidth={stroke} />
              <circle cx="48" cy="48" r={radius} fill="none" stroke="#16a34a" strokeWidth={stroke} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" transform="rotate(-90 48 48)" />
              <text x="50%" y="52%" textAnchor="middle" dominantBaseline="middle" fontSize="16" fill="#1f2937">{Math.round(satisfaction)}%</text>
            </svg>
            <div>
              <div style={valueStyle}>{Math.round(satisfaction)}%</div>
              <div style={{ fontSize: "0.9rem", color: "#6b7280" }}>de satisfacción</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyStats;