export default {
  name: 'rvo',
  aliases: ['readviewonce', 'viewonce'],
  category: 'tools',
  description: 'Baca pesan view once',
  usage: 'rvo (reply pesan view once)',
  permission: 'user',

  run: async ({ sock, m }) => {
    if (!m.quoted) {
      return m.reply(`❌ *Tidak ada pesan yang di-reply!*\n\n📌 *Cara pakai:*\nReply pesan view once lalu ketik *rvo*\n\n📝 *Contoh:*\n> Reply pesan view once lalu ketik: rvo`)
    }

    if (!m.quoted.isViewOnce && !m.quoted.isImage && !m.quoted.isVideo) {
      return m.reply(`❌ *Pesan yang di-reply bukan view once atau tidak mengandung media!*\n\nℹ️ Pastikan kamu reply pesan yang bertanda "view once"`)
    }

    try {
      const buffer = await m.downloadQuoted()

      if (m.quoted.isImage) {
        await sock.sendMessage(m.from, {
          image: buffer,
          caption: 'View Once Message',
        }, { quoted: m.msg })
      } else if (m.quoted.isVideo) {
        await sock.sendMessage(m.from, {
          video: buffer,
          caption: 'View Once Message',
        }, { quoted: m.msg })
      } else {
        m.reply('❌ Tipe media tidak didukung.')
      }

    } catch (err) {
      m.reply(`❌ Gagal membaca view once: ${err.message}`)
    }
  }
}
