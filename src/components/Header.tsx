import React from 'react';
import { Moon, Sun } from 'lucide-react';

const Header: React.FC = () => {
  const currentDate = new Date();
  const islamicDate = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(currentDate);

  return (
    <header className="bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-700 text-white shadow-2xl">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              <span className="arabic-font">تَوْبَة</span> & <span className="arabic-font">إِسْتِغْفَار</span>
            </h1>
            <p className="text-emerald-100 text-lg">Perjalanan Taubat & Penjagaan Diri dari Maksiat</p>
          </div>
          
          <div className="text-center md:text-right">
            <div className="flex items-center justify-center md:justify-end mb-2">
              <Sun className="w-5 h-5 mr-2 text-amber-200" />
              <span className="text-emerald-100">
                {currentDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
            <div className="flex items-center justify-center md:justify-end">
              <Moon className="w-4 h-4 mr-2 text-slate-200" />
              <span className="text-slate-200 text-sm">{islamicDate}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;