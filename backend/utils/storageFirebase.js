const path = require("path");
const fs = require("fs");

// Guarda un buffer o stream localmente en la carpeta /uploads y devuelve la ruta pública relativa
async function saveLocalFile({ filename, buffer }) {
  const uploadsDir = path.join(__dirname, "..", "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  const uniqueName = `${Date.now()}-${filename}`;
  const filePath = path.join(uploadsDir, uniqueName);
  await fs.promises.writeFile(filePath, buffer);
  const publicPath = `/uploads/${uniqueName}`;
  return { publicPath, absolutePath: filePath };
}

// Borra un archivo local si existe
async function deleteLocalFile(publicPath) {
  try {
    const absolutePath = path.join(__dirname, "..", publicPath.replace(/^\/?uploads\//, "uploads/"));
    if (fs.existsSync(absolutePath)) {
      await fs.promises.unlink(absolutePath);
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
}

module.exports = {
  saveLocalFile,
  deleteLocalFile
};