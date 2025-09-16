import { DailyProgress } from '../types';

// Bot Telegram Arcyyybot
const TELEGRAM_BOT_TOKEN = '6968952940:AAHSjZqU2tuQ0UPLMB_WCtQ_quFxxRVNPJU'; // Token bot Arcyyybot
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

// Fungsi untuk test bot token
export const testBotToken = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${TELEGRAM_API_URL}/getMe`);
    const data = await response.json();
    return data.ok;
  } catch (error) {
    console.error('Error testing bot token:', error);
    return false;
  }
};

// Fungsi untuk mengecek koneksi ke bot dengan mengirim pesan test
export const checkBotConnection = async (chatId: string): Promise<boolean> => {
  try {
    const response = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: '🔍 Test koneksi... (pesan ini akan dihapus otomatis)',
      }),
    });

    const data = await response.json();
    
    if (data.ok) {
      // Hapus pesan test setelah berhasil
      try {
        await fetch(`${TELEGRAM_API_URL}/deleteMessage`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: chatId,
            message_id: data.result.message_id,
          }),
        });
      } catch (deleteError) {
        console.log('Could not delete test message:', deleteError);
      }
      return true;
    }
    
    console.error('Bot connection failed:', data);
    return false;
  } catch (error) {
    console.error('Error checking bot connection:', error);
    return false;
  }
};

export const sendTelegramMessage = async (message: string, chatId?: string): Promise<void> => {
  const userChatId = chatId || localStorage.getItem('telegram_chat_id');
  
  if (!userChatId) {
    throw new Error('Chat ID tidak ditemukan. Silakan hubungkan Telegram terlebih dahulu.');
  }

  try {
    const response = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: userChatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (!data.ok) {
      throw new Error(`Telegram API error: ${data.description}`);
    }
  } catch (error) {
    console.error('Error sending Telegram message:', error);
    throw error;
  }
};

export const sendDailyReport = async (
  dailyProgress: DailyProgress, 
  completionPercentage: number,
  chatId?: string
): Promise<void> => {
  const completedHabits = Object.entries(dailyProgress.habits)
    .filter(([_, completed]) => completed)
    .map(([habit, _]) => habit);

  const pendingHabits = Object.entries(dailyProgress.habits)
    .filter(([_, completed]) => !completed)
    .map(([habit, _]) => habit);

  const habitNames: { [key: string]: string } = {
    fajr: 'Shalat Subuh',
    dhuhr: 'Shalat Dzuhur',
    asr: 'Shalat Ashar',
    maghrib: 'Shalat Maghrib',
    isha: 'Shalat Isya',
    tahajud: 'Shalat Tahajud',
    dhuha: 'Shalat Dhuha',
    taubat: 'Shalat Taubat',
    witir: 'Shalat Witir',
    rawatib: 'Shalat Rawatib',
    quranReading: 'Membaca Al-Quran',
    dhikr: 'Dzikir/Mengingat Allah',
    istighfar: 'Istighfar',
    duaRecitation: 'Doa Harian',
    charitableDeed: 'Amal Kebaikan'
  };

  const getEmoji = (percentage: number) => {
    if (percentage === 100) return '🌟';
    if (percentage >= 80) return '💪';
    if (percentage >= 60) return '👍';
    if (percentage >= 40) return '🌱';
    return '🤲';
  };

  const message = `
<b>${getEmoji(completionPercentage)} Laporan Harian Menjauhi Maksiat</b>

📅 <b>Tanggal:</b> ${new Date(dailyProgress.date).toLocaleDateString('id-ID')}
📊 <b>Penyelesaian:</b> ${completionPercentage}% (${completedHabits.length}/${Object.keys(dailyProgress.habits).length})
🔥 <b>Berturut-turut:</b> ${dailyProgress.streak || 0} hari

✅ <b>Aktivitas Selesai:</b>
${completedHabits.length > 0 
  ? completedHabits.map(habit => `• ${habitNames[habit] || habit}`).join('\n')
  : '• Belum ada yang selesai'
}

⏳ <b>Aktivitas Tertunda:</b>
${pendingHabits.length > 0 
  ? pendingHabits.map(habit => `• ${habitNames[habit] || habit}`).join('\n')
  : '• Semua selesai! Masha\'Allah! 🎉'
}

