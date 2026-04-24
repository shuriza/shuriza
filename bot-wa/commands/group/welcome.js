import { getGroup, setGroup } from '../../database/db.js'

export default {
  name: 'welcome',
  aliases: [],
  category: 'group',
  description: 'Toggle welcome message on/off',
  usage: 'welcome on/off',
  permission: 'admin',
  groupOnly: true,

  run: async ({ m, args }) => {
    if (!args[0] || !['on', 'off'].includes(args[0].toLowerCase())) {
      const groupData = getGroup(m.from)
      const status = groupData.welcome ? 'ON ✅' : 'OFF ❌'
      return m.reply(
        `❌ Parameter tidak valid! Gunakan *on* atau *off*.\n\n` +
        `📌 *Cara pakai:*\n` +
        `welcome on\n` +
        `welcome off\n\n` +
        `📝 *Contoh:*\n` +
        `welcome on → Aktifkan pesan sambutan member baru\n` +
        `welcome off → Nonaktifkan pesan sambutan\n\n` +
        `📋 *Status saat ini:* ${status}`
      )
    }

    const enable = args[0].toLowerCase() === 'on'
    setGroup(m.from, { welcome: enable })

    m.reply(`✅ Welcome message telah *${enable ? 'DIAKTIFKAN' : 'DINONAKTIFKAN'}*`)
  }
}
