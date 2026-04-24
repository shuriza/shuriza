import { getGroup } from '../../database/db.js'

export default {
  name: 'close',
  aliases: ['tutup'],
  category: 'group',
  description: 'Tutup grup (hanya admin yang bisa kirim pesan)',
  usage: 'close',
  permission: 'admin',
  groupOnly: true,
  botAdmin: true,

  run: async ({ sock, m }) => {
    const groupData = getGroup(m.from)

    await sock.groupSettingUpdate(m.from, 'announcement')

    const msg = groupData.closeMsg || 'Grup telah *DITUTUP*. Hanya admin yang bisa mengirim pesan.'
    m.reply(
      `✅ ${msg}\n\n` +
      `ℹ️ Perintah ini hanya bisa dipakai di grup. Bot harus jadi admin.\n` +
      `💡 Gunakan *setclose* untuk mengatur pesan custom saat grup ditutup.`
    )
  }
}
