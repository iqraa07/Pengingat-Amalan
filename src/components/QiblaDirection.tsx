import React, { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import { Compass, Navigation, MapPin, RefreshCw } from 'lucide-react';

// Koordinat Kabah di Makkah
const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

interface QiblaDirectionProps {
  onLocationUpdate?: (location: {lat: number, lng: number}) => void;
}

// Menghitung arah kiblat berdasarkan koordinat
const calculateQiblaDirection = (lat: number, lng: number): number => {
  const latRad = (lat * Math.PI) / 180;
  const lngRad = (lng * Math.PI) / 180;
  const kaabaLatRad = (KAABA_LAT * Math.PI) / 180;
  const kaabaLngRad = (KAABA_LNG * Math.PI) / 180;

  const deltaLng = kaabaLngRad - lngRad;

  const y = Math.sin(deltaLng) * Math.cos(kaabaLatRad);
  const x = Math.cos(latRad) * Math.sin(kaabaLatRad) - 
            Math.sin(latRad) * Math.cos(kaabaLatRad) * Math.cos(deltaLng);

  let bearing = Math.atan2(y, x);
  bearing = (bearing * 180) / Math.PI;
  bearing = (bearing + 360) % 360;

  return bearing;
};

const QiblaDirection: React.FC<QiblaDirectionProps> = ({ onLocationUpdate }) => {
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
  const [deviceHeading, setDeviceHeading] = useState<number>(0);
  const [coordinates, setCoordinates] = useState<{lat: number, lng: number} | null>(null);
  const [locationName, setLocationName] = useState('Mendapatkan lokasi...');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [permissionStatus, setPermissionStatus] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [showLocationButton, setShowLocationButton] = useState(true);
  
  // Define handleSuccess as a top-level useCallback
  const handleSuccess = useCallback((position: GeolocationPosition) => {
    try {
      const { latitude, longitude } = position.coords;
      setCoordinates({ lat: latitude, lng: longitude });
      
      // Hitung arah kiblat
      const qibla = calculateQiblaDirection(latitude, longitude);
      setQiblaDirection(qibla);
      
      // Update parent component with location
      if (onLocationUpdate) {
        onLocationUpdate({ lat: latitude, lng: longitude });
      }
      
      // Dapatkan nama lokasi
      const locationString = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
      
      // Tentukan zona waktu berdasarkan longitude
      let locationWithTimezone = locationString;
      if (longitude < 105) {
        locationWithTimezone += ' (WIB)';
      } else if (longitude < 135) {
        locationWithTimezone += ' (WITA)';
      } else {
        locationWithTimezone += ' (WIT)';
      }
      
      setLocationName(locationWithTimezone);
      setLoading(false);
      setPermissionStatus('granted');
    } catch (error) {
      console.error('Error processing location:', error);
      setError('Terjadi kesalahan saat memproses lokasi.');
      setLoading(false);
      setShowLocationButton(true);
    }
  }, [onLocationUpdate, setCoordinates, setQiblaDirection, setLocationName, setLoading, setPermissionStatus]);

  // Define handleError as a top-level useCallback
  const handleError = useCallback((err: GeolocationPositionError) => {
    console.error('Geolocation error:', err);
    let errorMessage = 'Tidak dapat mengakses lokasi. ';
    
    switch(err.code) {
      case err.PERMISSION_DENIED:
        errorMessage += 'Izin lokasi ditolak. Silakan aktifkan izin lokasi di browser.';
        setPermissionStatus('denied');
        break;
      case err.POSITION_UNAVAILABLE:
        errorMessage += 'Informasi lokasi tidak tersedia.';
        break;
      case err.TIMEOUT:
        errorMessage += 'Waktu untuk mendapatkan lokasi habis.';
        break;
      default:
        errorMessage += 'Terjadi kesalahan yang tidak diketahui.';
        break;
    }
    
    setError(errorMessage);
    setLoading(false);
    setShowLocationButton(true);
  }, [setError, setLoading, setPermissionStatus, setShowLocationButton]);

  // Fungsi untuk mendapatkan lokasi user
  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolokasi tidak didukung oleh browser ini.');
      setLoading(false);
      setShowLocationButton(false);
      return;
    }

    setLoading(true);
    setError('');
    setShowLocationButton(false);

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError,
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000 // Cache 5 menit
      }
    );
  }, [handleSuccess, handleError]);

  // Cek permission lokasi saat component mount
  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setPermissionStatus(result.state as 'prompt' | 'granted' | 'denied');
        setLoading(false);
        
        if (result.state === 'granted') {
          // Jika sudah ada permission, otomatis request lokasi
          requestLocation();
        }
      }).catch(() => {
        // Fallback jika permissions API tidak didukung
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  // Mendapatkan arah kompas perangkat
  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null) {
        setDeviceHeading(360 - event.alpha);
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
      return () => window.removeEventListener('deviceorientation', handleOrientation);
    }
  }, []);

  const refreshLocation = useCallback(() => {
    setLoading(true);
    setError('');
    setShowLocationButton(false);
    requestLocation();
  }, [setLoading, setError, setShowLocationButton, requestLocation]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-100">
        <div className="flex items-center mb-6">
          <Compass className="w-6 h-6 text-emerald-600 mr-2" />
          <h2 className="text-xl font-bold text-gray-800">Arah Kiblat</h2>
        </div>
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Menentukan arah kiblat...</p>
        </div>
      </div>
    );
  }

  // Tampilan untuk meminta aktivasi lokasi
  if (showLocationButton && !coordinates && !error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-100">
        <div className="flex items-center mb-6">
          <Compass className="w-6 h-6 text-emerald-600 mr-2" />
          <h2 className="text-xl font-bold text-gray-800">Arah Kiblat</h2>
        </div>
        
        <div className="text-center py-6">
          <div className="mb-4">
            <Navigation className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Tentukan Arah Kiblat Anda
            </h3>
            <p className="text-gray-600 mb-6">
              Aktifkan lokasi untuk mengetahui arah kiblat yang tepat dari posisi Anda
            </p>
          </div>
          
          <button
            onClick={requestLocation}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center mx-auto"
          >
            <MapPin className="w-5 h-5 mr-2" />
            Aktifkan Lokasi
          </button>
          
          <p className="text-xs text-gray-500 mt-4">
            Klik "Izinkan" pada popup browser untuk mengaktifkan lokasi
          </p>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm font-bold">i</span>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-blue-800 mb-1">Cara Mengaktifkan:</h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>1. Klik tombol "Aktifkan Lokasi"</li>
                <li>2. Browser akan menampilkan popup permission</li>
                <li>3. Pilih "Izinkan" atau "Allow"</li>
                <li>4. Tunggu hingga lokasi terdeteksi</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-100">
        <div className="flex items-center mb-6">
          <Compass className="w-6 h-6 text-emerald-600 mr-2" />
          <h2 className="text-xl font-bold text-gray-800">Arah Kiblat</h2>
        </div>
        <div className="text-center py-4">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={refreshLocation}
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
          >
            <RefreshCw className="w-4 h-4 inline mr-2" />
            Coba Lagi
          </button>
        </div>
        
        {permissionStatus === 'denied' && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">Izin Lokasi Ditolak</h4>
            <p className="text-sm text-yellow-700 mb-3">
              Untuk mengaktifkan kembali izin lokasi:
            </p>
            <ol className="text-xs text-yellow-700 space-y-1 ml-4">
              <li>1. Klik ikon gembok/lokasi di address bar browser</li>
              <li>2. Pilih "Izinkan" untuk akses lokasi</li>
              <li>3. Refresh halaman atau klik "Coba Lagi"</li>
            </ol>
          </div>
        )}
      </div>
    );
  }

  const qiblaAngle = qiblaDirection || 0;
  const compassAngle = (qiblaAngle - deviceHeading + 360) % 360;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Compass className="w-6 h-6 text-emerald-600 mr-2" />
          <h2 className="text-xl font-bold text-gray-800">Arah Kiblat</h2>
        </div>
        <button
          onClick={refreshLocation}
          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
          title="Perbarui Lokasi"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-2">
          <MapPin className="w-4 h-4 text-gray-500 mr-1" />
          <span className="text-sm text-gray-600">{locationName}</span>
        </div>
        <p className="text-lg font-semibold text-emerald-700">
          {qiblaAngle.toFixed(1)}° dari Utara
        </p>
      </div>

      {/* Kompas Visual */}
      <div className="relative mx-auto w-48 h-48 mb-6">
        <div className="absolute inset-0 rounded-full border-4 border-gray-200 bg-gradient-to-br from-emerald-50 to-teal-50">
          {/* Penanda Utara */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-red-600 font-bold">
            U
          </div>
          
          {/* Penanda arah mata angin */}
          <div className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500 text-sm">T</div>
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-gray-500 text-sm">S</div>
          <div className="absolute top-1/2 left-2 transform -translate-y-1/2 text-gray-500 text-sm">B</div>
          
          {/* Jarum Kiblat */}
          <div 
            className="absolute top-1/2 left-1/2 w-1 h-20 bg-emerald-600 rounded-full origin-bottom transform -translate-x-1/2 -translate-y-full transition-transform duration-300"
            style={{ 
              transform: `translate(-50%, -100%) rotate(${compassAngle}deg)`,
              transformOrigin: '50% 100%'
            }}
          >
            <div className="absolute -top-2 -left-2 w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center">
              <Navigation className="w-3 h-3 text-white" />
            </div>
          </div>
          
          {/* Titik tengah */}
          <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-emerald-600 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
      </div>

      <div className="text-center space-y-2">
        <p className="text-sm text-gray-600">
          Arahkan perangkat Anda sehingga jarum hijau menunjuk ke arah Kiblat
        </p>
        <div className="flex justify-center items-center space-x-4 text-xs text-gray-500">
          <span>Kiblat: {qiblaAngle.toFixed(1)}°</span>
          <span>Perangkat: {deviceHeading.toFixed(1)}°</span>
        </div>
      </div>

      <div className="mt-4 p-3 bg-emerald-50 rounded-lg">
        <p className="text-sm text-emerald-700 text-center arabic-font" dir="rtl">
          اللَّهُمَّ بَلِّغْنَا الْمَسْجِدَ الْحَرَامَ
        </p>
        <p className="text-xs text-emerald-600 text-center mt-1">
          "Ya Allah, sampaikanlah kami ke Masjidil Haram"
        </p>
      </div>
    </div>
  );
};

export default QiblaDirection;