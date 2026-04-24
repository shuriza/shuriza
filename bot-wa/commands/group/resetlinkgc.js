export default {
  name: 'resetlinkgc',
  aliases: ['revokelinkgc'],
  category: 'group',
  description: 'Reset link invite grup',
  usage: 'resetlinkgc',
  permission: 'admin',
  groupOnly: true,
  botAdmin: true,
  groupAdmin: true,

  run: async ({ sock, m }) => {
    try {
      const newCode = await sock.groupRevokeInvite(m.from)
      m.reply(`✅ Link grup berhasil direset!\n\n🔗 Link baru:\nhttps://chat.whatsapp.com/${newCode}`)
    } catch (err) {
      m.reply(`❌ Gagal reset link: ${err.message}`)
    }
  }
}
