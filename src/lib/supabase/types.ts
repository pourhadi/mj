export type Profile = {
  id: string;
  email: string;
  name: string;
  created_at: string;
};

export type Image = {
  id: string;
  user_id: string;
  prompt: string;
  url: string;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>;
      };
      images: {
        Row: Image;
        Insert: Omit<Image, 'id' | 'created_at'>;
        Update: Partial<Omit<Image, 'id' | 'user_id' | 'created_at'>>;
      };
    };
  };
};