${dailyProgress.reflection && dailyProgress.reflection.length > 0 ? `
💭 <b>Muhasabah Hari Ini:</b>
${dailyProgress.reflection.substring(0, 200)}${dailyProgress.reflection.length > 200 ? '...' : ''}
` : ''}

<i>Terus pertahankan perjalanan spiritual yang mulia! 🤲</i>

<b>🚫 Pengingat Penting:</b> "Dan janganlah kamu mendekati zina; sesungguhnya zina itu adalah suatu perbuatan yang keji dan suatu jalan yang buruk." (QS. Al-Isra: 32)

<i>Jagalah mata, hati, dan anggota badan dari maksiat. Semoga Allah melindungi kita semua.</i>
  `;

  await sendTelegramMessage(message.trim(), chatId);
};

export const sendMotivationalMessage = async (chatId?: string): Promise<void> => {
  const motivationalMessages = [
    "🌟 <b>Ingatlah:</b> 'Dan siapa yang bertakwa kepada Allah niscaya Dia akan mengadakan baginya jalan keluar.' (QS. At-Talaq: 2)\n\n💪 Tetap semangat menjauhi maksiat dan mendekat kepada Allah!",
    
    "🤲 <b>Hadits Mulia:</b> 'Setiap anak Adam pasti berdosa, dan sebaik-baik orang yang berdosa adalah yang bertaubat.' (HR. At-Tirmidzi)\n\n✨ Jangan menyerah! Pintu taubat selalu terbuka.",
    
    "👁️ <b>Jaga Mata:</b> 'Pandangan pertama adalah untukmu, pandangan kedua adalah atasmu (dosa).' (HR. Abu Dawud)\n\n🛡️ Lindungi mata dari yang haram, jagalah pandangan!",
    
    "❤️ <b>Jaga Hati:</b> 'Sesungguhnya dalam tubuh ada segumpal daging, jika dia baik maka baiklah seluruh tubuh.' (HR. Bukhari)\n\n💖 Bersihkan hati dari maksiat dan pengaruh buruk!",
    
    "⚠️ <b>Peringatan:</b> 'Mata itu berzina dan zinanya mata adalah melihat.' (HR. Bukhari)\n\n🚫 Jauhi tontonan haram dan jaga kesucian diri!",
    
    "🌅 <b>Motivasi Pagi:</b> 'Dan bertaubatlah kamu sekalian kepada Allah, hai orang-orang yang beriman supaya kamu beruntung.' (QS. An-Nur: 31)\n\n☀️ Mulai hari dengan taubat dan dzikir!",
    
    "🌙 <b>Renungan Malam:</b> 'Dan pada waktu malam bertasbih kepada-Nya dan sesudah bersujud.' (QS. At-Tur: 49)\n\n🕌 Manfaatkan malam untuk tahajud dan muhasabah.",
    
    "👥 <b>Jauhi Khalwat:</b> 'Tidaklah seorang laki-laki berduaan dengan seorang wanita, melainkan yang ketiganya adalah syaitan.' (HR. Ahmad)\n\n🚪 Hindari situasi yang mengundang maksiat!",
    
    "🌍 <b>Dunia Sementara:</b> 'Dunia itu hijau nan manis... maka berhati-hatilah kalian terhadap dunia dan berhati-hatilah kalian terhadap wanita.' (HR. Muslim)\n\n⚖️ Ingat akhirat lebih kekal!",
    
    "🎯 <b>Jaga Kehormatan:</b> 'Barangsiapa menjamin untukku apa yang ada di antara kedua rahangnya dan apa yang ada di antara kedua pahanya, aku jamin baginya surga.' (HR. Bukhari)\n\n🏆 Jaga lisan dan kemaluan!",
    
    "🔄 <b>Hijrah Diri:</b> 'Sesungguhnya Allah tidak mengubah keadaan suatu kaum sehingga mereka mengubah keadaan yang ada pada diri mereka sendiri.' (QS. Ar-Ra'd: 11)\n\n💪 Berubah menjadi lebih baik!",
    
    "🚪 <b>Taubat Nasuha:</b> 'Hai orang-orang yang beriman, bertaubatlah kepada Allah dengan taubatan nashuha.' (QS. At-Tahrim: 8)\n\n🔄 Taubat yang sungguh-sungguh!",
    
    "⏰ <b>Waktu Terbatas:</b> Ingatlah kematian dan akhirat. Jangan tertipu oleh kesenangan dunia yang sementara.\n\n💀 Bersiap untuk menghadap Allah!",
    
    "🤝 <b>Pergaulan Baik:</b> Bergaulah dengan orang-orang saleh yang mengingatkan kamu kepada Allah dan akhirat.\n\n👥 Pilih sahabat yang membawa ke surga!",
    
    "📿 <b>Perbanyak Dzikir:</b> 'Dan orang-orang yang beriman, hati mereka manjadi tenteram dengan mengingat Allah.' (QS. Ar-Ra'd: 28)\n\n🕊️ Tenangkan hati dengan dzikir!"
  ];
  
  const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
  await sendTelegramMessage(`🌟 <b>MOTIVASI SPIRITUAL</b> 🌟\n\n${randomMessage}`, chatId);
};

// Fungsi untuk mendapatkan Chat ID dari update terbaru
export const getLatestChatId = async (): Promise<string | null> => {
  try {
    const response = await fetch(`${TELEGRAM_API_URL}/getUpdates`);
    const data = await response.json();
    
    if (data.ok && data.result.length > 0) {
      const lastUpdate = data.result[data.result.length - 1];
      return lastUpdate.message?.chat?.id?.toString() || lastUpdate.callback_query?.message?.chat?.id?.toString() || null;
    }
    return null;
  } catch (error) {
    console.error('Error getting chat ID:', error);
    return null;
  }
};

export const sendAccountabilityReminder = async (chatId?: string): Promise<void> => {
  const reminders = [
    "🕌 Assalamu'alaikum! Sudahkah melaksanakan shalat fardhu hari ini? Jangan sampai terlewat!",
    "📖 Jangan lupa membaca Al-Quran harian! Meski hanya beberapa ayat, pahalanya berlipat.",
    "🤲 Luangkan waktu untuk dzikir dan mengingat Allah. Hati akan tenang dengan dzikr-Nya.",
    "💚 Sudahkah berbuat kebaikan hari ini? Senyuman pun termasuk sedekah.",
    "🌙 Renungkan hari ini dan mohon ampunan Allah. Taubat sebelum terlambat.",
    "☀️ Mulai hari dengan syukur, shalat, dan niat baik. Semoga hari penuh berkah!",
    "🚫 PERINGATAN: 'Dan janganlah kamu mendekati zina; sesungguhnya zina itu perbuatan keji.' (QS. Al-Isra: 32)",
    "👁️ JAGA MATA: 'Hendaklah mereka menahan pandangannya untuk kesucian mereka.' (QS. An-Nur: 30)",
    "❤️ JAGA HATI: Bersihkan hati dari hasrat buruk dan pikiran kotor.",
    "🛡️ PENJAGAAN DIRI: Jagalah mata, hati, dan anggota badan dari hal-hal haram.",
    "🤲 TAUBAT: Kembali kepada Allah dengan taubat yang sungguh-sungguh.",
    "⚠️ WASPADA: Jauhkan diri dari hal-hal syubhat yang meragukan.",
    "👥 JAUHI KHALWAT: Hindari berduaan dengan lawan jenis yang bukan mahram.",
    "🌍 INGAT AKHIRAT: Dunia hanya sementara, akhirat yang kekal selamanya.",
    "💎 JAGA KEHORMATAN: Lindungi lisan dan kemaluan dari hal-hal haram.",
    "🔄 HIJRAH DIRI: Berubah menjadi lebih baik, tinggalkan kebiasaan buruk.",
    "🚪 TAUBAT NASUHA: Bertaubatlah dengan taubat yang tidak akan kembali ke dosa.",
    "🎯 FOKUS AKHIRAT: Kematian bisa datang kapan saja, bersiaplah!",
    "🤝 PERGAULAN BAIK: Pilih teman yang mendekatkan kepada Allah SWT."
  ];

  const randomReminder = reminders[Math.floor(Math.random() * reminders.length)];
  await sendTelegramMessage(`🔔 <b>PENGINGAT SPIRITUAL</b>\n\n${randomReminder}`, chatId);
};