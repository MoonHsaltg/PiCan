export type Profile = {
  id: string;
  display_name: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Artwork = {
  id: string;
  user_id: string;
  title: string;
  image_url: string;
  thumbnail_url: string | null;
  image_width: number;
  image_height: number;
  created_at: string;
  updated_at: string;
};

export type Canvas = {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

export type CanvasItem = {
  id: string;
  canvas_id: string;
  artwork_id: string;
  x_position: number;
  y_position: number;
  item_width: number;
  item_height: number;
  rotation: number;
  z_index: number;
  created_at: string;
  updated_at: string;
};

