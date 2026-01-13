import React from "react";
import "./Testimonials.css";

const testimonials = [
  {
    name: "María López",
    text: "Mi familia y yo tuvimos unas vacaciones inolvidables. Todo estuvo perfectamente organizado y con excelente atención.",
    rating: 5,
    badge: "Reserva confirmada"
  },
  {
    name: "Carlos Pérez",
    text: "Proceso de cotización rápido y muy claro. Me encantó la flexibilidad para ajustar el itinerario a mis necesidades.",
    rating: 5,
    badge: "Cliente frecuente"
  },
  {
    name: "Ana Rodríguez",
    text: "La asesoría fue excelente y encontré muy buenas opciones de hotel y tours. ¡Mil gracias!",
    rating: 4,
    badge: "Tour Europa"
  }
];

const StarRow = ({ rating = 5 }) => {
  const stars = Array.from({ length: 5 }).map((_, i) => (
    <span key={i}>{i < rating ? "★" : "☆"}</span>
  ));
  return <div className="stars" aria-label={`Calificación ${rating} de 5`}>{stars}</div>;
};

export default function Testimonials() {
  return (
    <section className="testimonials">
      <div className="intro">
        <p className="section-subtitle">Lo que opinan nuestros clientes sobre su experiencia viajando con nosotros.</p>
      </div>
      <div className="grid">
        {testimonials.map((t, idx) => (
          <article className="testimonial-card" key={idx}>
            <div className="testimonial-header">
              <div className="avatar" aria-hidden="true">{t.name.charAt(0)}</div>
              <div>
                <h3 className="name">{t.name}</h3>
                <StarRow rating={t.rating} />
              </div>
            </div>
            <p className="quote">{t.text}</p>
            {t.badge && <span className="badge">{t.badge}</span>}
          </article>
        ))}
      </div>
    </section>
  );
}