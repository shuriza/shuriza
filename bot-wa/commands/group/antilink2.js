import { getGroup, setGroup } from '../../database/db.js'

export default {
  name: 'antilink2',
  aliases: [],
  category: 'group',
  description: 'Toggle anti-link mode kick (hapus + kick)',
  usage: 'antilink2 on/off',
  permission: 'admin',
  groupOnly: true,
  botAdmin: true,

  run: async ({ m, args }) => {
    if (!args[0] || !['on', 'off'].includes(args[0].toLowerCase())) {
      const groupData = getGroup(m.from)
      const status = groupData.antilink2 ? '✅ ON' : '❌ OFF'
      return m.reply(
        `⚙️ *ANTILINK2 — Mode Kick*\n\n` +
        `Status saat ini: *${status}*\n\n` +
        `📌 *Cara pakai:*\n` +
        `Ketik *antilink2 on* untuk mengaktifkan\n` +
        `Ketik *antilink2 off* untuk menonaktifkan\n\n` +
        `📝 *Contoh:*\n` +
        `antilink2 on\n\n` +
        `ℹ️ *Info:*\n` +
        `Mode ini lebih tegas dari *antilink* biasa.\n` +
        `Member yang kirim link akan langsung *dihapus pesannya + di-kick* dari grup.`
      )
    }

    const enable = args[0].toLowerCase() === 'on'
    setGroup(m.from, { antilink2: enable })

    m.reply(
      enable
        ? `✅ Anti-link2 (kick) telah *DIAKTIFKAN*\nMode: Hapus pesan + kick member`
        : `❌ Anti-link2 (kick) telah *DINONAKTIFKAN*`
    )
  }
}
