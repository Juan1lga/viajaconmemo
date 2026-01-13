const mongoose = require('mongoose');

const PackageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  // Descripción corta (puede usarse como resumen); el itinerario detallado estará en otro campo
  description: { type: String, default: '' },
  // Texto de precio libre (permite números y letras)
  priceCustom: { type: String, default: '' },
  priceCustom2: { type: String, default: '' },
  priceCustom3: { type: String, default: '' },
  priceCustom4: { type: String, default: '' },
  // Precio legacy para compatibilidad; se usará priceDouble si existe
  price: { type: Number, default: 0 },
  // Nueva configuración de precios y moneda
  currency: { type: String, enum: ['USD','MXN'], default: 'USD' },
  priceDouble: { type: Number, default: 0 },
  priceDoubleLabel: { type: String, default: 'Base doble' },
  priceChild: { type: Number, default: 0 },
  priceAdult: { type: Number, default: 0 },
  // Duración libre y/o rango de fechas
  duration: { type: String, default: '' },
  startDate: { type: Date },
  endDate: { type: Date },
  // Categoría con nueva opción de fin de semana
  category: { type: String, enum: ['Hoteles en la Riviera Maya','Hoteles Nacionales','Nuestros paquetes nacionales','Nuestros pasadías','Nuestros paquetes internacionales','Nuestros viajes a Europa','Renta de vehículos'], default: 'Nuestros paquetes nacionales' },
  // Itinerario detallado
  itinerary: { type: String, default: '' },
  includes: { type: [String], default: [] },
  popular: { type: Boolean, default: false },
  image: { type: String, required: true },
  // URL principal para la foto del paquete (alias de image)
  mainPhotoUrl: { type: String, default: '' },
  // Mes específico de viaje en formato YYYY-MM para filtrar
  travelMonth: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Package', PackageSchema);