import { useQuery } from '@tanstack/react-query';
import { clientApiKeysApi, ClientApiKeyListResponse } from '../lib/api';

export interface ApiKeyInfo {
  hasCustomKeys: boolean;
  geminiKeys: ClientApiKeyListResponse[];
  openrouterKeys: ClientApiKeyListResponse[];
  defaultGeminiKey?: ClientApiKeyListResponse;
  defaultOpenrouterKey?: ClientApiKeyListResponse;
}

export const useClientApiKeys = () => {
  const { data: apiKeys, isLoading, error } = useQuery({
    queryKey: ['clientApiKeys'],
    queryFn: () => clientApiKeysApi.getApiKeys(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const processedKeys: ApiKeyInfo = {
    hasCustomKeys: (apiKeys?.length ?? 0) > 0,
    geminiKeys: apiKeys?.filter(key => key.service_name === 'gemini') ?? [],
    openrouterKeys: apiKeys?.filter(key => key.service_name === 'openrouter') ?? [],
    defaultGeminiKey: apiKeys?.find(key => key.service_name === 'gemini' && key.is_default),
    defaultOpenrouterKey: apiKeys?.find(key => key.service_name === 'openrouter' && key.is_default),
  };

  // If no default keys are set, use the first active key
  if (!processedKeys.defaultGeminiKey && processedKeys.geminiKeys.length > 0) {
    processedKeys.defaultGeminiKey = processedKeys.geminiKeys.find(key => key.is_active) || processedKeys.geminiKeys[0];
  }

  if (!processedKeys.defaultOpenrouterKey && processedKeys.openrouterKeys.length > 0) {
    processedKeys.defaultOpenrouterKey = processedKeys.openrouterKeys.find(key => key.is_active) || processedKeys.openrouterKeys[0];
  }

  return {
    apiKeys: processedKeys,
    isLoading,
    error,
    refetch: () => {
      // This would trigger a refetch if needed
    }
  };
}; 