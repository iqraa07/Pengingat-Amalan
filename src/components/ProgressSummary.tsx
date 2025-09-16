import React from 'react';
import { Trophy, Calendar, TrendingUp } from 'lucide-react';

interface ProgressSummaryProps {
  completionPercentage: number;
  streak: number;
  date: string;
}

const ProgressSummary: React.FC<ProgressSummaryProps> = ({ 
  completionPercentage, 
  streak, 
  date 
}) => {
  const getMotivationalMessage = () => {
    if (completionPercentage === 100) return "Masha'Allah! Hari yang sempurna! 🌟";
    if (completionPercentage >= 80) return "Progress bagus! Terus semangat! 💪";
    if (completionPercentage >= 60) return "Kerja bagus! Kamu di jalur yang benar! 👍";
    if (completionPercentage >= 40) return "Terus maju! Istiqamah! 🌱";
    return "Setiap langkah berarti. Mulai sekarang! 🤲";
  };

  return (
    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl shadow-xl p-6 text-white">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Daily Progress Circle */}
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-emerald-300 opacity-30"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - completionPercentage / 100)}`}
                className="text-white transition-all duration-500"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold">{completionPercentage}%</span>
            </div>
          </div>
          <h3 className="font-semibold text-emerald-100">Progress Hari Ini</h3>
        </div>

        {/* Streak Counter */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Trophy className="w-12 h-12 text-amber-300" />
          </div>
          <div className="text-3xl font-bold mb-2">{streak}</div>
          <h3 className="font-semibold text-emerald-100">Hari Berturut-turut</h3>
        </div>

        {/* Motivation */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <TrendingUp className="w-12 h-12 text-cyan-300" />
          </div>
          <p className="text-lg font-semibold mb-2">{getMotivationalMessage()}</p>
          <p className="text-sm text-emerald-100">Terus pertahankan amal baik!</p>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-emerald-400">
        <div className="flex items-center justify-center">
          <Calendar className="w-5 h-5 mr-2 text-emerald-200" />
          <span className="text-emerald-100">{new Date(date).toDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressSummary;