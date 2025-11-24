# Viaja con Memo

Este repositorio contiene el backend (Node.js/Express) y el frontend (React) de la aplicación Viaja con Memo.

## Requisitos
- Node.js 18+
- npm 9+
- MongoDB (para el backend)
- Git (y opcionalmente Git LFS para manejar archivos de imagen grandes)

## Estructura
- `backend/`: API REST (Express + Mongoose)
- `memo/`: Aplicación web (React)

## Variables de entorno
Las variables `.env` están ignoradas en el repositorio.
- Backend: `backend/.env`
- Frontend: `memo/.env` y `memo/.env.production`

## Instalación
1. Instalar dependencias del backend:
   ```bash
   cd backend
   npm install
   ```
2. Instalar dependencias del frontend:
   ```bash
   cd memo
   npm install
   ```

## Ejecución
- Backend:
  ```bash
  cd backend
  npm start
  ```
  El servidor se iniciará según la configuración de `server.js`.

- Frontend:
  ```bash
  cd memo
  npm start
  ```
  La aplicación se abrirá en `http://localhost:3000/` por defecto.

## Notas
- Los directorios de subida de archivos (`backend/uploads/`) y las carpetas de configuración de despliegue (`backend/.vercel/` y `memo/.vercel/`) están ignorados por Git.
- Git LFS está configurado para rastrear imágenes (`*.jpg`, `*.jpeg`, `*.png`, `*.webp`). Si no tienes instalado Git LFS, descárgalo desde https://git-lfs.com e instala con:
  ```bash
  git lfs install
  ```

## Publicación
Para publicar en GitHub:
```bash
git branch -M main
# Reemplaza TU_USUARIO y, si ya creaste el repo en GitHub, ajusta la URL
git remote add origin https://github.com/TU_USUARIO/viaja-con-memo.git
git push -u origin main
```