import { getGroup, setGroup } from '../../database/db.js'

export default {
  name: 'antiwame2',
  aliases: [],
  category: 'group',
  description: 'Toggle anti wa.me mode kick',
  usage: 'antiwame2 on/off',
  permission: 'admin',
  groupOnly: true,
  botAdmin: true,

  run: async ({ m, args }) => {
    if (!args[0] || !['on', 'off'].includes(args[0].toLowerCase())) {
      const groupData = getGroup(m.from)
      const status = groupData.antiwame2 ? '✅ ON' : '❌ OFF'
      return m.reply(
        `⚙️ *ANTIWAME2 — Mode Kick*\n\n` +
        `Status saat ini: *${status}*\n\n` +
        `📌 *Cara pakai:*\n` +
        `Ketik *antiwame2 on* untuk mengaktifkan\n` +
        `Ketik *antiwame2 off* untuk menonaktifkan\n\n` +
        `📝 *Contoh:*\n` +
        `antiwame2 on\n\n` +
        `ℹ️ *Info:*\n` +
        `Mode ini lebih tegas dari *antiwame* biasa.\n` +
        `Member yang kirim link wa.me akan langsung *dihapus pesannya + di-kick* dari grup.`
      )
    }

    const enable = args[0].toLowerCase() === 'on'
    setGroup(m.from, { antiwame2: enable })

    m.reply(
      enable
        ? `✅ Anti wa.me2 (kick) telah *DIAKTIFKAN*\nMode: Hapus pesan + kick member`
        : `❌ Anti wa.me2 (kick) telah *DINONAKTIFKAN*`
    )
  }
}
