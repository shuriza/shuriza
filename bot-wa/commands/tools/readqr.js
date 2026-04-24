import jsQR from 'jsqr'
import sharp from 'sharp'

export default {
  name: 'readqr',
  aliases: ['scanqr', 'qrread'],
  category: 'tools',
  description: 'Baca/scan QR code dari gambar',
  usage: 'readqr (reply/kirim gambar QR)',
  permission: 'user',

  run: async ({ m }) => {
    const isImage = m.isImage || (m.quoted && m.quoted.isImage)

    if (!isImage) {
      return m.reply(`❌ *Gambar tidak ditemukan!*\n\n📌 *Cara pakai:*\nKirim/reply gambar QR lalu ketik *readqr*\n\n📝 *Contoh:*\n> Kirim foto QR code lalu tulis: readqr\n> Atau reply gambar QR lalu ketik: readqr`)
    }

    try {
      const buffer = m.isImage ? await m.download() : await m.downloadQuoted()

      // Convert ke raw RGBA pixel data
      const { data, info } = await sharp(buffer)
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true })

      const code = jsQR(new Uint8ClampedArray(data), info.width, info.height)

      if (code) {
        m.reply(`✅ *QR Code berhasil dibaca!*\n\n📄 *Hasil:*\n${code.data}`)
      } else {
        m.reply('❌ QR Code tidak ditemukan dalam gambar.\n\nℹ️ Pastikan gambar jelas dan QR code terlihat dengan baik.')
      }

    } catch (err) {
      m.reply(`❌ Gagal membaca QR: ${err.message}`)
    }
  }
}
