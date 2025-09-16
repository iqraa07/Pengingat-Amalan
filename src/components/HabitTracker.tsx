import React, { useState, useEffect } from 'react';
import { Check, Circle, BookOpen, Heart, Hand as Hands, Gift, AlertTriangle, Clock, Sunrise } from 'lucide-react';
import { Habit, PrayerTime } from '../types';

interface HabitTrackerProps {
  habits: Habit;
  onHabitUpdate: (habitKey: keyof Habit, completed: boolean) => void;
  prayerTimes?: PrayerTime[];
}

const HabitTracker: React.FC<HabitTrackerProps> = ({ habits, onHabitUpdate, prayerTimes = [] }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [validationMessage, setValidationMessage] = useState<string>('');

  // Update waktu setiap menit
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Fungsi untuk mengecek apakah waktu sholat sudah masuk
  const isPrayerTimeValid = (prayerKey: string): boolean => {
    const prayer = prayerTimes.find(p => p.key === prayerKey);
    if (!prayer) return true; // Jika tidak ada data waktu sholat, izinkan

    const [hours, minutes] = prayer.time.split(':').map(Number);
    const prayerDate = new Date();
    prayerDate.setHours(hours, minutes, 0, 0);
    
    return currentTime >= prayerDate;
  };

  // Mendapatkan waktu tersisa sampai sholat
  const getTimeUntilPrayer = (prayerKey: string): string => {
    const prayer = prayerTimes.find(p => p.key === prayerKey);
    if (!prayer) return '';

    const [hours, minutes] = prayer.time.split(':').map(Number);
    const prayerDate = new Date();
    prayerDate.setHours(hours, minutes, 0, 0);
    
    const diff = prayerDate.getTime() - currentTime.getTime();
    if (diff <= 0) return '';
    
    const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
    const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hoursLeft > 0) {
      return `${hoursLeft} jam ${minutesLeft} menit lagi`;
    } else {
      return `${minutesLeft} menit lagi`;
    }
  };

  const handleHabitClick = (habitKey: keyof Habit, completed: boolean) => {
    // Cek jika ini adalah sholat dan perlu validasi waktu
    const prayerHabits = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha', 'dhuha'];
    const nightPrayers = ['tahajud', 'witir']; // Sholat malam
    
    if ((prayerHabits.includes(habitKey) || nightPrayers.includes(habitKey)) && !completed) {
      // User ingin menandai sholat sebagai selesai
      if (prayerHabits.includes(habitKey) && !isPrayerTimeValid(habitKey)) {
        const timeLeft = getTimeUntilPrayer(habitKey);
        setValidationMessage(`Waktu sholat ${habitKey} belum masuk. ${timeLeft}`);
        setTimeout(() => {
          setValidationMessage('');
        }, 3000);
        return;
      }
      
      // Validasi khusus untuk tahajud dan witir (hanya bisa setelah jam 21:00)
      if (nightPrayers.includes(habitKey)) {
        const currentHour = currentTime.getHours();
        if (currentHour < 21 && currentHour > 4) { // Tidak boleh antara jam 5 pagi sampai 9 malam
          setValidationMessage(`Sholat ${habitKey} hanya bisa dilakukan mulai jam 21:00 - 04:00`);
          setTimeout(() => {
            setValidationMessage('');
          }, 3000);
          return;
        }
      }
      
      // Validasi khusus untuk sholat taubat (bisa kapan saja kecuali waktu terlarang)
      if (habitKey === 'taubat') {
        const currentHour = currentTime.getHours();
        const currentMinute = currentTime.getMinutes();
        
        // Waktu terlarang: saat matahari terbit (06:00-06:30), dzuhur (11:45-12:15), maghrib (17:45-18:15)
        const forbiddenTimes = [
          { start: { h: 6, m: 0 }, end: { h: 6, m: 30 } },
          { start: { h: 11, m: 45 }, end: { h: 12, m: 15 } },
          { start: { h: 17, m: 45 }, end: { h: 18, m: 15 } }
        ];
        
        const isForbidden = forbiddenTimes.some(time => {
          const currentTotalMinutes = currentHour * 60 + currentMinute;
          const startMinutes = time.start.h * 60 + time.start.m;
          const endMinutes = time.end.h * 60 + time.end.m;
          return currentTotalMinutes >= startMinutes && currentTotalMinutes <= endMinutes;
        });
        
        if (isForbidden) {
          setValidationMessage('Sholat taubat tidak boleh dilakukan di waktu yang terlarang (saat matahari terbit, dzuhur, dan maghrib)');
          setTimeout(() => {
            setValidationMessage('');
          }, 3000);
          return;
        }
      }
      
      // Validasi untuk sholat rawatib
      if (habitKey === 'rawatib') {
        // Rawatib bisa dilakukan setelah sholat fardhu dilakukan
        const fardhPrayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
        const anyFardhCompleted = fardhPrayers.some(prayer => habits[prayer as keyof Habit]);
        
        if (!anyFardhCompleted) {
          setValidationMessage('Sholat rawatib sebaiknya dilakukan setelah ada sholat fardhu yang dikerjakan');
          setTimeout(() => {
            setValidationMessage('');
          }, 3000);
          return;
        }
      }
    }

    setValidationMessage('');
    onHabitUpdate(habitKey, !completed);
  };

  // Fungsi untuk cek validasi khusus setiap habit
  const getHabitValidation = (habitKey: keyof Habit): { canComplete: boolean; reason?: string } => {
    const prayerHabits = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha', 'dhuha'];
    const nightPrayers = ['tahajud', 'witir'];
    
    if (prayerHabits.includes(habitKey)) {
      const canComplete = isPrayerTimeValid(habitKey);
      return { 
        canComplete, 
        reason: !canComplete ? getTimeUntilPrayer(habitKey) : undefined 
      };
    }
    
    if (nightPrayers.includes(habitKey)) {
      const currentHour = currentTime.getHours();
      const canComplete = currentHour >= 21 || currentHour <= 4;
      return { 
        canComplete, 
        reason: !canComplete ? 'Hanya 21:00-04:00' : undefined 
      };
    }
    
    if (habitKey === 'taubat') {
      const currentHour = currentTime.getHours();
      const currentMinute = currentTime.getMinutes();
      
      const forbiddenTimes = [
        { start: { h: 6, m: 0 }, end: { h: 6, m: 30 } },
        { start: { h: 11, m: 45 }, end: { h: 12, m: 15 } },
        { start: { h: 17, m: 45 }, end: { h: 18, m: 15 } }
      ];
      
      const isForbidden = forbiddenTimes.some(time => {
        const currentTotalMinutes = currentHour * 60 + currentMinute;
        const startMinutes = time.start.h * 60 + time.start.m;
        const endMinutes = time.end.h * 60 + time.end.m;
        return currentTotalMinutes >= startMinutes && currentTotalMinutes <= endMinutes;
      });
      
      return { 
        canComplete: !isForbidden, 
        reason: isForbidden ? 'Waktu terlarang' : undefined 
      };
    }
    
    // Habit lain bisa dilakukan kapan saja
    return { canComplete: true };
  };

  const habitConfig = [
    // Sholat Fardhu
    { 
      key: 'fajr' as keyof Habit, 
      label: 'Shalat Subuh', 
      icon: Circle, 
      color: 'text-blue-600', 
      arabic: 'فجر', 
      category: 'fardhu',
      intention: {
        arabic: 'أُصَلِّي فَرْضَ الْفَجْرِ رَكْعَتَيْنِ مُسْتَقْبِلَ الْقِبْلَةِ لِلَّهِ تَعَالَى',
        latin: 'Ushalli fardhal fajri rak\'ataini mustaqbilal qiblati lillaahi ta\'aala',
        meaning: 'Saya niat sholat fardhu subuh dua rakaat menghadap kiblat karena Allah Ta\'ala'
      }
    },
    { 
      key: 'dhuhr' as keyof Habit, 
      label: 'Shalat Dzuhur', 
      icon: Circle, 
      color: 'text-yellow-600', 
      arabic: 'ظهر', 
      category: 'fardhu',
      intention: {
        arabic: 'أُصَلِّي فَرْضَ الظُّهْرِ أَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ لِلَّهِ تَعَالَى',
        latin: 'Ushalli fardhaz zhuhri arba\' raka\'aatin mustaqbilal qiblati lillaahi ta\'aala',
        meaning: 'Saya niat sholat fardhu dzuhur empat rakaat menghadap kiblat karena Allah Ta\'ala'
      }
    },
    { 
      key: 'asr' as keyof Habit, 
      label: 'Shalat Ashar', 
      icon: Circle, 
      color: 'text-orange-600', 
      arabic: 'عصر', 
      category: 'fardhu',
      intention: {
        arabic: 'أُصَلِّي فَرْضَ الْعَصْرِ أَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ لِلَّهِ تَعَالَى',
        latin: 'Ushalli fardhal \'ashri arba\' raka\'aatin mustaqbilal qiblati lillaahi ta\'aala',
        meaning: 'Saya niat sholat fardhu ashar empat rakaat menghadap kiblat karena Allah Ta\'ala'
      }
    },
    { 
      key: 'maghrib' as keyof Habit, 
      label: 'Shalat Maghrib', 
      icon: Circle, 
      color: 'text-red-600', 
      arabic: 'مغرب', 
      category: 'fardhu',
      intention: {
        arabic: 'أُصَلِّي فَرْضَ الْمَغْرِبِ ثَلَاثَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ لِلَّهِ تَعَالَى',
        latin: 'Ushalli fardhal maghribi tsalaatsa raka\'aatin mustaqbilal qiblati lillaahi ta\'aala',
        meaning: 'Saya niat sholat fardhu maghrib tiga rakaat menghadap kiblat karena Allah Ta\'ala'
      }
    },
    { 
      key: 'isha' as keyof Habit, 
      label: 'Shalat Isya', 
      icon: Circle, 
      color: 'text-purple-600', 
      arabic: 'عشاء', 
      category: 'fardhu',
      intention: {
        arabic: 'أُصَلِّي فَرْضَ الْعِشَاءِ أَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ لِلَّهِ تَعَالَى',
        latin: 'Ushalli fardhal \'isyaa\'i arba\' raka\'aatin mustaqbilal qiblati lillaahi ta\'aala',
        meaning: 'Saya niat sholat fardhu isya empat rakaat menghadap kiblat karena Allah Ta\'ala'
      }
    },
    
    // Sholat Sunnah
    { 
      key: 'dhuha' as keyof Habit, 
      label: 'Shalat Dhuha', 
      icon: Sunrise, 
      color: 'text-amber-500', 
      arabic: 'ضحى', 
      category: 'sunnah',
      intention: {
        arabic: 'أُصَلِّي سُنَّةَ الضُّحَى رَكْعَتَيْنِ مُسْتَقْبِلَ الْقِبْلَةِ لِلَّهِ تَعَالَى',
        latin: 'Ushalli sunnatad dhuhaa rak\'ataini mustaqbilal qiblati lillaahi ta\'aala',
        meaning: 'Saya niat sholat sunnah dhuha dua rakaat menghadap kiblat karena Allah Ta\'ala'
      }
    },
    { 
      key: 'tahajud' as keyof Habit, 
      label: 'Shalat Tahajud', 
      icon: Circle, 
      color: 'text-indigo-700', 
      arabic: 'تهجد', 
      category: 'sunnah',
      intention: {
        arabic: 'أُصَلِّي سُنَّةَ التَّهَجُّدِ رَكْعَتَيْنِ مُسْتَقْبِلَ الْقِبْلَةِ لِلَّهِ تَعَالَى',
        latin: 'Ushalli sunnatut tahajjudi rak\'ataini mustaqbilal qiblati lillaahi ta\'aala',
        meaning: 'Saya niat sholat sunnah tahajud dua rakaat menghadap kiblat karena Allah Ta\'ala'
      }
    },
    { 
      key: 'witir' as keyof Habit, 
      label: 'Shalat Witir', 
      icon: Circle, 
      color: 'text-purple-700', 
      arabic: 'وتر', 
      category: 'sunnah',
      intention: {
        arabic: 'أُصَلِّي سُنَّةَ الْوِتْرِ ثَلَاثَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ لِلَّهِ تَعَالَى',
        latin: 'Ushalli sunnatil witri tsalaatsa raka\'aatin mustaqbilal qiblati lillaahi ta\'aala',
        meaning: 'Saya niat sholat sunnah witir tiga rakaat menghadap kiblat karena Allah Ta\'ala'
      }
    },
    { 
      key: 'taubat' as keyof Habit, 
      label: 'Shalat Taubat', 
      icon: Hands, 
      color: 'text-red-500', 
      arabic: 'توبة', 
      category: 'sunnah',
      intention: {
        arabic: 'أُصَلِّي سُنَّةَ التَّوْبَةِ رَكْعَتَيْنِ مُسْتَقْبِلَ الْقِبْلَةِ لِلَّهِ تَعَالَى',
        latin: 'Ushalli sunnatatut taubati rak\'ataini mustaqbilal qiblati lillaahi ta\'aala',
        meaning: 'Saya niat sholat sunnah taubat dua rakaat menghadap kiblat karena Allah Ta\'ala'
      }
    },
    { 
      key: 'rawatib' as keyof Habit, 
      label: 'Shalat Rawatib', 
      icon: Circle, 
      color: 'text-green-600', 
      arabic: 'رواتب', 
      category: 'sunnah',
      intention: {
        arabic: 'أُصَلِّي سُنَّةَ الرَّوَاتِبِ رَكْعَتَيْنِ مُسْتَقْبِلَ الْقِبْلَةِ لِلَّهِ تَعَالَى',
        latin: 'Ushalli sunnatar rawatibi rak\'ataini mustaqbilal qiblati lillaahi ta\'aala',
        meaning: 'Saya niat sholat sunnah rawatib dua rakaat menghadap kiblat karena Allah Ta\'ala'
      }
    },
    
    // Amalan Lain
    { key: 'quranReading' as keyof Habit, label: 'Membaca Al-Quran', icon: BookOpen, color: 'text-emerald-600', arabic: 'قرآن', category: 'amalan' },
    { key: 'dhikr' as keyof Habit, label: 'Dzikir/Mengingat Allah', icon: Heart, color: 'text-pink-600', arabic: 'ذكر', category: 'amalan' },
    { key: 'istighfar' as keyof Habit, label: 'Istighfar', icon: Hands, color: 'text-teal-600', arabic: 'استغفار', category: 'amalan' },
    { key: 'duaRecitation' as keyof Habit, label: 'Doa Harian', icon: Hands, color: 'text-indigo-600', arabic: 'دعاء', category: 'amalan' },
    { key: 'charitableDeed' as keyof Habit, label: 'Amal Kebaikan', icon: Gift, color: 'text-amber-600', arabic: 'صدقة', category: 'amalan' },
  ];

  // Group habits by category
  const fardhHabits = habitConfig.filter(h => h.category === 'fardhu');
  const sunnahHabits = habitConfig.filter(h => h.category === 'sunnah');
  const amalanHabits = habitConfig.filter(h => h.category === 'amalan');

  const [showIntention, setShowIntention] = useState<string | null>(null);

  const renderHabitGroup = (habitsGroup: typeof habitConfig, title: string, bgColor: string) => (
    <div className="mb-6">
      <h3 className={`text-lg font-bold mb-4 ${bgColor} p-3 rounded-lg text-center`}>
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {habitsGroup.map((habit) => {
          const Icon = habit.icon;
          const isCompleted = habits[habit.key];
          const validation = getHabitValidation(habit.key);
          const canComplete = validation.canComplete;
          
          return (
            <div key={habit.key} className="space-y-2">
              <div
                className={`
                  p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer relative
                  ${isCompleted 
                    ? 'bg-emerald-50 border-emerald-300 shadow-md' 
                    : canComplete
                      ? 'bg-gray-50 border-gray-200 hover:border-emerald-200'
                      : 'bg-orange-50 border-orange-200 opacity-75'
                  }
                `}
                onClick={() => handleHabitClick(habit.key, isCompleted)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center
                      ${isCompleted 
                        ? 'bg-emerald-500' 
                        : canComplete 
                          ? 'bg-gray-300'
                          : 'bg-orange-300'
                      }
                    `}>
                      {isCompleted ? (
                        <Check className="w-5 h-5 text-white" />
                      ) : (
                        <Icon className={`w-4 h-4 ${canComplete ? habit.color : 'text-orange-600'}`} />
                      )}
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-800">{habit.label}</h4>
                      <p className="text-sm text-gray-500 arabic-font">{habit.arabic}</p>
                      {!canComplete && validation.reason && (
                        <p className="text-xs text-orange-600 mt-1">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {validation.reason}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    {isCompleted && (
                      <div className="text-emerald-500 font-semibold text-sm">
                        Selesai ✓
                      </div>
                    )}
                    {!canComplete && !isCompleted && (
                      <div className="text-orange-500 font-semibold text-xs">
                        Belum waktunya
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Tombol Niat untuk sholat */}
              {habit.intention && (
                <button
                  onClick={() => setShowIntention(showIntention === habit.key ? null : habit.key)}
                  className="w-full text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-3 rounded-lg transition-colors"
                >
                  {showIntention === habit.key ? 'Sembunyikan Niat' : 'Lihat Niat Sholat'}
                </button>
              )}
              
              {/* Modal Niat */}
              {showIntention === habit.key && habit.intention && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                  <h5 className="font-semibold text-blue-800">Niat {habit.label}:</h5>
                  <div className="text-right bg-white p-3 rounded border">
                    <p className="arabic-font text-lg text-blue-800 mb-2">{habit.intention.arabic}</p>
                    <p className="text-sm text-blue-600 italic">{habit.intention.latin}</p>
                  </div>
                  <p className="text-sm text-blue-700">
                    <strong>Artinya:</strong> {habit.intention.meaning}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Amalan Harian untuk Menjauhi Maksiat
      </h2>
      
      {validationMessage && (
        <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-lg flex items-center animate-pulse">
          <AlertTriangle className="w-5 h-5 text-orange-500 mr-2 flex-shrink-0" />
          <div>
            <p className="text-orange-700 font-medium">Perhatian</p>
            <p className="text-orange-600 text-sm">{validationMessage}</p>
          </div>
        </div>
      )}

      <div className="mb-4 p-3 bg-blue-50 rounded-lg text-center">
        <p className="text-sm text-blue-700">
          <Clock className="w-4 h-4 inline mr-1" />
          Waktu sekarang: {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
      
      {renderHabitGroup(fardhHabits, '🕌 Sholat Fardhu (Wajib)', 'bg-blue-100 text-blue-800')}
      {renderHabitGroup(sunnahHabits, '🌙 Sholat Sunnah (Anjuran)', 'bg-purple-100 text-purple-800')}
      {renderHabitGroup(amalanHabits, '📿 Amalan Harian Lainnya', 'bg-emerald-100 text-emerald-800')}

      <div className="mt-6 p-4 bg-emerald-50 rounded-lg">
        <div className="space-y-2">
          <p className="text-sm text-emerald-700 text-center">
            <strong>Hadits:</strong> "Mata itu berzina dan zinanya mata adalah melihat." (HR. Bukhari)
          </p>
          <p className="text-xs text-emerald-600 text-center">
            Jagalah mata, hati, dan anggota badan dari maksiat. Perbanyak shalat, dzikir, dan taubat.
          </p>
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
        <p className="text-sm text-red-700 text-center arabic-font" dir="rtl">
          وَلَا تَقْرَبُوا الزِّنَا ۖ إِنَّهُ كَانَ فَاحِشَةً وَسَاءَ سَبِيلًا
        </p>
        <p className="text-xs text-red-600 text-center mt-2">
          "Dan janganlah kamu mendekati zina; sesungguhnya zina itu adalah suatu perbuatan yang keji dan suatu jalan yang buruk." (QS. Al-Isra: 32)
        </p>
      </div>
    </div>
  );
};

export default HabitTracker;