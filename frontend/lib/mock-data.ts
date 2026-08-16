export type CommunityArtwork = {
  id: string;
  title: string;
  artist: string;
  username: string;
  initials: string;
  image: string;
  medium: string;
  postedAt: string;
  day: "Hôm nay" | "Hôm qua" | "10 tháng 8";
  reactions: number;
  comments: number;
  note?: string;
  aspect: "square" | "portrait" | "landscape";
};

export const communityArtworks: CommunityArtwork[] = [
  {
    id: "sunlit-studio",
    title: "Một góc để bắt đầu",
    artist: "Hà My",
    username: "hamy.draws",
    initials: "HM",
    image: "/art/sunlit-studio.png",
    medium: "Màu nước & chì màu",
    postedAt: "8 phút trước",
    day: "Hôm nay",
    reactions: 126,
    comments: 18,
    note: "Nắng sáng nay làm mọi thứ trông như một trang sketchbook.",
    aspect: "square",
  },
  {
    id: "sketchbook-notes",
    title: "Nghiên cứu bàn tay",
    artist: "Minh An",
    username: "minhan.studio",
    initials: "MA",
    image: "/art/sketchbook-notes.png",
    medium: "Graphite & marker",
    postedAt: "34 phút trước",
    day: "Hôm nay",
    reactions: 89,
    comments: 11,
    note: "Một trang còn dang dở, mình sẽ quay lại vào tối nay.",
    aspect: "portrait",
  },
  {
    id: "color-study",
    title: "Nhịp màu số 04",
    artist: "Gia Linh",
    username: "linh.layers",
    initials: "GL",
    image: "/art/color-study.png",
    medium: "Mixed media",
    postedAt: "1 giờ trước",
    day: "Hôm nay",
    reactions: 204,
    comments: 27,
    note: "Thử để màu tự nói trước khi mình đặt tên cho nó.",
    aspect: "landscape",
  },
  {
    id: "blue-hour-window",
    title: "Cửa sổ lúc 18:42",
    artist: "Thu Phương",
    username: "phuongafterrain",
    initials: "TP",
    image: "/art/blue-hour-window.png",
    medium: "Gouache & ink",
    postedAt: "Hôm qua, 18:42",
    day: "Hôm qua",
    reactions: 318,
    comments: 42,
    note: "Có những buổi tối căn phòng nhỏ lại thành cả một thế giới.",
    aspect: "portrait",
  },
  {
    id: "color-study-02",
    title: "Thử nghiệm khoảng trống",
    artist: "Bảo Ngọc",
    username: "ngoc.makes",
    initials: "BN",
    image: "/art/color-study.png",
    medium: "Collage & acrylic",
    postedAt: "Hôm qua, 15:06",
    day: "Hôm qua",
    reactions: 146,
    comments: 19,
    aspect: "landscape",
  },
  {
    id: "studio-study",
    title: "Chậm một nhịp",
    artist: "Khánh Vy",
    username: "vy.watercolors",
    initials: "KV",
    image: "/art/sunlit-studio.png",
    medium: "Màu nước",
    postedAt: "10 tháng 8, 09:12",
    day: "10 tháng 8",
    reactions: 231,
    comments: 36,
    aspect: "square",
  },
];

export const suggestedArtists = [
  { name: "Minh An", username: "minhan.studio", initials: "MA", medium: "Ký họa" },
  { name: "Gia Linh", username: "linh.layers", initials: "GL", medium: "Mixed media" },
  { name: "Thu Phương", username: "phuongafterrain", initials: "TP", medium: "Gouache" },
];
