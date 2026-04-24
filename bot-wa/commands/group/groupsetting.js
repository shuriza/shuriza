export default {
  name: 'setppgc',
  aliases: [],
  category: 'group',
  description: 'Set foto profil grup',
  usage: 'setppgc (reply/kirim gambar)',
  permission: 'admin',
  groupOnly: true,
  botAdmin: true,
  groupAdmin: true,

  run: async ({ sock, m }) => {
    const isImage = m.isImage || (m.quoted && m.quoted.isImage)

    if (!isImage) {
      return m.reply(
        `🖼️ *SETPPGC — Ubah Foto Profil Grup*\n\n` +
        `📌 *Cara pakai:*\n` +
        `• Kirim gambar dengan caption *setppgc*\n` +
        `• Atau reply gambar lalu ketik *setppgc*\n\n` +
        `📝 *Contoh:*\n` +
        `[kirim gambar] + caption: setppgc\n\n` +
        `ℹ️ *Info:*\n` +
        `Gambar yang dikirim akan dijadikan foto profil grup.`
      )
    }

    try {
      const buffer = m.isImage ? await m.download() : await m.downloadQuoted()
      await sock.updateProfilePicture(m.from, buffer)
      m.reply('✅ Foto profil grup berhasil diubah!')
    } catch (err) {
      m.reply(`❌ Gagal mengubah foto profil: ${err.message}`)
    }
  }
}
