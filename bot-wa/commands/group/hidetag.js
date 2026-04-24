export default {
  name: 'hidetag',
  aliases: ['ht', 'tagall'],
  category: 'group',
  description: 'Tag semua member grup (hidden)',
  usage: 'hidetag <pesan>',
  permission: 'admin',
  groupOnly: true,

  run: async ({ sock, m, text }) => {
    if (!text) {
      return m.reply(
        `📢 *HIDETAG — Tag Semua Member*\n\n` +
        `📌 *Cara pakai:*\n` +
        `Ketik *hidetag* diikuti pesan yang ingin dikirim\n\n` +
        `📝 *Contoh:*\n` +
        `hidetag Rapat jam 8 malam ya\n` +
        `hidetag Jangan lupa bayar iuran\n\n` +
        `ℹ️ *Info:*\n` +
        `Semua member akan di-tag secara tersembunyi (hidden mention).`
      )
    }

    const groupMeta = await sock.groupMetadata(m.from)
    const participants = groupMeta.participants.map(p => p.id)

    await sock.sendMessage(m.from, {
      text: text,
      mentions: participants,
    })
  }
}
