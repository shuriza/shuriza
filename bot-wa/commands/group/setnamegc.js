export default {
  name: 'setnamegc',
  aliases: ['setnamagc'],
  category: 'group',
  description: 'Ubah nama grup',
  usage: 'setnamegc <nama baru>',
  permission: 'admin',
  groupOnly: true,
  botAdmin: true,
  groupAdmin: true,

  run: async ({ sock, m, text }) => {
    if (!text) {
      return m.reply(
        `✏️ *SETNAMEGC — Ubah Nama Grup*\n\n` +
        `📌 *Cara pakai:*\n` +
        `Ketik *setnamegc* diikuti nama baru untuk grup\n\n` +
        `📝 *Contoh:*\n` +
        `setnamegc Grup Keren 2026\n` +
        `setnamegc Komunitas Bot WA\n\n` +
        `ℹ️ *Info:*\n` +
        `Nama grup akan langsung berubah setelah perintah dijalankan.`
      )
    }

    try {
      await sock.groupUpdateSubject(m.from, text)
      m.reply(`✅ Nama grup berhasil diubah menjadi: *${text}*`)
    } catch (err) {
      m.reply(`❌ Gagal mengubah nama grup: ${err.message}`)
    }
  }
}
