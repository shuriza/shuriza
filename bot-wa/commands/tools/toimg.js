import sharp from 'sharp'

export default {
  name: 'toimg',
  aliases: ['toimage', 'stikertoimg'],
  category: 'tools',
  description: 'Konversi stiker ke gambar',
  usage: 'toimg (reply stiker)',
  permission: 'user',

  run: async ({ sock, m }) => {
    const isSticker = m.isSticker || (m.quoted && m.quoted.isSticker)

    if (!isSticker) {
      return m.reply(`❌ *Stiker tidak ditemukan!*\n\n📌 *Cara pakai:*\nReply stiker lalu ketik *toimg*\n\n📝 *Contoh:*\n> Reply sebuah stiker lalu ketik: toimg`)
    }

    try {
      const buffer = m.isSticker ? await m.download() : await m.downloadQuoted()

      const imgBuffer = await sharp(buffer)
        .png()
        .toBuffer()

      await sock.sendMessage(m.from, {
        image: imgBuffer,
        caption: '✅ Stiker berhasil dikonversi ke gambar!',
      }, { quoted: m.msg })

    } catch (err) {
      m.reply(`❌ Gagal konversi: ${err.message}`)
    }
  }
}
