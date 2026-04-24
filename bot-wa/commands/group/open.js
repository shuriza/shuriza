import { getGroup } from '../../database/db.js'

export default {
  name: 'open',
  aliases: ['buka'],
  category: 'group',
  description: 'Buka grup (semua member bisa kirim pesan)',
  usage: 'open',
  permission: 'admin',
  groupOnly: true,
  botAdmin: true,

  run: async ({ sock, m }) => {
    const groupData = getGroup(m.from)

    await sock.groupSettingUpdate(m.from, 'not_announcement')

    const msg = groupData.openMsg || 'Grup telah *DIBUKA*. Semua member bisa mengirim pesan.'
    m.reply(
      `✅ ${msg}\n\n` +
      `ℹ️ Perintah ini hanya bisa dipakai di grup. Bot harus jadi admin.\n` +
      `💡 Gunakan *setopen* untuk mengatur pesan custom saat grup dibuka.`
    )
  }
}
