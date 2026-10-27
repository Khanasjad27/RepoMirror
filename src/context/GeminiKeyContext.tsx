import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStoredGeminiKey, saveStoredGeminiKey, testGeminiApiKey } from '@/services/gemini';
import { toast } from 'sonner';

interface GeminiKeyContextType {
  apiKey: string;
  hasKey: boolean;
  isEnvKey: boolean;
  isKeyModalOpen: boolean;
  isTesting: boolean;
  saveKey: (key: string) => Promise<boolean>;
  removeKey: () => void;
  openKeyModal: () => void;
  closeKeyModal: () => void;
  testKey: (key: string) => Promise<boolean>;
}

const GeminiKeyContext = createContext<GeminiKeyContextType | undefined>(undefined);

export const GeminiKeyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Synchronously initialize with env or stored key to prevent delayed state flickers
  const [apiKey, setApiKey] = useState<string>(() => getStoredGeminiKey());
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    const key = getStoredGeminiKey();
    if (key !== apiKey) {
      setApiKey(key);
    }
  }, []);

  const saveKey = async (newKey: string): Promise<boolean> => {
    const trimmed = newKey.trim();
    if (!trimmed) {
      removeKey();
      return true;
    }

    setIsTesting(true);
    const isValid = await testGeminiApiKey(trimmed);
    setIsTesting(false);

    if (isValid) {
      saveStoredGeminiKey(trimmed);
      setApiKey(trimmed);
      toast.success('Gemini API Key validated & saved successfully!');
      setIsKeyModalOpen(false);
      return true;
    } else {
      // Even if direct test had an issue (network/quota), still allow saving if user confirms
      saveStoredGeminiKey(trimmed);
      setApiKey(trimmed);
      toast.warning('Key saved! (Could not verify with Google servers, but it will be used for analyses).');
      setIsKeyModalOpen(false);
      return true;
    }
  };

  const removeKey = () => {
    saveStoredGeminiKey('');
    const envKey = ((import.meta.env.VITE_GEMINI_API_KEY as string) || '').trim();
    setApiKey(envKey);
    if (envKey) {
      toast.info('Custom key removed. Using default deployment Gemini key.');
    } else {
      toast.info('Gemini API Key removed. RepoMirror will prompt before analysis.');
    }
  };

  const testKey = async (keyToTest: string): Promise<boolean> => {
    setIsTesting(true);
    const valid = await testGeminiApiKey(keyToTest.trim());
    setIsTesting(false);
    return valid;
  };

  const isEnvKey = Boolean(
    apiKey &&
    apiKey === ((import.meta.env.VITE_GEMINI_API_KEY as string) || '').trim() &&
    !localStorage.getItem('repomirror_gemini_api_key')
  );

  return (
    <GeminiKeyContext.Provider
      value={{
        apiKey,
        hasKey: !!apiKey,
        isEnvKey,
        isKeyModalOpen,
        isTesting,
        saveKey,
        removeKey,
        openKeyModal: () => setIsKeyModalOpen(true),
        closeKeyModal: () => setIsKeyModalOpen(false),
        testKey,
      }}
    >
      {children}
    </GeminiKeyContext.Provider>
  );
};

export const useGeminiKey = () => {
  const context = useContext(GeminiKeyContext);
  if (!context) {
    throw new Error('useGeminiKey must be used within a GeminiKeyProvider');
  }
  return context;
};
