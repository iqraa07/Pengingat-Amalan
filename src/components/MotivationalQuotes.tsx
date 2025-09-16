import React, { useState, useEffect } from 'react';
import { RefreshCw, Book } from 'lucide-react';
import { Quote } from '../types';

const MotivationalQuotes: React.FC = () => {
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);

  const quotes: Quote[] = [
    // Ayat Al-Quran dengan Latin tentang Zina dan Maksiat
    {
      text: "Dan janganlah kamu mendekati zina; sesungguhnya zina itu adalah suatu perbuatan yang keji dan suatu jalan yang buruk.",
      source: "QS. Al-Isra: 32",
      arabic: "وَلَا تَقْرَبُوا الزِّنَا ۖ إِنَّهُ كَانَ فَاحِشَةً وَسَاءَ سَبِيلًا",
      latin: "Wa laa taqrabuz zinaa innahu kaana faahisyatan wa saa'a sabiilaa"
    },
    {
      text: "Katakanlah kepada orang laki-laki yang beriman: Hendaklah mereka menahan pandangannya, dan memelihara kemaluannya; yang demikian itu adalah lebih suci bagi mereka.",
      source: "QS. An-Nur: 30",
      arabic: "قُلْ لِلْمُؤْمِنِينَ يَغُضُّوا مِنْ أَبْصَارِهِمْ وَيَحْفَظُوا فُرُوجَهُمْ ۚ ذَٰلِكَ أَزْكَىٰ لَهُمْ",
      latin: "Qul lil mu'miniina yaghuddhuu min absaarihim wa yahfazhuu furuujahum dzaalika azkaalaahu"
    },
    {
      text: "Katakanlah kepada wanita yang beriman: Hendaklah mereka menahan pandangannya, dan kemaluannya, dan janganlah mereka menampakkan perhiasannya kecuali yang biasa nampak dari padanya.",
      source: "QS. An-Nur: 31",
      arabic: "وَقُلْ لِلْمُؤْمِنَاتِ يَغْضُضْنَ مِنْ أَبْصَارِهِنَّ وَيَحْفَظْنَ فُرُوجَهُنَّ وَلَا يُبْدِينَ زِينَتَهُنَّ إِلَّا مَا ظَهَرَ مِنْهَا"
    },
    {
      text: "Dan orang-orang yang tidak menyembah tuhan yang lain beserta Allah dan tidak membunuh jiwa yang diharamkan Allah (membunuhnya) kecuali dengan hak, dan tidak berzina.",
      source: "QS. Al-Furqan: 68",
      arabic: "وَالَّذِينَ لَا يَدْعُونَ مَعَ اللَّهِ إِلَٰهًا آخَرَ وَلَا يَقْتُلُونَ النَّفْسَ الَّتِي حَرَّمَ اللَّهُ إِلَّا بِالْحَقِّ وَلَا يَزْنُونَ"
    },
    {
      text: "Kecuali orang yang bertaubat, beriman dan mengerjakan amal saleh; maka itu kejahatan mereka diganti Allah dengan kebajikan.",
      source: "QS. Al-Furqan: 70",
      arabic: "إِلَّا مَنْ تَابَ وَآمَنَ وَعَمِلَ عَمَلًا صَالِحًا فَأُولَٰئِكَ يُبَدِّلُ اللَّهُ سَيِّئَاتِهِمْ حَسَنَاتٍ"
    },
    {
      text: "Dan orang yang menjaga kemaluannya, kecuali terhadap isteri-isteri mereka atau budak yang mereka miliki; maka sesungguhnya mereka dalam hal ini tiada tercela.",
      source: "QS. Al-Mu'minun: 5-6",
      arabic: "وَالَّذِينَ هُمْ لِفُرُوجِهِمْ حَافِظُونَ إِلَّا عَلَىٰ أَزْوَاجِهِمْ أَوْ مَا مَلَكَتْ أَيْمَانُهُمْ فَإِنَّهُمْ غَيْرُ مَلُومِينَ"
    },
    {
      text: "Hai orang-orang yang beriman, janganlah kamu mengikuti langkah-langkah syaitan. Barangsiapa yang mengikuti langkah-langkah syaitan, maka sesungguhnya syaitan itu menyuruh mengerjakan perbuatan yang keji dan yang mungkar.",
      source: "QS. An-Nur: 21",
      arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا لَا تَتَّبِعُوا خُطُوَاتِ الشَّيْطَانِ ۚ وَمَنْ يَتَّبِعْ خُطُوَاتِ الشَّيْطَانِ فَإِنَّهُ يَأْمُرُ بِالْفَحْشَاءِ وَالْمُنْكَرِ"
    },
    {
      text: "Dan siapa yang bertakwa kepada Allah niscaya Dia akan mengadakan baginya jalan keluar, dan memberinya rezki dari arah yang tiada disangka-sangkanya.",
      source: "QS. At-Talaq: 2-3",
      arabic: "وَمَنْ يَتَّقِ اللَّهَ يَجْعَلْ لَهُ مَخْرَجًا وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ"
    },
    {
      text: "Sesungguhnya Allah tidak mengubah keadaan suatu kaum sehingga mereka mengubah keadaan yang ada pada diri mereka sendiri.",
      source: "QS. Ar-Ra'd: 11",
      arabic: "إِنَّ اللَّهَ لَا يُغَيِّرُ مَا بِقَوْمٍ حَتَّىٰ يُغَيِّرُوا مَا بِأَنْفُسِهِمْ"
    },
    {
      text: "Dan bertaubatlah kamu sekalian kepada Allah, hai orang-orang yang beriman supaya kamu beruntung.",
      source: "QS. An-Nur: 31",
      arabic: "وَتُوبُوا إِلَى اللَّهِ جَمِيعًا أَيُّهَا الْمُؤْمِنُونَ لَعَلَّكُمْ تُفْلِحُونَ"
    },
    
    // Hadits Sahih tentang Menjaga Diri
    {
      text: "Setiap anak Adam pasti berdosa, dan sebaik-baik orang yang berdosa adalah yang bertaubat.",
      source: "HR. At-Tirmidzi, Ibnu Majah, dan Ahmad",
      arabic: "كُلُّ ابْنِ آدَمَ خَطَّاءٌ وَخَيْرُ الْخَطَّائِينَ التَّوَّابُونَ"
    },
    {
      text: "Barangsiapa yang Allah kehendaki kebaikan padanya, maka Allah akan mengujinya dengan musibah.",
      source: "HR. Bukhari",
      arabic: "مَنْ يُرِدِ اللَّهُ بِهِ خَيْرًا يُصِبْ مِنْهُ"
    },
    {
      text: "Zina mata adalah melihat, zina telinga adalah mendengar, zina lisan adalah berkata, zina tangan adalah menyentuh, zina kaki adalah melangkah, dan hati berkeinginan dan berangan-angan, lalu kemaluan yang membenarkan semua itu atau mendustakannya.",
      source: "HR. Bukhari dan Muslim",
      arabic: "إِنَّ اللَّهَ كَتَبَ عَلَى ابْنِ آدَمَ حَظَّهُ مِنَ الزِّنَا"
    },
    {
      text: "Mata itu berzina dan zinanya mata adalah melihat. Telinga itu berzina dan zinanya adalah mendengar.",
      source: "HR. Bukhari",
      arabic: "الْعَيْنَانِ تَزْنِيَانِ وَزِنَاهُمَا النَّظَرُ"
    },
    {
      text: "Jauhilah tujuh perkara yang membinasakan. Para sahabat bertanya: 'Apakah itu ya Rasulullah?' Beliau menjawab: 'Menyekutukan Allah, sihir, membunuh jiwa yang diharamkan Allah kecuali dengan hak, memakan riba, memakan harta anak yatim, lari dari medan perang, dan menuduh berzina kepada wanita-wanita mukminah yang baik-baik lagi lalai.'",
      source: "HR. Bukhari dan Muslim",
      arabic: "اجْتَنِبُوا السَّبْعَ الْمُوبِقَاتِ"
    },
    {
      text: "Allah sangat penyayang kepada hamba-Nya yang bertaubat. Allah lebih gembira dengan taubat seorang hamba daripada seseorang dari kalian yang menemukan untanya yang hilang di tanah lapang.",
      source: "HR. Muslim",
      arabic: "لَلَّهُ أَفْرَحُ بِتَوْبَةِ عَبْدِهِ"
    },
    {
      text: "Sesungguhnya syaitan mengalir dalam tubuh anak Adam seperti mengalirnya darah.",
      source: "HR. Bukhari dan Muslim",
      arabic: "إِنَّ الشَّيْطَانَ يَجْرِي مِنِ ابْنِ آدَمَ مَجْرَى الدَّمِ"
    },
    {
      text: "Dan barangsiapa yang memelihara diri dari syubhat berarti dia telah membersihkan agamanya dan kehormatannya.",
      source: "HR. Bukhari dan Muslim",
      arabic: "فَمَنِ اتَّقَى الشُّبُهَاتِ فَقَدِ اسْتَبْرَأَ لِدِينِهِ وَعِرْضِهِ"
    },
    {
      text: "Tidaklah seorang laki-laki berduaan dengan seorang wanita, melainkan yang ketiganya adalah syaitan.",
      source: "HR. Ahmad dan At-Tirmidzi",
      arabic: "مَا خَلَا رَجُلٌ بِامْرَأَةٍ إِلَّا كَانَ ثَالِثَهُمَا الشَّيْطَانُ"
    },
    {
      text: "Dunia itu hijau nan manis, dan sesungguhnya Allah menjadikan kalian sebagai khalifah atasnya, maka Allah melihat bagaimana perbuatan kalian. Maka berhati-hatilah kalian terhadap dunia dan berhati-hatilah kalian terhadap wanita.",
      source: "HR. Muslim",
      arabic: "إِنَّ الدُّنْيَا حُلْوَةٌ خَضِرَةٌ"
    },
    
    // Dalil tentang Taubat dan Istighfar
    {
      text: "Dan siapa yang mengerjakan kejahatan atau menganiaya dirinya, kemudian ia mohon ampun kepada Allah, niscaya ia mendapati Allah Maha Pengampun lagi Maha Penyayang.",
      source: "QS. An-Nisa: 110",
      arabic: "وَمَنْ يَعْمَلْ سُوءًا أَوْ يَظْلِمْ نَفْسَهُ ثُمَّ يَسْتَغْفِرِ اللَّهَ يَجِدِ اللَّهَ غَفُورًا رَحِيمًا"
    },
    {
      text: "Dan Kami jadikan dari mereka itu pemimpin-pemimpin yang memberi petunjuk dengan perintah Kami ketika mereka sabar. Dan adalah mereka meyakini ayat-ayat Kami.",
      source: "QS. As-Sajdah: 24",
      arabic: "وَجَعَلْنَا مِنْهُمْ أَئِمَّةً يَهْدُونَ بِأَمْرِنَا لَمَّا صَبَرُوا"
    },
    {
      text: "Hai orang-orang yang beriman, bertaubatlah kepada Allah dengan taubatan nashuha (taubat yang semurni-murninya).",
      source: "QS. At-Tahrim: 8",
      arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا تُوبُوا إِلَى اللَّهِ تَوْبَةً نَصُوحًا"
    },
    {
      text: "Katakanlah: Hai hamba-hamba-Ku yang melampaui batas terhadap diri mereka sendiri, janganlah berputus asa dari rahmat Allah. Sesungguhnya Allah mengampuni dosa-dosa semuanya.",
      source: "QS. Az-Zumar: 53",
      arabic: "قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنْفُسِهِمْ لَا تَقْنَطُوا مِنْ رَحْمَةِ اللَّهِ"
    },
    {
      text: "Dan siapa yang bertaubat dan mengerjakan amal saleh, maka sesungguhnya dia bertaubat kepada Allah dengan taubatan yang sebenar-benarnya.",
      source: "QS. Al-Furqan: 71",
      arabic: "وَمَنْ تَابَ وَعَمِلَ صَالِحًا فَإِنَّهُ يَتُوبُ إِلَى اللَّهِ مَتَابًا"
    },
    
    // Hadits tentang Menjaga Mata dan Hati
    {
      text: "Pandangan pertama adalah untukmu, pandangan kedua adalah atasmu (dosa).",
      source: "HR. Abu Dawud dan At-Tirmidzi",
      arabic: "لَكَ الْأُولَى وَعَلَيْكَ الْأُخْرَى"
    },
    {
      text: "Barangsiapa menjamin untukku apa yang ada di antara kedua rahangnya (lidah) dan apa yang ada di antara kedua pahanya (kemaluan), aku jamin baginya surga.",
      source: "HR. Bukhari",
      arabic: "مَنْ يَضْمَنْ لِي مَا بَيْنَ لَحْيَيْهِ وَمَا بَيْنَ رِجْلَيْهِ أَضْمَنْ لَهُ الْجَنَّةَ"
    },
    {
      text: "Sesungguhnya dalam tubuh ada segumpal daging, jika dia baik maka baiklah seluruh tubuh, dan jika dia rusak maka rusaklah seluruh tubuh. Ketahuilah bahwa dia adalah hati.",
      source: "HR. Bukhari dan Muslim",
      arabic: "أَلَا وَإِنَّ فِي الْجَسَدِ مُضْغَةً إِذَا صَلَحَتْ صَلَحَ الْجَسَدُ كُلُّهُ"
    },
    
    // Ayat tentang Takwa dan Penjagaan Diri
    {
      text: "Hai orang-orang yang beriman, bertakwalah kepada Allah sebenar-benar takwa kepada-Nya; dan janganlah sekali-kali kamu mati melainkan dalam keadaan beragama Islam.",
      source: "QS. Ali Imran: 102",
      arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ حَقَّ تُقَاتِهِ وَلَا تَمُوتُنَّ إِلَّا وَأَنْتُمْ مُسْلِمُونَ"
    },
    {
      text: "Dan barangsiapa bertakwa kepada Allah, niscaya Allah mengadakan baginya kemudahan dalam urusannya.",
      source: "QS. At-Talaq: 4",
      arabic: "وَمَنْ يَتَّقِ اللَّهَ يَجْعَلْ لَهُ مِنْ أَمْرِهِ يُسْرًا"
    }
  ];

  useEffect(() => {
    // Set initial quote
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setCurrentQuote(quotes[randomIndex]);
  }, []);

  const getNewQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setCurrentQuote(quotes[randomIndex]);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Book className="w-6 h-6 text-emerald-600 mr-2" />
          <h2 className="text-xl font-bold text-gray-800">Peringatan dari Al-Quran & Hadits</h2>
        </div>
        <button
          onClick={getNewQuote}
          className="p-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-full transition-colors"
          title="Ayat/Hadits Baru"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {currentQuote && (
        <div className="space-y-4">
          {currentQuote.arabic && (
            <div className="text-right p-4 bg-emerald-50 rounded-lg">
              <p className="text-lg arabic-font text-emerald-800 leading-relaxed">
                {currentQuote.arabic}
              </p>
              {currentQuote.latin && (
                <p className="text-sm text-emerald-600 italic mt-2 text-left">
                  <strong>Latin:</strong> {currentQuote.latin}
                </p>
              )}
            </div>
          )}
          
          <div className="space-y-3">
            <p className="text-gray-700 leading-relaxed italic">
              "{currentQuote.text}"
            </p>
            <p className="text-sm text-emerald-600 font-semibold">
              — {currentQuote.source}
            </p>
          </div>
          
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700 text-center">
              <strong>Peringatan:</strong> Jagalah mata, hati, dan anggota badan dari hal-hal yang diharamkan Allah SWT
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MotivationalQuotes;