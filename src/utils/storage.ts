import { DailyProgress } from '../types';

const STORAGE_KEY = 'spiritual_journey_progress';

export const saveProgress = (progress: DailyProgress): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Failed to save progress:', error);
  }
};

export const loadProgress = (): DailyProgress => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure the loaded data has all required properties
      return {
        date: parsed.date || new Date().toDateString(),
        habits: {
          fajr: parsed.habits?.fajr || false,
          dhuhr: parsed.habits?.dhuhr || false,
          asr: parsed.habits?.asr || false,
          maghrib: parsed.habits?.maghrib || false,
          isha: parsed.habits?.isha || false,
          tahajud: parsed.habits?.tahajud || false,
          dhuha: parsed.habits?.dhuha || false,
          taubat: parsed.habits?.taubat || false,
          witir: parsed.habits?.witir || false,
          rawatib: parsed.habits?.rawatib || false,
          quranReading: parsed.habits?.quranReading || false,
          dhikr: parsed.habits?.dhikr || false,
          istighfar: parsed.habits?.istighfar || false,
          duaRecitation: parsed.habits?.duaRecitation || false,
          charitableDeed: parsed.habits?.charitableDeed || false,
        },
        reflection: parsed.reflection || '',
        streak: parsed.streak || 0
      };
    }
  } catch (error) {
    console.error('Failed to load progress:', error);
  }

  // Return default progress for today
  return {
    date: new Date().toDateString(),
    habits: {
      fajr: false,
      dhuhr: false,
      asr: false,
      maghrib: false,
      isha: false,
      tahajud: false,
      dhuha: false,
      taubat: false,
      witir: false,
      rawatib: false,
      quranReading: false,
      dhikr: false,
      istighfar: false,
      duaRecitation: false,
      charitableDeed: false,
    },
    reflection: '',
    streak: 0
  };
};

export const calculateStreak = (): number => {
  // This would typically involve checking multiple days of data
  // For now, return a simple calculation
  const progress = loadProgress();
  const totalHabits = Object.keys(progress.habits).length;
  const completedHabits = Object.values(progress.habits).filter(Boolean).length;
  
  // If today is 80% or more complete, maintain/increase streak
  return completedHabits >= (totalHabits * 0.8) ? (progress.streak || 0) + 1 : 0;
};