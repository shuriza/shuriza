import { setGroup } from '../../database/db.js'

export default {
  name: 'delwelcome',
  aliases: ['resetwelcome'],
  category: 'group',
  description: 'Hapus pesan welcome custom',
  usage: '.delwelcome',
  permission: 'admin',
  groupOnly: true,

  run: async ({ m }) => {
    setGroup(m.from, {
      welcomeMsg: '',
      welcomeTitle: '',
      welcomeBody: '',
    })

    m.reply('Pesan welcome berhasil dihapus/direset.')
  }
}
