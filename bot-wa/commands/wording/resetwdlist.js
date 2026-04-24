import { getWording, setWording } from '../../database/db.js'

export default {
  name: 'resetwdlist',
  aliases: ['resetwording'],
  category: 'wording',
  description: 'Reset semua wording list ke default',
  usage: 'resetwdlist',
  permission: 'owner',

  run: async ({ m }) => {
    const wording = getWording()
    wording.list = ''
    wording.list2 = ''
    wording.list3 = ''
    wording.formatKeys = {}
    setWording(wording)

    m.reply(
      `✅ *Semua wording list berhasil direset ke default!*\n\n` +
      `ℹ️ Yang direset:\n` +
      `   • Wording list slot 1, 2, 3\n` +
      `   • Format key tampilan produk\n\n` +
      `💡 Ketik *setlist <template>* untuk set wording baru.\n` +
      `💡 Ketik *tutorsetlist* untuk tutorial lengkap.`
    )
  }
}
