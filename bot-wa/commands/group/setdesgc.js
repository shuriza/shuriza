export default {
  name: 'setdesgc',
  aliases: ['setdescgc'],
  category: 'group',
  description: 'Ubah deskripsi grup',
  usage: 'setdesgc <deskripsi baru>',
  permission: 'admin',
  groupOnly: true,
  botAdmin: true,
  groupAdmin: true,

  run: async ({ sock, m, text }) => {
    if (!text) {
      return m.reply(
        `📝 *SETDESGC — Ubah Deskripsi Grup*\n\n` +
        `📌 *Cara pakai:*\n` +
        `Ketik *setdesgc* diikuti deskripsi baru untuk grup\n\n` +
        `📝 *Contoh:*\n` +
        `setdesgc Grup ini untuk diskusi bot WhatsApp\n` +
        `setdesgc Rules: No spam, no link\n\n` +
        `ℹ️ *Info:*\n` +
        `Deskripsi grup akan langsung berubah setelah perintah dijalankan.`
      )
    }

    try {
      await sock.groupUpdateDescription(m.from, text)
      m.reply('✅ Deskripsi grup berhasil diubah!')
    } catch (err) {
      m.reply(`❌ Gagal mengubah deskripsi: ${err.message}`)
    }
  }
}
