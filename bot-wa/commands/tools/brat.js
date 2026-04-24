import sharp from 'sharp'

export default {
  name: 'brat',
  aliases: [],
  category: 'tools',
  description: 'Buat stiker brat style (teks blur)',
  usage: 'brat teks kamu',
  permission: 'user',

  run: async ({ sock, m, text }) => {
    if (!text) {
      return m.reply(`❌ *Teks belum diisi!*\n\n📌 *Cara pakai:*\nbrat teks kamu\n\n📝 *Contoh:*\n> brat Hello World\n> brat Lagi gabut nih`)
    }

    try {
      // Buat gambar brat style (putih dengan teks blur)
      const width = 512
      const height = 512
      const fontSize = Math.min(60, Math.floor(400 / Math.ceil(text.length / 15)))

      // Wrap text
      const words = text.split(' ')
      const lines = []
      let currentLine = ''
      for (const word of words) {
        if ((currentLine + ' ' + word).length > 20) {
          if (currentLine) lines.push(currentLine)
          currentLine = word
        } else {
          currentLine = currentLine ? currentLine + ' ' + word : word
        }
      }
      if (currentLine) lines.push(currentLine)

      const textSvg = lines.map((line, i) => {
        const y = (height / 2) - ((lines.length - 1) * fontSize / 2) + (i * fontSize)
        return `<text x="256" y="${y}" text-anchor="middle" font-size="${fontSize}" font-family="Arial, sans-serif" font-weight="bold" fill="#333" filter="url(#blur)">${escapeXml(line)}</text>`
      }).join('\n')

      const svg = `
        <svg width="${width}" height="${height}">
          <defs>
            <filter id="blur">
              <feGaussianBlur stdDeviation="1.5" />
            </filter>
          </defs>
          <rect width="${width}" height="${height}" fill="white"/>
          ${textSvg}
        </svg>
      `

      const stickerBuffer = await sharp(Buffer.from(svg))
        .webp({ quality: 80 })
        .toBuffer()

      await sock.sendMessage(m.from, {
        sticker: stickerBuffer,
      }, { quoted: m.msg })

    } catch (err) {
      m.reply(`❌ Gagal membuat brat: ${err.message}`)
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
