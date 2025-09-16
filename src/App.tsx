import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HabitTracker from './components/HabitTracker';
import ProgressSummary from './components/ProgressSummary';
import MotivationalQuotes from './components/MotivationalQuotes';
import PrayerTimes from './components/PrayerTimes';
import ReflectionJournal from './components/ReflectionJournal';
import TelegramIntegration from './components/TelegramIntegration';
import QiblaDirection from './components/QiblaDirection';
import TasbihCounter from './components/TasbihCounter';
import NotificationBanner from './components/NotificationBanner';
import { Habit, DailyProgress, PrayerTime } from './types';
import { loadProgress, saveProgress } from './utils/storage';
import './styles/islamic-patterns.css';

function App() {
  const [dailyProgress, setDailyProgress] = useState<DailyProgress>(() => loadProgress());
  const [currentDate] = useState(() => new Date().toDateString());
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  // Reset progress for new day
  useEffect(() => {
    const today = new Date().toDateString();
    if (dailyProgress.date !== today) {
      const newProgress: DailyProgress = {
        date: today,
        habits: {
          fajr: false,
          dhuhr: false,
          asr: false,
          maghrib: false,
          isha: false,
          quranReading: false,
          dhikr: false,
          istighfar: false,
          duaRecitation: false,
          charitableDeed: false
        },
        reflection: '',
        streak: dailyProgress.streak || 0
      };
      setDailyProgress(newProgress);
      saveProgress(newProgress);
    }
  }, []);

  useEffect(() => {
    saveProgress(dailyProgress);
  }, [dailyProgress]);

  const updateHabit = (habitKey: keyof typeof dailyProgress.habits, completed: boolean) => {
    setDailyProgress(prev => ({
      ...prev,
      habits: {
        ...prev.habits,
        [habitKey]: completed
      }
    }));
  };

  const updateReflection = (reflection: string) => {
    setDailyProgress(prev => ({
      ...prev,
      reflection
    }));
  };

  const getCompletionPercentage = () => {
    const totalHabits = Object.keys(dailyProgress.habits).length;
    const completedHabits = Object.values(dailyProgress.habits).filter(Boolean).length;
    return Math.round((completedHabits / totalHabits) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="islamic-pattern-overlay"></div>
      
      <NotificationBanner />
      
      <div className="relative z-10">
        <Header />
        
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              <ProgressSummary 
                completionPercentage={getCompletionPercentage()}
                streak={dailyProgress.streak || 0}
                date={currentDate}
              />
              
              <HabitTracker 
                habits={dailyProgress.habits}
                onHabitUpdate={updateHabit}
                prayerTimes={prayerTimes}
              />
              
              <ReflectionJournal 
                reflection={dailyProgress.reflection}
                onReflectionUpdate={updateReflection}
              />
            </div>
            
            {/* Right Column */}
            <div className="space-y-8">
              <PrayerTimes 
                onPrayerTimesUpdate={setPrayerTimes} 
                userLocation={userLocation}
              />
              <QiblaDirection 
                onLocationUpdate={setUserLocation}
              />
              <TasbihCounter />
              <MotivationalQuotes />
              <TelegramIntegration 
                dailyProgress={dailyProgress}
                completionPercentage={getCompletionPercentage()}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;