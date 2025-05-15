export interface Poem {
  id: number;
  title: string;
  content: string;
  image: string | null;
  date: string;
}

export interface PoemListProps {
  poems: Poem[];
  handleDelete: (id: number) => void;
  handleReorder: (newOrder: Poem[]) => void;
}

export interface PoemViewerProps {
  poems: Poem[];
}

export interface NewPoemProps {
  addPoem: (poem: Poem) => void;
  poems: Poem[];
  updatePoem: (poem: Poem) => void;
}

export interface ImageCaptureProps {
  onImageCapture: (imageData: string | null) => void;
  initialImage?: string | null;
}

export interface FormData {
  title: string;
  content: string;
  image: string | null;
}

export interface StorageManager {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
}

export const LOCAL_STORAGE_KEYS = {
  POEMS: 'poems',
  POEM_DRAFT: 'poemDraft'
} as const;