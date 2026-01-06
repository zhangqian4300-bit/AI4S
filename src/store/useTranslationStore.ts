import { create } from 'zustand';

interface TranslationResult {
  industryExpert: string;
  aiScientist: string;
  engineer: string;
  domainScientist: string;
}

interface TranslationStore {
  inputText: string;
  result: TranslationResult | null;
  isLoading: boolean;
  error: string | null;
  
  setInputText: (text: string) => void;
  setResult: (result: TranslationResult) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useTranslationStore = create<TranslationStore>((set) => ({
  inputText: '',
  result: null,
  isLoading: false,
  error: null,

  setInputText: (text) => set({ inputText: text }),
  setResult: (result) => set({ result, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () => set({ inputText: '', result: null, isLoading: false, error: null }),
}));
