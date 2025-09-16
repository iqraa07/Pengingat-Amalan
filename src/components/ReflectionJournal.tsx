import React from 'react';
import { Edit3, Heart } from 'lucide-react';

interface ReflectionJournalProps {
  reflection: string;
  onReflectionUpdate: (reflection: string) => void;
}

const ReflectionJournal: React.FC<ReflectionJournalProps> = ({ 
  reflection, 
  onReflectionUpdate 
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-100">
      <div className="flex items-center mb-6">
        <Heart className="w-6 h-6 text-emerald-600 mr-2" />
        <h2 className="text-xl font-bold text-gray-800">Muhasabah Diri</h2>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Luangkan waktu untuk muhasabah diri dan merenungkan perjalanan spiritual hari ini. 
          Sudahkah menjaga mata dari yang haram? Apakah hati dan pikiran terjaga dari maksiat? 
          Bagaimana cara memperbaiki diri besok?
        </p>

        <div className="relative">
          <textarea
            value={reflection}
            onChange={(e) => onReflectionUpdate(e.target.value)}
            placeholder="Tuliskan muhasabah diri di sini... Bagaimana kondisi hati dan jiwa hari ini? Apakah sudah menjauhi zina dan maksiat lainnya? Sudahkah menahan pandangan dari yang haram? Apa yang bisa diperbaiki besok agar lebih dekat dengan Allah?"
            className="w-full h-32 p-4 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 transition-colors"
          />
          <Edit3 className="absolute top-3 right-3 w-4 h-4 text-gray-400" />
        </div>

        <div className="flex justify-between text-xs text-gray-500">
          <span>Muhasabah diri membantu menjauhi maksiat dan mendekatkan diri kepada Allah</span>
          <span>{reflection.length}/1000</span>
        </div>
      </div>

      {reflection.length > 0 && (
        <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
          <p className="text-sm text-emerald-700">
            <strong>Alhamdulillah!</strong> Muhasabah diri Anda telah tersimpan. Semoga Allah membantu menjauhi maksiat.
          </p>
        </div>
      )}
      
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-700 text-center">
          <strong>Ingatlah:</strong> "وَلَا تَقْرَبُوا الزِّنَا ۖ إِنَّهُ كَانَ فَاحِشَةً وَسَاءَ سَبِيلًا"<br/>
          <em>"Dan janganlah kamu mendekati zina; sesungguhnya zina itu adalah suatu perbuatan yang keji dan suatu jalan yang buruk." (QS. Al-Isra: 32)</em>
        </p>
      </div>
    </div>
  );
};

export default ReflectionJournal;