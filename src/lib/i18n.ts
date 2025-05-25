export type Language = 'zh' | 'en';

export interface Translations {
  // Header
  title: string;
  subtitle: string;
  
  // Service Status
  serviceStatus: string;
  serviceAvailable: string;
  serviceUnavailable: string;
  checkingStatus: string;
  serviceUnavailableMessage: string;
  
  // File Upload
  dropFileHere: string;
  dropFileHereActive: string;
  clickToSelect: string;
  onlyPdfSupported: string;
  removeFile: string;
  
  // Language Selection
  sourceLanguage: string;
  targetLanguage: string;
  
  // Dual Mode
  dualLanguageMode: string;
  showBothLanguages: string;
  targetLanguageOnly: string;
  
  // Advanced Settings
  advancedSettings: string;
  geminiApiKey: string;
  geminiModel: string;
  geminiApiKeyPlaceholder: string;
  useCustomGemini: string;
  
  // Actions
  translatePdf: string;
  translating: string;
  downloadTranslatedPdf: string;
  preparingDownload: string;
  
  // Messages
  translationSuccess: string;
  translationFailed: string;
  downloadFailed: string;
  
  // Language Toggle
  language: string;
  chinese: string;
  english: string;
}

const translations: Record<Language, Translations> = {
  zh: {
    // Header
    title: 'PDF 翻译器',
    subtitle: '翻译 PDF 文档，同时保留格式和数学表达式',
    
    // Service Status
    serviceStatus: '服务状态',
    serviceAvailable: '可用',
    serviceUnavailable: '不可用',
    checkingStatus: '检查服务状态中...',
    serviceUnavailableMessage: 'PDF 翻译服务当前不可用，请稍后重试。',
    
    // File Upload
    dropFileHere: '拖拽 PDF 文件到此处或点击选择',
    dropFileHereActive: '将 PDF 文件拖放到此处',
    clickToSelect: '点击选择文件',
    onlyPdfSupported: '仅支持 PDF 文件',
    removeFile: '移除文件',
    
    // Language Selection
    sourceLanguage: '源语言',
    targetLanguage: '目标语言',
    
    // Dual Mode
    dualLanguageMode: '双语模式',
    showBothLanguages: '显示双语',
    targetLanguageOnly: '仅目标语言',
    
    // Advanced Settings
    advancedSettings: '高级设置',
    geminiApiKey: 'Gemini API 密钥',
    geminiModel: 'Gemini 模型',
    geminiApiKeyPlaceholder: '输入您的 Gemini API 密钥',
    useCustomGemini: '使用自定义 Gemini 设置',
    
    // Actions
    translatePdf: '翻译 PDF',
    translating: '翻译中...',
    downloadTranslatedPdf: '下载翻译后的 PDF',
    preparingDownload: '准备下载中...',
    
    // Messages
    translationSuccess: '翻译成功完成！您现在可以下载翻译后的 PDF。',
    translationFailed: '翻译失败',
    downloadFailed: '下载失败',
    
    // Language Toggle
    language: '语言',
    chinese: '中文',
    english: 'English',
  },
  en: {
    // Header
    title: 'PDF Translator',
    subtitle: 'Translate PDF documents while preserving formatting and mathematical expressions',
    
    // Service Status
    serviceStatus: 'Service Status',
    serviceAvailable: 'Available',
    serviceUnavailable: 'Unavailable',
    checkingStatus: 'Checking service status...',
    serviceUnavailableMessage: 'PDF translation service is currently unavailable. Please try again later.',
    
    // File Upload
    dropFileHere: 'Drop a PDF file here or click to select',
    dropFileHereActive: 'Drop the PDF file here',
    clickToSelect: 'Click to select',
    onlyPdfSupported: 'Only PDF files are supported',
    removeFile: 'Remove File',
    
    // Language Selection
    sourceLanguage: 'Source Language',
    targetLanguage: 'Target Language',
    
    // Dual Mode
    dualLanguageMode: 'Dual Language Mode',
    showBothLanguages: 'Show both languages',
    targetLanguageOnly: 'Target language only',
    
    // Advanced Settings
    advancedSettings: 'Advanced Settings',
    geminiApiKey: 'Gemini API Key',
    geminiModel: 'Gemini Model',
    geminiApiKeyPlaceholder: 'Enter your Gemini API key',
    useCustomGemini: 'Use custom Gemini settings',
    
    // Actions
    translatePdf: 'Translate PDF',
    translating: 'Translating...',
    downloadTranslatedPdf: 'Download Translated PDF',
    preparingDownload: 'Preparing Download...',
    
    // Messages
    translationSuccess: 'Translation completed successfully! You can now download the translated PDF.',
    translationFailed: 'Translation failed',
    downloadFailed: 'Download failed',
    
    // Language Toggle
    language: 'Language',
    chinese: '中文',
    english: 'English',
  },
};

export const useTranslation = (language: Language) => {
  return translations[language];
};

export const getAvailableLanguages = (): Array<{ code: Language; name: string }> => [
  { code: 'zh', name: '中文' },
  { code: 'en', name: 'English' },
]; 