//chuyển đổi timestamp
export const formatRelativeTime = (unixTimestamp) => {
  try {
    const now = new Date();
    const date = new Date(unixTimestamp * 1000);
    const diff = now - date;
    // Tính số ngày, giờ, phút, giây
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      if (days === 1) return '1 ngày trước';
      return `${days} ngày trước`;
    } else if (hours > 0) {
      if (hours === 1) return '1 giờ trước';
      return `${hours} giờ trước`;
    }
  } catch (error) {
    console.error('error', error);
    throw error;
  }
};

//chuyển đổi timestamp
export const formatDateRelativeTime = (timestamp) => {
  const date = new Date(timestamp); // Tạo một đối tượng Date từ timestamp

  // Lấy các thành phần ngày, tháng, năm
  const day = date.getDate();
  const month = date.getMonth() + 1; // Tháng được tính từ 0-11, nên cần cộng thêm 1
  const year = date.getFullYear();

  // Đảm bảo ngày và tháng có hai chữ số (vd: 01, 02,...,09)
  const formattedDay = day < 10 ? `0${day}` : day;
  const formattedMonth = month < 10 ? `0${month}` : month;

  // Trả về chuỗi định dạng dd/mm/yyyy
  return `${formattedDay}/${formattedMonth}/${year}`;
};

// Hàm xáo trộn dữ liệu
export const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// format datetime
export const formatDate = () => {
  const date = new Date();
  const formattedDate = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
  return formattedDate;
};

// format seconds
export const convertSecondsToTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return `${hours} giờ ${minutes} phút`;
};
// format number
export const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  } else {
    return num.toString();
  }
};
