import { getBot } from '../../database/db.js'
import { getGreeting, formatDate } from '../../lib/utils.js'

export default {
  name: 'menu',
  aliases: ['help', 'bantuan'],
  category: 'bot',
  description: 'Tampilkan menu bot',
  usage: 'menu',
  permission: 'user',

  run: async ({ sock, m }) => {
    const botData = getBot()
    const botName = botData.name || 'Store Bot'
    const storeName = botData.storeName || 'My Store'

    let text = ''
    text += `${getGreeting()}, @${m.sender.split('@')[0]}!\n\n`
    text += `╭─═[ ${botName} ]═───···\n`
    text += `│ Store  : ${storeName}\n`
    text += `│ Tanggal: ${formatDate()}\n`
    text += `│ Ketik nama perintah langsung\n`
    text += `│ tanpa awalan apapun\n`
    text += `╰─────···\n\n`

    // MENU STORE
    text += `┌─═[ MENU STORE ]═───···\n`
    text += `│\n`
    text += `╎» list\n`
    text += `╎» pay\n`
    text += `╎» setpay\n`
    text += `╎» delpay\n`
    text += `╎» jeda\n`
    text += `╎» addlist\n`
    text += `╎» dellist\n`
    text += `╎» updatelist\n`
    text += `╎» renamelist\n`
    text += `╎» resetlist\n`
    text += `╎» done\n`
    text += `╎» setdone\n`
    text += `╎» changedone\n`
    text += `╎» delsetdone\n`
    text += `╎» proses\n`
    text += `╎» setproses\n`
    text += `╎» changeproses\n`
    text += `╎» delsetproses\n`
    text += `│\n`

    // MENU GROUP
    text += `├─═[ MENU GROUP ]═───···\n`
    text += `│\n`
    text += `╎» open\n`
    text += `╎» setopen\n`
    text += `╎» close\n`
    text += `╎» setclose\n`
    text += `╎» welcome on/off\n`
    text += `╎» goodbye on/off\n`
    text += `╎» setwelcome\n`
    text += `╎» setwelcometitle\n`
    text += `╎» setwelcomebody\n`
    text += `╎» testwelcome\n`
    text += `╎» delwelcome\n`
    text += `╎» setleft\n`
    text += `╎» setlefttitle\n`
    text += `╎» setleftbody\n`
    text += `╎» testleft\n`
    text += `╎» delleft\n`
    text += `╎» antiwame on/off\n`
    text += `╎» antiwame2 on/off\n`
    text += `╎» antilink on/off\n`
    text += `╎» antilink2 on/off\n`
    text += `╎» hidetag\n`
    text += `╎» add\n`
    text += `╎» kick\n`
    text += `╎» setppgc\n`
    text += `╎» setnamegc\n`
    text += `╎» setdesgc\n`
    text += `╎» linkgc\n`
    text += `╎» ceksewa\n`
    text += `╎» resetlinkgc\n`
    text += `╎» promote\n`
    text += `╎» demote\n`
    text += `╎» stiker\n`
    text += `╎» smeme\n`
    text += `╎» toimg\n`
    text += `╎» tourl (support img & vid)\n`
    text += `╎» qc\n`
    text += `╎» rvo\n`
    text += `╎» brat\n`
    text += `╎» bratvid\n`
    text += `╎» readqr\n`
    text += `│\n`

    // WORDING LIST
    text += `├─═[ WORDING LIST ]═───···\n`
    text += `╎\n`
    text += `╎» tutorsetlist\n`
    text += `╎» setlist\n`
    text += `╎» setlist2\n`
    text += `╎» setlist3\n`
    text += `╎» resetwdlist\n`
    text += `╎» formatkey\n`
    text += `╎» formatkey1\n`
    text += `╎» formatkey2\n`
    text += `╎» formatkey3\n`
    text += `╎» formatkey4\n`
    text += `╎» formatkey5\n`
    text += `╎» formatkey6\n`
    text += `╎» formatkey7\n`
    text += `╎» formatkey8\n`
    text += `╎\n`

    // MENU BOT
    text += `├─═[ MENU BOT ]═───···\n`
    text += `│\n`
    text += `╎» bot\n`
    text += `╎» menu\n`
    text += `╎» setbot\n`
    text += `╎» updatesetbot\n`
    text += `╎» delsetbot\n`
    text += `╎» sewabot\n`
    text += `╎» addadmin\n`
    text += `╎» deladmin\n`
    text += `╎» listadmin\n`
    text += `│\n`
    text += `╰─────···\n\n`
    text += `ℹ️ Ketik langsung nama perintah untuk menggunakannya.\n`
    text += `Contoh: *addlist Akun Netflix | 50000*`

    await sock.sendMessage(m.from, {
      text,
      mentions: [m.sender],
    }, { quoted: m.msg })
  }
}
