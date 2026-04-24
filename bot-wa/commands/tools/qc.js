import axios from 'axios'

export default {
  name: 'qc',
  aliases: ['quotechat', 'quotecard'],
  category: 'tools',
  description: 'Buat quote card / fake chat stiker',
  usage: 'qc teks yang mau dijadikan quote',
  permission: 'user',

  run: async ({ sock, m, text }) => {
    if (!text) {
      return m.reply(`❌ *Teks belum diisi!*\n\n📌 *Cara pakai:*\nqc teks yang mau dijadikan quote\n\n📝 *Contoh:*\n> qc Halo dunia!\n> qc Semangat pagi guys`)
    }

    try {
      m.reply('⏳ Sedang membuat quote card...')

      // Menggunakan API quotly
      const res = await axios.post('https://bot.lyo.su/quote/generate', {
        type: 'quote',
        format: 'webp',
        backgroundColor: '#1b1429',
        messages: [{
          entities: [],
          avatar: true,
          from: {
            id: 1,
            name: m.pushName || 'User',
            photo: { url: '' },
          },
          text: text,
          replyMessage: {},
        }],
      }, {
        headers: { 'Content-Type': 'application/json' },
      })

      if (res.data?.result?.image) {
        const buffer = Buffer.from(res.data.result.image, 'base64')

        await sock.sendMessage(m.from, {
          sticker: buffer,
        }, { quoted: m.msg })
      } else {
        m.reply('❌ Gagal membuat quote card.')
      }

    } catch (err) {
      m.reply(`❌ Gagal membuat QC: ${err.message}`)
    }
  }
}
