import React, { useState, useEffect } from 'react';
import { Send, MessageCircle, CheckCircle, AlertCircle, Settings, Copy, ExternalLink } from 'lucide-react';
import { DailyProgress } from '../types';
import { sendTelegramMessage, sendDailyReport, sendMotivationalMessage, checkBotConnection } from '../services/telegramService';

interface TelegramIntegrationProps {
  dailyProgress: DailyProgress;
  completionPercentage: number;
}

const TelegramIntegration: React.FC<TelegramIntegrationProps> = ({ 
  dailyProgress, 
  completionPercentage 
}) => {
  const [isSending, setIsSending] = useState(false);
  const [lastSent, setLastSent] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [chatId, setChatId] = useState('');
  const [showTutorial, setShowTutorial] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');

  useEffect(() => {
    const savedChatId = localStorage.getItem('telegram_chat_id');
    if (savedChatId) {
      setChatId(savedChatId);
      checkConnection(savedChatId);
    } else {
      setConnectionStatus('disconnected');
    }
  }, []);

  const checkConnection = async (testChatId: string) => {
    try {
      setConnectionStatus('checking');
      const connected = await checkBotConnection(testChatId);
      setIsConnected(connected);
      setConnectionStatus(connected ? 'connected' : 'disconnected');
    } catch (error) {
      setIsConnected(false);
      setConnectionStatus('disconnected');
    }
  };

  const handleConnect = async () => {
    if (!chatId.trim()) {
      alert('Silakan masukkan Chat ID Telegram Anda');
      return;
    }

    // Validasi format Chat ID (harus angka)
    if (!/^\d+$/.test(chatId.trim())) {
      alert('Chat ID harus berupa angka saja (contoh: 123456789)');
      return;
    }

    try {
      setConnectionStatus('checking');
      await checkConnection(chatId);
      if (isConnected) {
        localStorage.setItem('telegram_chat_id', chatId);
        await sendTelegramMessage(
          '🎉 <b>Alhamdulillah! Berhasil Terhubung!</b>\n\n' +
          'Akun Telegram Anda berhasil terhubung dengan website Spiritual Tracker!\n\n' +
          '✅ Anda akan menerima:\n' +
          '• Laporan harian ibadah\n' +
          '• Motivasi spiritual\n' +
          '• Pengingat sholat dan dzikir\n\n' +
          '🤲 Semoga Allah memberkahi perjalanan spiritual Anda!',
          chatId
        );
        alert('Berhasil terhubung ke Telegram! Cek pesan di bot Anda.');
      } else {
        alert(
          'Gagal terhubung. Pastikan:\n\n' +
          '1. Anda sudah kirim pesan /start ke @Arcyyybot\n' +
          '2. Chat ID sudah benar (hanya angka)\n' +
          '3. Bot sudah aktif dan bisa menerima pesan\n\n' +
          'Coba kirim pesan apa saja ke @Arcyyybot dulu, lalu ambil Chat ID dengan /id'
        );
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Connection error:', error);
      
      if (errorMessage.includes('Forbidden') || errorMessage.includes('chat not found')) {
        alert(
          'Bot tidak bisa mengakses chat Anda.\n\n' +
          'Solusi:\n' +
          '1. Pastikan sudah kirim /start ke @Arcyyybot\n' +
          '2. Jangan block atau hapus chat dengan bot\n' +
          '3. Chat ID harus dari chat pribadi dengan bot, bukan grup'
        );
      } else {
        alert('Error koneksi: ' + errorMessage + '\n\nCoba lagi dalam beberapa saat.');
      }
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem('telegram_chat_id');
    setChatId('');
    setIsConnected(false);
    setConnectionStatus('disconnected');
  };

  const handleSendDailyReport = async () => {
    if (!isConnected) {
      alert('Silakan hubungkan Telegram terlebih dahulu');
      return;
    }

    setIsSending(true);
    try {
      await sendDailyReport(dailyProgress, completionPercentage, chatId);
      setLastSent('Laporan Harian');
      setTimeout(() => setLastSent(null), 3000);
    } catch (error) {
      console.error('Failed to send daily report:', error);
      alert('Gagal mengirim laporan: ' + error);
    } finally {
      setIsSending(false);
    }
  };

  const handleSendMotivation = async () => {
    if (!isConnected) {
      alert('Silakan hubungkan Telegram terlebih dahulu');
      return;
    }

    setIsSending(true);
    try {
      await sendMotivationalMessage(chatId);
      setLastSent('Motivasi');
      setTimeout(() => setLastSent(null), 3000);
    } catch (error) {
      console.error('Failed to send motivation:', error);
      alert('Gagal mengirim motivasi: ' + error);
    } finally {
      setIsSending(false);
    }
  };

  const copyBotLink = () => {
    navigator.clipboard.writeText('https://t.me/Arcyyybot');
    alert('Link bot berhasil disalin!');
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-100 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <MessageCircle className="w-6 h-6 text-emerald-600 mr-2" />
          <h2 className="text-xl font-bold text-gray-800">Pengingat & Kontrol Diri</h2>
        </div>
        <button
          onClick={() => setShowTutorial(!showTutorial)}
          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      <p className="text-sm text-gray-600 mb-6">
        Tetap terjaga dari maksiat dengan laporan harian dan pengingat motivasi yang dikirim ke Telegram Anda.
      </p>

      {/* Status Koneksi */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${
              connectionStatus === 'connected' ? 'bg-green-500 animate-pulse' :
              connectionStatus === 'checking' ? 'bg-yellow-500 animate-spin' : 'bg-red-500'
            }`}></div>
            <span className="text-sm font-medium">
              Status: {
                connectionStatus === 'connected' ? 'Terhubung ✅' :
                connectionStatus === 'checking' ? 'Mengecek...' : 'Belum Terhubung ❌'
              }
            </span>
          </div>
          {isConnected && (
            <button
              onClick={handleDisconnect}
              className="text-xs text-red-600 hover:text-red-700"
            >
              Putus Koneksi
            </button>
          )}
        </div>
      </div>

      {/* Tutorial & Koneksi */}
      {(!isConnected || showTutorial) && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200 animate-slideIn">
          <h3 className="font-semibold text-blue-800 mb-3">📱 Cara Mendapatkan Chat ID Telegram</h3>
          
          <div className="space-y-3 text-sm text-blue-700">
            <div className="flex items-start space-x-2">
              <span className="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">1</span>
              <div>
                <p>Buka bot kami di Telegram:</p>
                <div className="mt-1 flex items-center space-x-2">
                  <code className="bg-blue-200 px-2 py-1 rounded text-xs">@Arcyyybot</code>
                  <button onClick={copyBotLink} className="text-blue-600 hover:text-blue-700">
                    <Copy className="w-4 h-4" />
                  </button>
                  <a href="https://t.me/Arcyyybot" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <span className="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">2</span>
              <div>
                <p>Klik <strong>START</strong> atau kirim pesan <code>/start</code> ke bot</p>
                <p className="text-xs text-blue-600 mt-1">⚠️ Wajib! Bot tidak bisa mengirim pesan jika belum di-start</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <span className="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">3</span>
              <div>
                <p>Kirim pesan <code>/id</code> untuk mendapatkan Chat ID Anda</p>
                <p className="text-xs text-blue-600 mt-1">Chat ID berbentuk angka (contoh: 965058766)</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <span className="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">4</span>
              <div>
                <p>Copy dan paste Chat ID ke kolom di bawah</p>
                <p className="text-xs text-blue-600 mt-1">Hanya angka saja, tanpa teks lain</p>
              </div>
            </div>
            
            <div className="mt-3 p-2 bg-yellow-100 border border-yellow-300 rounded">
              <p className="text-xs text-yellow-800">
                <strong>💡 Tips:</strong> Jika masih gagal, coba kirim pesan apa saja ke @Arcyyybot dulu (contoh: "Halo"), 
                lalu baru ambil Chat ID dengan /id
              </p>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chat ID Telegram Anda:
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
                placeholder="Masukkan Chat ID (hanya angka)"
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300"
                pattern="[0-9]*"
                inputMode="numeric"
              />
              <button
                onClick={handleConnect}
                disabled={connectionStatus === 'checking'}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                {connectionStatus === 'checking' ? 'Mengecek...' : 'Hubungkan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tombol Aksi */}
      {isConnected && (
        <div className="space-y-4 animate-fadeIn">
          <button
            onClick={handleSendDailyReport}
            disabled={isSending}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
          >
            {isSending ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Kirim Laporan Harian
              </>
            )}
          </button>

          <button
            onClick={handleSendMotivation}
            disabled={isSending}
            className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-300 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
          >
            {isSending ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <MessageCircle className="w-5 h-5 mr-2" />
                Kirim Motivasi Spiritual
              </>
            )}
          </button>

          {lastSent && (
            <div className="flex items-center text-sm text-emerald-600 bg-emerald-50 p-3 rounded-lg animate-pulse">
              <CheckCircle className="w-4 h-4 mr-2" />
              {lastSent} berhasil terkirim! 🎉
            </div>
          )}
        </div>
      )}

      {/* Statistik */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-3">📊 Statistik Harian</h3>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-emerald-50 p-4 rounded-lg transform hover:scale-105 transition-transform">
            <div className="text-3xl font-bold text-emerald-600">{completionPercentage}%</div>
            <div className="text-xs text-emerald-700">Progress Hari Ini</div>
            <div className="text-xs text-emerald-600 mt-1">
              {Object.values(dailyProgress.habits).filter(Boolean).length}/{Object.keys(dailyProgress.habits).length} selesai
            </div>
          </div>
          <div className="bg-teal-50 p-4 rounded-lg transform hover:scale-105 transition-transform">
            <div className="text-3xl font-bold text-teal-600">{dailyProgress.streak || 0}</div>
            <div className="text-xs text-teal-700">Hari Berturut-turut</div>
            <div className="text-xs text-teal-600 mt-1">Istiqamah 💪</div>
          </div>
        </div>
      </div>

      {/* Pengingat */}
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-yellow-700">
            <strong>Ingat:</strong> Bot akan mengirim pengingat otomatis untuk menjaga konsistensi ibadah Anda. Semoga Allah mempermudah perjalanan spiritual kita!
          </p>
        </div>
      </div>
    </div>
  );
};

export default TelegramIntegration;