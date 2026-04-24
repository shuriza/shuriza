import { getBot, setBot, setGroup } from '../../database/db.js'

export default {
  name: 'sewabot',
  aliases: ['sewa', 'rent'],
  category: 'bot',
  description: 'Kelola sewa bot untuk grup',
  usage: 'sewabot <add/del/list> <groupId> <durasi hari>',
  permission: 'owner',

  run: async ({ m, args, text }) => {
    const sub = args[0]?.toLowerCase()

    if (!sub || !['add', 'del', 'list'].includes(sub)) {
      return m.reply(
        `═[ SEWA BOT ]═───···\n\n` +
        `ℹ️ Kelola sewa bot untuk grup WhatsApp.\n\n` +
        `📌 *Cara pakai:*\n` +
        `sewabot add <groupId> <durasi hari>\n` +
        `sewabot del <groupId>\n` +
        `sewabot list\n\n` +
        `📝 *Contoh:*\n` +
        `sewabot add 120363xxx@g.us 30\n` +
        `sewabot del 120363xxx@g.us\n\n` +
        `ℹ️ *Tip:* Kirim di dalam grup untuk otomatis pakai group ID:\n` +
        `sewabot add 30`
      )
    }

    const botData = getBot()
    if (!botData.sewa) botData.sewa = []

    if (sub === 'list') {
      if (botData.sewa.length === 0) {
        return m.reply(
          `═[ DAFTAR SEWA ]═───···\n\n` +
          `ℹ️ Belum ada grup yang menyewa bot.\n\n` +
          `📌 Tambahkan sewa dengan:\n` +
          `sewabot add <groupId> <durasi hari>`
        )
      }

      let text = `═[ DAFTAR SEWA ]═───···\n\n`
      botData.sewa.forEach((s, i) => {
        const expiry = new Date(s.expiry)
        const isExpired = expiry <= new Date()
        text += `${i + 1}. ${s.groupId}\n`
        text += `   📅 Expired: ${expiry.toLocaleDateString('id-ID')}\n`
        text += `   ${isExpired ? '❌ Status: EXPIRED' : '✅ Status: AKTIF'}\n\n`
      })
      text += `Total: ${botData.sewa.length} grup`
      return m.reply(text)
    }

    if (sub === 'add') {
      let groupId, days

      if (m.isGroup && args.length === 2) {
        // Di grup: sewabot add 30
        groupId = m.from
        days = parseInt(args[1])
      } else if (args.length >= 3) {
        // sewabot add <groupId> <days>
        groupId = args[1]
        days = parseInt(args[2])
      } else {
        return m.reply(
          `❌ Format salah!\n\n` +
          `📌 *Cara pakai:*\n` +
          `sewabot add <groupId> <durasi hari>\n\n` +
          `📝 *Contoh:*\n` +
          `sewabot add 120363xxx@g.us 30\n\n` +
          `ℹ️ Atau kirim di dalam grup:\n` +
          `sewabot add <durasi hari>`
        )
      }

      if (isNaN(days) || days < 1) {
        return m.reply('❌ Durasi harus berupa angka positif!\n\n📝 *Contoh:* sewabot add 30')
      }

      const expiry = new Date()
      expiry.setDate(expiry.getDate() + days)

      // Update atau tambah sewa
      const existing = botData.sewa.findIndex(s => s.groupId === groupId)
      if (existing >= 0) {
        botData.sewa[existing].expiry = expiry.toISOString()
      } else {
        botData.sewa.push({ groupId, expiry: expiry.toISOString() })
      }

      setBot(botData)

      // Update group data juga
      setGroup(groupId, { sewa: expiry.toISOString() })

      m.reply(
        `✅ Sewa bot berhasil ditambahkan!\n\n` +
        `• Grup    : ${groupId}\n` +
        `• Durasi  : ${days} hari\n` +
        `• Expired : ${expiry.toLocaleDateString('id-ID', { dateStyle: 'full' })}`
      )
    }

    if (sub === 'del') {
      let groupId = args[1] || (m.isGroup ? m.from : null)

      if (!groupId) {
        return m.reply(
          `❌ Group ID tidak ditemukan!\n\n` +
          `📌 *Cara pakai:*\n` +
          `sewabot del <groupId>\n\n` +
          `ℹ️ Atau kirim di dalam grup untuk otomatis hapus sewa grup ini.`
        )
      }

      const index = botData.sewa.findIndex(s => s.groupId === groupId)
      if (index === -1) {
        return m.reply('❌ Grup tidak ditemukan di daftar sewa.')
      }

      botData.sewa.splice(index, 1)
      setBot(botData)

      // Reset group sewa
      setGroup(groupId, { sewa: null })

      m.reply(`✅ Sewa bot untuk grup *${groupId}* berhasil dihapus.`)
    }
  }
}
