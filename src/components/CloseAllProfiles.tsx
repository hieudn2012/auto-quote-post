import { closeAllProfiles } from '../../electron/manageProfiles';

export const CloseAllProfiles = () => {
  const handleCloseAll = async () => {
    try {
      await closeAllProfiles();
    } catch (error) {
      console.error('Lỗi khi đóng profiles:', error);
    }
  };

  return (
    <button
      onClick={handleCloseAll}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
    >
      Đóng Tất Cả Profiles
    </button>
  );
}; 