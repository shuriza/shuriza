import sharp from 'sharp'

export default {
  name: 'smeme',
  aliases: ['stikermeme', 'memestiker'],
  category: 'tools',
  description: 'Buat stiker meme dari gambar + teks',
  usage: 'smeme teks atas | teks bawah',
  permission: 'user',

  run: async ({ sock, m, text }) => {
    const isImage = m.isImage || (m.quoted && m.quoted.isImage)

    if (!isImage) {
      return m.reply(`❌ *Gambar tidak ditemukan!*\n\n📌 *Cara pakai:*\nKirim/reply gambar lalu ketik *smeme teks atas | teks bawah*\n\n📝 *Contoh:*\n> Kirim foto lalu tulis: smeme Ketika | Kamu Lupa`)
    }

    if (!text) {
      return m.reply(`❌ *Teks belum diisi!*\n\n📌 *Cara pakai:*\nsmeme teks atas | teks bawah\n\n📝 *Contoh:*\n> smeme Ketika | Kamu Lupa\n> smeme POV | Lagi Galau\n\nℹ️ Gunakan tanda *|* untuk memisahkan teks atas dan bawah`)
    }

    try {
      m.reply('⏳ Sedang membuat stiker meme...')

      const buffer = m.isImage ? await m.download() : await m.downloadQuoted()
      const parts = text.split('|')
      const topText = parts[0] || ''
      const bottomText = parts[1] || ''

      // Resize gambar ke 512x512
      const resized = await sharp(buffer)
        .resize(512, 512, { fit: 'cover' })
        .png()
        .toBuffer()

      // Buat SVG overlay dengan teks
      const svgText = `
        <svg width="512" height="512">
          <style>
            .top { fill: white; font-size: 42px; font-weight: bold; font-family: Impact, sans-serif; }
            .bottom { fill: white; font-size: 42px; font-weight: bold; font-family: Impact, sans-serif; }
          </style>
          ${topText ? `
          <text x="256" y="60" text-anchor="middle" class="top" stroke="black" stroke-width="3">${escapeXml(topText)}</text>
          ` : ''}
          ${bottomText ? `
          <text x="256" y="480" text-anchor="middle" class="bottom" stroke="black" stroke-width="3">${escapeXml(bottomText)}</text>
          ` : ''}
        </svg>
      `

      const stickerBuffer = await sharp(resized)
        .composite([{
          input: Buffer.from(svgText),
          top: 0,
          left: 0,
        }])
        .webp({ quality: 80 })
        .toBuffer()

      await sock.sendMessage(m.from, {
        sticker: stickerBuffer,
      }, { quoted: m.msg })

    } catch (err) {
      m.reply(`❌ Gagal membuat stiker meme: ${err.message}`)
    }
  }
}

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
