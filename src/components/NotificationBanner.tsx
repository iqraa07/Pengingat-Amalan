import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, Heart, Shield, Eye, Book } from 'lucide-react';

interface Notification {
  id: string;
  type: 'warning' | 'reminder' | 'motivation' | 'verse';
  title: string;
  message: string;
  icon: React.ComponentType<any>;
  bgColor: string;
  textColor: string;
  borderColor: string;
}

const NotificationBanner: React.FC = () => {
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const notifications: Notification[] = [
    {
      id: '1',
      type: 'warning',
      title: 'Peringatan Penting!',
      message: 'Jagalah mata dari pandangan haram. "Pandangan pertama untukmu, pandangan kedua adalah dosamu" (HR. Abu Dawud)',
      icon: Eye,
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      borderColor: 'border-red-300'
    },
    {
      id: '2',
      type: 'reminder',
      title: 'Pengingat Sholat',
      message: 'Sholat adalah tiang agama. Jangan sampai terlengah dengan dunia hingga melupakan kewajiban kepada Allah SWT.',
      icon: Heart,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800',
      borderColor: 'border-blue-300'
    },
    {
      id: '3',
      type: 'motivation',
      title: 'Semangat Taubat!',
      message: 'Allah sangat menyukai hamba yang bertaubat. Jangan putus asa dari rahmat Allah, pintunya selalu terbuka!',
      icon: Shield,
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      borderColor: 'border-green-300'
    },
    {
      id: '4',
      type: 'verse',
      title: 'Ayat Mulia',
      message: '"Dan siapa yang bertakwa kepada Allah niscaya Dia akan mengadakan baginya jalan keluar" (QS. At-Talaq: 2)',
      icon: Book,
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-800',
      borderColor: 'border-purple-300'
    },
    {
      id: '5',
      type: 'warning',
      title: 'Jauhi Maksiat!',
      message: '"Dan janganlah kamu mendekati zina; sesungguhnya zina itu adalah perbuatan keji dan jalan yang buruk" (QS. Al-Isra: 32)',
      icon: AlertTriangle,
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-800',
      borderColor: 'border-orange-300'
    },
    {
      id: '6',
      type: 'motivation',
      title: 'Kekuatan Istighfar',
      message: 'Perbanyak istighfar! "Setiap anak Adam pasti berdosa, dan sebaik-baik orang yang berdosa adalah yang bertaubat" (HR. Tirmidzi)',
      icon: Heart,
      bgColor: 'bg-emerald-100',
      textColor: 'text-emerald-800',
      borderColor: 'border-emerald-300'
    },
    {
      id: '7',
      type: 'reminder',
      title: 'Jaga Hati',
      message: '"Sesungguhnya dalam tubuh ada segumpal daging, jika dia baik maka baiklah seluruh tubuh" (HR. Bukhari)',
      icon: Shield,
      bgColor: 'bg-pink-100',
      textColor: 'text-pink-800',
      borderColor: 'border-pink-300'
    },
    {
      id: '8',
      type: 'verse',
      title: 'Janji Allah',
      message: '"Dan barangsiapa bertakwa kepada Allah, niscaya Allah mengadakan baginya kemudahan dalam urusannya" (QS. At-Talaq: 4)',
      icon: Book,
      bgColor: 'bg-teal-100',
      textColor: 'text-teal-800',
      borderColor: 'border-teal-300'
    }
  ];

  useEffect(() => {
    // Pilih notifikasi random saat component mount
    const randomIndex = Math.floor(Math.random() * notifications.length);
    setCurrentNotification(notifications[randomIndex]);
    
    // Set timer untuk menampilkan notifikasi
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    // Auto hide setelah 15 detik
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 16000);

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  // Ganti notifikasi setiap 20 detik
  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * notifications.length);
        setCurrentNotification(notifications[randomIndex]);
      }, 20000);

      return () => clearInterval(interval);
    }
  }, [isVisible]);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!currentNotification || !isVisible) return null;

  const IconComponent = currentNotification.icon;

  return (
    <div 
      className={`
        fixed top-4 left-4 right-4 z-50 
        ${currentNotification.bgColor} ${currentNotification.borderColor} 
        border-2 rounded-lg shadow-xl p-4 
        transform transition-all duration-500 ease-in-out
        ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}
        animate-pulse
      `}
    >
      <div className="flex items-start space-x-3">
        <div className={`flex-shrink-0 ${currentNotification.textColor}`}>
          <IconComponent className="w-6 h-6" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className={`text-sm font-bold ${currentNotification.textColor} mb-1`}>
            {currentNotification.title}
          </h3>
          <p className={`text-sm ${currentNotification.textColor} opacity-90 leading-relaxed`}>
            {currentNotification.message}
          </p>
        </div>
        
        <button
          onClick={handleClose}
          className={`
            flex-shrink-0 ${currentNotification.textColor} 
            hover:bg-black hover:bg-opacity-10 
            rounded-full p-1 transition-colors
          `}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      {/* Progress bar */}
      <div className="mt-3 w-full bg-white bg-opacity-30 rounded-full h-1">
        <div 
          className={`h-1 rounded-full ${currentNotification.textColor.replace('text-', 'bg-')} animate-pulse`}
          style={{
            width: '100%',
            animation: 'progress 20s linear infinite'
          }}
        ></div>
      </div>
      
      <style jsx>{`
        @keyframes progress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default NotificationBanner;