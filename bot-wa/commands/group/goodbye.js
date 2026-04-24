import { getGroup, setGroup } from '../../database/db.js'

export default {
  name: 'goodbye',
  aliases: ['bye'],
  category: 'group',
  description: 'Toggle goodbye message on/off',
  usage: 'goodbye on/off',
  permission: 'admin',
  groupOnly: true,

  run: async ({ m, args }) => {
    if (!args[0] || !['on', 'off'].includes(args[0].toLowerCase())) {
      const groupData = getGroup(m.from)
      const status = groupData.goodbye ? 'ON ✅' : 'OFF ❌'
      return m.reply(
        `❌ Parameter tidak valid! Gunakan *on* atau *off*.\n\n` +
        `📌 *Cara pakai:*\n` +
        `goodbye on\n` +
        `goodbye off\n\n` +
        `📝 *Contoh:*\n` +
        `goodbye on → Aktifkan pesan perpisahan member keluar\n` +
        `goodbye off → Nonaktifkan pesan perpisahan\n\n` +
        `📋 *Status saat ini:* ${status}`
      )
    }

    const enable = args[0].toLowerCase() === 'on'
    setGroup(m.from, { goodbye: enable })

    m.reply(`✅ Goodbye message telah *${enable ? 'DIAKTIFKAN' : 'DINONAKTIFKAN'}*`)
  }
}
