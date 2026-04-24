import { getGroup, setGroup } from '../../database/db.js'

export default {
  name: 'antiwame',
  aliases: [],
  category: 'group',
  description: 'Toggle anti wa.me link',
  usage: 'antiwame on/off',
  permission: 'admin',
  groupOnly: true,
  botAdmin: true,

  run: async ({ m, args }) => {
    if (!args[0] || !['on', 'off'].includes(args[0].toLowerCase())) {
      const groupData = getGroup(m.from)
      const status = groupData.antiwame ? '✅ ON' : '❌ OFF'
      return m.reply(
        `⚙️ *ANTIWAME — Mode Peringatan*\n\n` +
        `Status saat ini: *${status}*\n\n` +
        `📌 *Cara pakai:*\n` +
        `Ketik *antiwame on* untuk mengaktifkan\n` +
        `Ketik *antiwame off* untuk menonaktifkan\n\n` +
        `📝 *Contoh:*\n` +
        `antiwame on\n\n` +
        `ℹ️ *Perbedaan mode:*\n` +
        `• *antiwame* — Hapus pesan wa.me + kirim peringatan\n` +
        `• *antiwame2* — Hapus pesan wa.me + langsung kick member`
      )
    }

    const enable = args[0].toLowerCase() === 'on'
    setGroup(m.from, { antiwame: enable })

    m.reply(
      enable
        ? `✅ Anti wa.me telah *DIAKTIFKAN*\nMode: Hapus pesan + peringatan`
        : `❌ Anti wa.me telah *DINONAKTIFKAN*`
    )
  }
}
