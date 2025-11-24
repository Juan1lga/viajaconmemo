import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import api from "../utils/api";
import { assetsOrigin } from "../utils/api";
import { openWhatsApp, sanitizeNumber } from "../utils/whatsapp";

const buildImageSrc = (image) => {
  if (!image) return "https://via.placeholder.com/600x400?text=Paquete";
  return image.startsWith("/uploads/") ? `${assetsOrigin}${image}` : image;
};

const Checkout = () => {
  const { id } = useParams();
  const location = useLocation();
  const initialPkg = location.state?.pkg || null;
  const [pkg, setPkg] = useState(initialPkg);
  const [loading, setLoading] = useState(!initialPkg);
  const [error, setError] = useState("");


  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const { data } = await api.get(`/packages/${id}`);
        setPkg(data);
      } catch (e) {
        setError("No se pudo cargar el paquete.");
      } finally {
        setLoading(false);
      }
    };
    if (!initialPkg) {
      fetchPackage();
    } else {
      setLoading(false);
    }
  }, [id, initialPkg]);

  if (loading) return <div className="checkout"><p>Cargando...</p></div>;
  if (error) return <div className="checkout"><p>{error}</p></div>;
  if (!pkg) return <div className="checkout"><p>No se encontró el paquete.</p></div>;

  const handleCheckout = () => {
    const num = process.env.REACT_APP_WHATSAPP_NUMBER;
    const clean = sanitizeNumber(num);
    if (!clean) {
      setError("No hay número de WhatsApp configurado. Añade REACT_APP_WHATSAPP_NUMBER en el .env del front.");
      return;
    }
    const parts = [
      `Hola, me interesa el paquete "${pkg.name}"`,
      `Precio: $${pkg.price} USD`,
      Array.isArray(pkg.departureDates) && pkg.departureDates.length ? `Fechas: ${pkg.departureDates.join(", ")}` : null,
      pkg.city ? `Ciudades: ${pkg.city}` : null
    ].filter(Boolean);
    const msg = parts.join("\n");
    openWhatsApp(clean, msg);
  };
const imgSrc = buildImageSrc(pkg.image);

  return (
    <div className="checkout" style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
      <h2>Checkout</h2>
      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 16 }}>
        <img src={imgSrc} alt={pkg.name} style={{ width: "100%", borderRadius: 8, objectFit: "cover" }} />
        <div>
          <h3 style={{ marginTop: 0 }}>{pkg.name}</h3>
          <p>{pkg.description}</p>
          <p style={{ fontWeight: 700 }}>Precio: ${pkg.price}</p>
          <button style={{ background: "#0071c2", color: "#fff", border: 0, borderRadius: 8, padding: "10px 14px", cursor: "pointer" }} onClick={handleCheckout}>Continuar con la compra</button>
          <div style={{ marginTop: 12 }}>
            <Link to={`/packages/${pkg._id}`}>Volver al detalle</Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;