import { getGroup } from '../../database/db.js'

export default {
  name: 'ceksewa',
  aliases: ['checksewa'],
  category: 'group',
  description: 'Cek status sewa bot di grup',
  usage: 'ceksewa',
  permission: 'user',
  groupOnly: true,

  run: async ({ m }) => {
    const groupData = getGroup(m.from)

    if (!groupData.sewa) {
      return m.reply('ℹ️ Bot di grup ini *tidak dalam mode sewa* (permanent/free).')
    }

    const expiry = new Date(groupData.sewa)
    const now = new Date()

    if (expiry <= now) {
      return m.reply('❌ Sewa bot di grup ini sudah *EXPIRED*!\nHubungi owner untuk perpanjang.')
    }

    const diff = expiry - now
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    let text = `═[ ✅ CEK SEWA ]═───···\n\n`
    text += `Status: *AKTIF*\n`
    text += `Expired: ${expiry.toLocaleDateString('id-ID', { dateStyle: 'full' })}\n`
    text += `Sisa: ${days} hari ${hours} jam\n`

    m.reply(text)
  }
}
