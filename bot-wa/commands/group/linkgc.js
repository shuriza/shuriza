export default {
  name: 'linkgc',
  aliases: ['linkgroup', 'gclink'],
  category: 'group',
  description: 'Dapatkan link invite grup',
  usage: 'linkgc',
  permission: 'admin',
  groupOnly: true,
  botAdmin: true,

  run: async ({ sock, m }) => {
    try {
      const code = await sock.groupInviteCode(m.from)
      m.reply(`🔗 Link grup:\nhttps://chat.whatsapp.com/${code}`)
    } catch (err) {
      m.reply(`❌ Gagal mendapatkan link: ${err.message}`)
    }
  }
}
