export default {
  name: 'add',
  aliases: [],
  category: 'group',
  description: 'Tambah member ke grup',
  usage: 'add <nomor>',
  permission: 'admin',
  groupOnly: true,
  botAdmin: true,
  groupAdmin: true,

  run: async ({ sock, m, args, text }) => {
    if (!text) {
      return m.reply(
        `➕ *ADD — Tambah Member*\n\n` +
        `📌 *Cara pakai:*\n` +
        `Ketik *add* diikuti nomor HP yang ingin ditambahkan\n\n` +
        `📝 *Contoh:*\n` +
        `add 08123456789\n` +
        `add 628123456789\n\n` +
        `ℹ️ *Info:*\n` +
        `Nomor yang diawali 0 akan otomatis diubah ke format 62.`
      )
    }

    let num = text.replace(/[^0-9]/g, '')
    if (num.startsWith('0')) num = '62' + num.slice(1)
    const jid = num + '@s.whatsapp.net'

    try {
      const res = await sock.groupParticipantsUpdate(m.from, [jid], 'add')
      const status = res[0]?.status || res[0]?.content?.attrs?.type

      if (status === '403') {
        m.reply('❌ Gagal menambahkan! Nomor tersebut mengaktifkan privasi grup.')
      } else if (status === '409') {
        m.reply('❌ Member sudah ada di grup!')
      } else {
        m.reply(`✅ Berhasil menambahkan @${num} ke grup!`)
      }
    } catch (err) {
      m.reply(`❌ Gagal menambahkan member: ${err.message}`)
    }
  }
}
