export interface Link {
  id: number;
  label: string;
  url: string;
  icon: string;
  category?: string | null;
}

export interface Phone {
  id: number;
  phone?: string | null;
  category?: string | null;
}
export interface Email {
  id: number;
  email?: string | null;
  category?: string | null;
}
