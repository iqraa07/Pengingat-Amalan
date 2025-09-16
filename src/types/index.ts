export interface Habit {
  fajr: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
  tahajud: boolean;
  dhuha: boolean;
  taubat: boolean;
  witir: boolean;
  rawatib: boolean;
  quranReading: boolean;
  dhikr: boolean;
  istighfar: boolean;
  duaRecitation: boolean;
  charitableDeed: boolean;
}

export interface DailyProgress {
  date: string;
  habits: Habit;
  reflection: string;
  streak: number;
}

export interface PrayerTime {
  name: string;
  time: string;
  key?: string;
}

export interface Quote {
  text: string;
  source: string;
  arabic?: string;
  latin?: string;
}