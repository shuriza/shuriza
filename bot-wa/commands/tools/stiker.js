import sharp from 'sharp'

export default {
  name: 'stiker',
  aliases: ['sticker', 's'],
  category: 'tools',
  description: 'Buat stiker dari gambar/video',
  usage: 'stiker (reply/kirim gambar)',
  permission: 'user',

  run: async ({ sock, m }) => {
    const isImage = m.isImage || (m.quoted && m.quoted.isImage)

    if (!isImage) {
      return m.reply(`❌ *Gambar tidak ditemukan!*\n\n📌 *Cara pakai:*\nKirim/reply gambar lalu ketik *stiker*\n\n📝 *Contoh:*\n> Kirim foto lalu tulis: stiker\n> Atau reply gambar lalu ketik: stiker`)
    }

    try {
      m.reply('⏳ Sedang membuat stiker...')

      const buffer = m.isImage ? await m.download() : await m.downloadQuoted()

      const stickerBuffer = await sharp(buffer)
        .resize(512, 512, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .webp({ quality: 80 })
        .toBuffer()

      await sock.sendMessage(m.from, {
        sticker: stickerBuffer,
      }, { quoted: m.msg })

    } catch (err) {
      m.reply(`❌ Gagal membuat stiker: ${err.message}`)
    }
  }
}
