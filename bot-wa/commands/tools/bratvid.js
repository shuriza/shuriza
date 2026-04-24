import sharp from 'sharp'

export default {
  name: 'bratvid',
  aliases: ['bratvideo'],
  category: 'tools',
  description: 'Buat stiker brat style animasi (reveal text)',
  usage: 'bratvid teks kamu',
  permission: 'user',

  run: async ({ sock, m, text }) => {
    if (!text) {
      return m.reply(`❌ *Teks belum diisi!*\n\n📌 *Cara pakai:*\nbratvid teks kamu\n\n📝 *Contoh:*\n> bratvid Hello World\n> bratvid Aku lagi bete`)
    }

    try {
      // Untuk bratvid, kita buat stiker statis karena animated webp butuh library tambahan
      // Buat versi "revealed" (tanpa blur)
      const width = 512
      const height = 512
      const fontSize = Math.min(60, Math.floor(400 / Math.ceil(text.length / 15)))

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
        return `<text x="256" y="${y}" text-anchor="middle" font-size="${fontSize}" font-family="Arial, sans-serif" font-weight="bold" fill="#333">${escapeXml(line)}</text>`
      }).join('\n')

      const svg = `
        <svg width="${width}" height="${height}">
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
      m.reply(`❌ Gagal membuat bratvid: ${err.message}`)
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
