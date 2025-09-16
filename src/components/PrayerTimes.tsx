import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Sunrise, Sunset, CheckCircle, AlertCircle, Settings } from 'lucide-react';
import { PrayerTime } from '../types';

interface PrayerTimesProps {
  onPrayerTimesUpdate?: (times: PrayerTime[]) => void;
  userLocation?: {lat: number, lng: number} | null;
}

const PrayerTimes: React.FC<PrayerTimesProps> = ({ onPrayerTimesUpdate, userLocation }) => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [location, setLocation] = useState('Mendapatkan lokasi...');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [timezone, setTimezone] = useState<'WIB' | 'WITA' | 'WIT'>('WITA');
  const [showSettings, setShowSettings] = useState(false);

  // Update waktu setiap menit
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Auto-detect timezone berdasarkan lokasi
  const detectTimezone = (longitude: number): 'WIB' | 'WITA' | 'WIT' => {
    if (longitude < 105) return 'WIB'; // Sumatra, Jawa
    if (longitude < 135) return 'WITA'; // Kalimantan, Sulawesi, Bali
    return 'WIT'; // Papua, Maluku
  };

  // Convert time to selected timezone
  const convertToTimezone = (utcTime: string, targetTimezone: 'WIB' | 'WITA' | 'WIT'): string => {
    const [hours, minutes] = utcTime.split(':').map(Number);
    const utcDate = new Date();
    utcDate.setUTCHours(hours, minutes, 0, 0);
    
    let offsetHours = 7; // WIB
    if (targetTimezone === 'WITA') offsetHours = 8;
    if (targetTimezone === 'WIT') offsetHours = 9;
    
    const localDate = new Date(utcDate.getTime() + (offsetHours * 60 * 60 * 1000));
    return localDate.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  // Fungsi untuk mendapatkan waktu sholat dari API Aladhan
  const fetchPrayerTimes = async (latitude: number, longitude: number) => {
    try {
      const today = new Date();
      const response = await fetch(
        `https://api.aladhan.com/v1/timings/${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}?latitude=${latitude}&longitude=${longitude}&method=20&tune=0,0,0,0,0,0,0,0,0`
      );
      
      if (!response.ok) {
        throw new Error('Gagal mendapatkan waktu sholat');
      }

      const data = await response.json();
      const timings = data.data.timings;
      
      // Auto-detect timezone
      const detectedTz = detectTimezone(longitude);
      setTimezone(detectedTz);

      const times: PrayerTime[] = [
        { name: 'Subuh', time: timings.Fajr, key: 'fajr' },
        { name: 'Terbit', time: timings.Sunrise, key: 'sunrise' },
        { name: 'Dhuha', time: timings.Sunrise, key: 'dhuha' }, // 15 menit setelah terbit
        { name: 'Dzuhur', time: timings.Dhuhr, key: 'dhuhr' },
        { name: 'Ashar', time: timings.Asr, key: 'asr' },
        { name: 'Maghrib', time: timings.Maghrib, key: 'maghrib' },
        { name: 'Isya', time: timings.Isha, key: 'isha' }
      ];

      // Convert Dhuha time (15 minutes after sunrise)
      const sunriseTime = new Date();
      const [sunriseHour, sunriseMinute] = timings.Sunrise.split(':').map(Number);
      sunriseTime.setHours(sunriseHour, sunriseMinute + 15, 0, 0);
      const dhuhaTime = sunriseTime.toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
      times[2].time = dhuhaTime;

      setPrayerTimes(times);
      if (onPrayerTimesUpdate) {
        onPrayerTimesUpdate(times);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching prayer times:', error);
      setDefaultPrayerTimes();
    }
  };

  const setDefaultPrayerTimes = () => {
    const times: PrayerTime[] = [
      { name: 'Subuh', time: '05:00', key: 'fajr' },
      { name: 'Terbit', time: '06:15', key: 'sunrise' },
      { name: 'Dhuha', time: '06:30', key: 'dhuha' },
      { name: 'Dzuhur', time: '12:00', key: 'dhuhr' },
      { name: 'Ashar', time: '15:30', key: 'asr' },
      { name: 'Maghrib', time: '18:00', key: 'maghrib' },
      { name: 'Isya', time: '19:15', key: 'isha' }
    ];
    
    setPrayerTimes(times);
    if (onPrayerTimesUpdate) {
      onPrayerTimesUpdate(times);
    }
    setLoading(false);
  };

  // Use provided location from QiblaDirection if available
  useEffect(() => {
    if (userLocation) {
      const detectedTz = detectTimezone(userLocation.lng);
      const cityName = userLocation.lng < 105 ? 'Indonesia (WIB)' : 
                      userLocation.lng < 135 ? 'Indonesia (WITA)' : 'Indonesia (WIT)';
      
      setLocation(`${cityName} - ${userLocation.lat.toFixed(2)}, ${userLocation.lng.toFixed(2)}`);
      setTimezone(detectedTz);
      fetchPrayerTimes(userLocation.lat, userLocation.lng);
    }
  }, [userLocation]);

  useEffect(() => {
    // Skip auto-location if userLocation is already provided
    if (userLocation) return;
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const detectedTz = detectTimezone(longitude);
          const cityName = longitude < 105 ? 'Indonesia (WIB)' : 
                          longitude < 135 ? 'Indonesia (WITA)' : 'Indonesia (WIT)';
          
          setLocation(`${cityName} - ${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
          setTimezone(detectedTz);
          fetchPrayerTimes(latitude, longitude);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setLocation('Indonesia (Default)');
          setDefaultPrayerTimes();
        }
      );
    } else {
      setLocation('Lokasi tidak tersedia');
      setDefaultPrayerTimes();
    }
  }, [userLocation]);

  const getPrayerIcon = (name: string) => {
    switch (name) {
      case 'Terbit':
      case 'Dhuha':
        return <Sunrise className="w-4 h-4" />;
      case 'Maghrib':
        return <Sunset className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getPrayerColor = (name: string) => {
    switch (name) {
      case 'Subuh':
        return 'text-blue-600';
      case 'Terbit':
        return 'text-amber-600';
      case 'Dhuha':
        return 'text-yellow-600';
      case 'Dzuhur':
        return 'text-orange-500';
      case 'Ashar':
        return 'text-orange-600';
      case 'Maghrib':
        return 'text-red-600';
      case 'Isya':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  // Fungsi untuk mengecek apakah waktu sholat sudah masuk dengan timezone
  const isPrayerTimeActive = (prayerTime: string): boolean => {
    const [hours, minutes] = prayerTime.split(':').map(Number);
    const prayerDate = new Date();
    prayerDate.setHours(hours, minutes, 0, 0);
    
    return currentTime >= prayerDate;
  };

  // Mendapatkan sholat selanjutnya
  const getNextPrayer = (): string => {
    const prayerOrder = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    
    for (const prayer of prayerTimes) {
      if (prayer.key && prayerOrder.includes(prayer.key)) {
        const [hours, minutes] = prayer.time.split(':').map(Number);
        if (currentHour < hours || (currentHour === hours && currentMinute < minutes)) {
          return `${prayer.name} (${prayer.time})`;
        }
      }
    }
    
    return 'Subuh besok';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-100">
        <div className="flex items-center mb-6">
          <Clock className="w-6 h-6 text-emerald-600 mr-2" />
          <h2 className="text-xl font-bold text-gray-800">Waktu Shalat</h2>
        </div>
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Memuat waktu sholat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Clock className="w-6 h-6 text-emerald-600 mr-2" />
          <h2 className="text-xl font-bold text-gray-800">Waktu Shalat</h2>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {showSettings && (
        <div className="mb-4 p-4 bg-emerald-50 rounded-lg">
          <h3 className="font-semibold text-emerald-800 mb-3">Pengaturan Zona Waktu</h3>
          <div className="flex gap-2">
            {(['WIB', 'WITA', 'WIT'] as const).map((tz) => (
              <button
                key={tz}
                onClick={() => setTimezone(tz)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timezone === tz 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-white text-emerald-600 border border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                {tz}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center mb-4 text-sm text-gray-500">
        <MapPin className="w-4 h-4 mr-1" />
        <span>Lokasi: {location}</span>
      </div>

      <div className="mb-4 p-3 bg-emerald-50 rounded-lg text-center">
        <p className="text-sm text-emerald-700">
          <Clock className="w-4 h-4 inline mr-1" />
          Sekarang ({timezone}): {currentTime.toLocaleTimeString('id-ID', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
          })}
        </p>
      </div>

      <div className="space-y-3">
        {prayerTimes.map((prayer, index) => {
          const isActive = prayer.key && ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha', 'dhuha'].includes(prayer.key) 
            ? isPrayerTimeActive(prayer.time) 
            : true;
          
          return (
            <div
              key={index}
              className={`
                flex items-center justify-between p-3 rounded-lg border transition-all
                ${prayer.name === 'Terbit' 
                  ? 'bg-amber-50 border-amber-200' 
                  : isActive 
                    ? 'bg-green-50 border-green-200'
                    : 'bg-gray-50 border-gray-200'
                }
              `}
            >
              <div className="flex items-center space-x-3">
                <div className={`${getPrayerColor(prayer.name)}`}>
                  {getPrayerIcon(prayer.name)}
                </div>
                <div>
                  <span className="font-medium text-gray-800">
                    {prayer.name}
                  </span>
                  {prayer.key && ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha', 'dhuha'].includes(prayer.key) && (
                    <div className="flex items-center mt-1">
                      {isActive ? (
                        <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                      ) : (
                        <AlertCircle className="w-3 h-3 text-orange-500 mr-1" />
                      )}
                      <span className={`text-xs ${isActive ? 'text-green-600' : 'text-orange-600'}`}>
                        {isActive ? 'Sudah masuk' : 'Belum masuk'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <span className={`font-semibold ${getPrayerColor(prayer.name)}`}>
                  {prayer.time}
                </span>
                <div className="text-xs text-gray-500">{timezone}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-emerald-50 rounded-lg">
        <p className="text-sm text-emerald-700 text-center">
          <strong>Shalat Selanjutnya:</strong> {getNextPrayer()}
        </p>
      </div>

      <div className="mt-3 text-xs text-gray-500 text-center">
        ⓘ Absen shalat hanya bisa dilakukan setelah waktu shalat masuk
      </div>
    </div>
  );
};

export default PrayerTimes;