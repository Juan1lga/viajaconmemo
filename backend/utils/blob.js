const { put, del } = require('@vercel/blob');

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_TOKEN;

async function uploadBuffer(filename, buffer, contentType) {
  const res = await put(filename, buffer, { access: 'public', contentType, token: BLOB_TOKEN });
  return res.url;
}

async function deleteByUrl(url) {
  if (!url) return;
  await del(url, { token: BLOB_TOKEN });
}

module.exports = { uploadBuffer, deleteByUrl };