export default {
  name: 'kick',
  aliases: ['remove'],
  category: 'group',
  description: 'Kick member dari grup',
  usage: 'kick @tag',
  permission: 'admin',
  groupOnly: true,
  botAdmin: true,
  groupAdmin: true,

  run: async ({ sock, m, text }) => {
    let target = m.mentionedJid[0]

    if (!target && text) {
      let num = text.replace(/[^0-9]/g, '')
      if (num.startsWith('0')) num = '62' + num.slice(1)
      if (num) target = num + '@s.whatsapp.net'
    }

    // Jika reply pesan, kick pengirim pesan yang di-reply
    if (!target && m.quoted) {
      target = m.quoted.sender
    }

    if (!target) {
      return m.reply(
        `🚫 *KICK — Keluarkan Member*\n\n` +
        `📌 *Cara pakai:*\n` +
        `• Tag member: *kick @member*\n` +
        `• Pakai nomor: *kick 08xxxx*\n` +
        `• Reply pesan member lalu ketik *kick*\n\n` +
        `📝 *Contoh:*\n` +
        `kick @member\n` +
        `kick 08123456789\n\n` +
        `ℹ️ *Info:*\n` +
        `Bisa juga reply pesan orang yang ingin di-kick, lalu ketik *kick*.`
      )
    }

    try {
      await sock.groupParticipantsUpdate(m.from, [target], 'remove')
      m.reply(`✅ Berhasil mengeluarkan @${target.split('@')[0]} dari grup.`)
    } catch (err) {
      m.reply(`❌ Gagal kick member: ${err.message}`)
    }
  }
}
