# Changelog

## v0.2.1 (2026-01-14)

### Frontend
- Mejora de estilos y organización de componentes y servicios para una UI más consistente.
- Correcciones en hooks de React para evitar bucles en useEffect y mejorar estabilidad.

### Backend
- Optimización en endpoints de salud y proceso de arranque para mejores tiempos de respuesta.
- Ajustes de rendimiento en compresión y keep-alive.

### Documentación
- Se mantiene README sin cambios funcionales; flujo de splash y health siguen vigentes.


## v0.2.0 (2026-01-13)

### Frontend
- Renta de vehículos: animación del botón de WhatsApp y mejoras de hover en tarjetas e imágenes (RentaVehiculos.css). 
- Cards y PackageCard: fondos y sombras suaves, layout estable sin saltos, efectos de entrada/hover consistentes (Cards.css, PackageCard.css). 
- HeroBanner: título más grande y animado, botones con mejores transiciones (HeroBanner.css). 
- CompanyPage: color y contorno del texto en el encabezado "Nuestra Empresa" (CompanyPage.css). 
- ServiceDetail: eliminación del mensaje visible de "Cargando" en favor del overlay global y mantenimiento del layout estable (ServiceDetail.js). 
- Splash global y transiciones entre páginas: pantalla de carga inicial y overlay de transición en cambios de ruta (LoadingSplash.js, PageTransitionOverlay.js, App.js).

### Backend
- CORS robusto con lista de orígenes permitidos en entorno local y producción, soporte para credenciales y cabeceras necesarias (server.js). 
- Health endpoints: `/health` y `/api/health` para ver estado de conexión a DB y salud del servicio (server.js). 
- Compresión HTTP y Keep-Alive configurados para mejorar el rendimiento (server.js).

### API y Caché
- Cliente Axios con manejo de token y respuestas resilientes ante errores de red (api.js). 
- Caché local con revalidación en segundo plano para paquetes y álbumes; uso de cache buster `_ts` en endpoints en vivo (api.js).

### Documentación
- Actualización del README con notas de ejecución, splash y salud del backend.

### Notas
- Las variables de entorno están ignoradas por Git (.env, backend/.env, memo/.env). 
- Asegurar que `MONGO_URI`, `CORS_ORIGIN`, `JWT_SECRET` y `REACT_APP_API_BASE` estén configuradas según el entorno.