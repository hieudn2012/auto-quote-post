import { useState, useEffect } from 'react';
import { getActiveProfiles, closeProfile, closeAllProfiles } from '../../electron/manageProfiles';

export const ProfileManager = () => {
  const [profiles, setProfiles] = useState<string[]>([]);

  // Cập nhật danh sách profiles mỗi 5 giây
  useEffect(() => {
    const updateProfiles = () => {
      setProfiles(getActiveProfiles());
    };

    updateProfiles();
    const interval = setInterval(updateProfiles, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleCloseProfile = async (profileId: string) => {
    const success = await closeProfile(profileId);
    if (success) {
      setProfiles(prev => prev.filter(id => id !== profileId));
    }
  };

  const handleCloseAll = async () => {
    await closeAllProfiles();
    setProfiles([]);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Quản lý Profiles</h2>
      
      {/* Danh sách profiles */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Profiles đang chạy ({profiles.length})</h3>
        <div className="space-y-2">
          {profiles.map(profileId => (
            <div key={profileId} className="flex items-center justify-between bg-gray-100 p-2 rounded">
              <span className="font-mono">{profileId}</span>
              <button
                onClick={() => handleCloseProfile(profileId)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Đóng
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Nút đóng tất cả */}
      {profiles.length > 0 && (
        <button
          onClick={handleCloseAll}
          className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Đóng Tất Cả Profiles
        </button>
      )}
    </div>
  );
}; 