export default {
  name: 'demote',
  aliases: [],
  category: 'group',
  description: 'Hapus admin dari member',
  usage: 'demote @tag',
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
        `⬇️ *DEMOTE — Copot Admin*\n\n` +
        `📌 *Cara pakai:*\n` +
        `• Tag member: *demote @member*\n` +
        `• Pakai nomor: *demote 08xxxx*\n` +
        `• Reply pesan admin lalu ketik *demote*\n\n` +
        `📝 *Contoh:*\n` +
        `demote @member\n` +
        `demote 08123456789\n\n` +
        `ℹ️ *Info:*\n` +
        `Admin yang di-demote akan kembali menjadi member biasa.`
      )
    }

    try {
      await sock.groupParticipantsUpdate(m.from, [target], 'demote')
      m.reply(`✅ @${target.split('@')[0]} telah dicopot dari admin grup.`)
    } catch (err) {
      m.reply(`❌ Gagal demote: ${err.message}`)
    }
  }
}
