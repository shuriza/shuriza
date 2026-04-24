export default {
  name: 'promote',
  aliases: [],
  category: 'group',
  description: 'Jadikan member sebagai admin grup',
  usage: 'promote @tag',
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

    if (!target && m.quoted) {
      target = m.quoted.sender
    }

    if (!target) {
      return m.reply(
        `⬆️ *PROMOTE — Jadikan Admin*\n\n` +
        `📌 *Cara pakai:*\n` +
        `• Tag member: *promote @member*\n` +
        `• Pakai nomor: *promote 08xxxx*\n` +
        `• Reply pesan member lalu ketik *promote*\n\n` +
        `📝 *Contoh:*\n` +
        `promote @member\n` +
        `promote 08123456789\n\n` +
        `ℹ️ *Info:*\n` +
        `Member yang di-promote akan menjadi admin grup.`
      )
    }

    try {
      await sock.groupParticipantsUpdate(m.from, [target], 'promote')
      m.reply(`✅ @${target.split('@')[0]} telah dijadikan admin grup.`)
    } catch (err) {
      m.reply(`❌ Gagal promote: ${err.message}`)
    }
  }
}
