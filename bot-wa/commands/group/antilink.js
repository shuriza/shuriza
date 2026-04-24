import { getGroup, setGroup } from '../../database/db.js'

export default {
  name: 'antilink',
  aliases: [],
  category: 'group',
  description: 'Toggle anti-link (hapus pesan berisi link)',
  usage: 'antilink on/off',
  permission: 'admin',
  groupOnly: true,
  botAdmin: true,

  run: async ({ m, args }) => {
    if (!args[0] || !['on', 'off'].includes(args[0].toLowerCase())) {
      const groupData = getGroup(m.from)
      const status = groupData.antilink ? '✅ ON' : '❌ OFF'
      return m.reply(
        `⚙️ *ANTILINK — Mode Peringatan*\n\n` +
        `Status saat ini: *${status}*\n\n` +
        `📌 *Cara pakai:*\n` +
        `Ketik *antilink on* untuk mengaktifkan\n` +
        `Ketik *antilink off* untuk menonaktifkan\n\n` +
        `📝 *Contoh:*\n` +
        `antilink on\n\n` +
        `ℹ️ *Perbedaan mode:*\n` +
        `• *antilink* — Hapus pesan + kirim peringatan\n` +
        `• *antilink2* — Hapus pesan + langsung kick member`
      )
    }

    const enable = args[0].toLowerCase() === 'on'
    setGroup(m.from, { antilink: enable })

    m.reply(
      enable
        ? `✅ Anti-link telah *DIAKTIFKAN*\nMode: Hapus pesan + peringatan`
        : `❌ Anti-link telah *DINONAKTIFKAN*`
    )
  }
}
