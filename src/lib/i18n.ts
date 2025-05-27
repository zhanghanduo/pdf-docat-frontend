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
  customKeysActive: string;
  
  // File Upload
  uploadPdf: string;
  dropFileHere: string;
  dropFileHereActive: string;
  clickToSelect: string;
  onlyPdfSupported: string;
  removeFile: string;
  
  // Language Selection
  sourceLanguage: string;
  targetLanguage: string;
  autoDetect: string;
  
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
  
  // Advanced Options
  quickPresets: string;
  resetToDefaults: string;
  translationSettings: string;
  translationEngine: string;
  advancedTranslation: string;
  advancedPdfOptions: string;
  customPrompt: string;
  customSystemPrompt: string;
  requestsPerSecond: string;
  minTextLength: string;
  ignoreCache: string;
  rpcDocumentLayout: string;
  pageSelection: string;
  pageSelectionPlaceholder: string;
  proFeature: string;
  unavailable: string;
  
  // PDF Options
  noMono: string;
  noDual: string;
  dualTranslateFirst: string;
  alternatingPages: string;
  skipClean: string;
  disableRichText: string;
  enhanceCompatibility: string;
  splitShortLines: string;
  translateTables: string;
  skipScanDetection: string;
  ocrWorkaround: string;
  shortLineSplitFactor: string;
  maxPagesPerPart: string;
  formulaFontPattern: string;
  formulaCharPattern: string;
  
  // API Keys Management
  apiKeysManagement: string;
  manageApiKeys: string;
  addApiKeys: string;
  manageKeysDescription: string;
  usingCustomKeysDescription: string;
  keysConfigured: string;
  
  // Actions
  history: string;
  admin: string;
  startTranslation: string;
  startingTranslation: string;
  translatePdf: string;
  translating: string;
  downloadTranslatedPdf: string;
  preparingDownload: string;
  preview: string;
  download: string;
  preparing: string;
  startNewTranslation: string;
  
  // Status
  statusAndPreview: string;
  processingStatus: string;
  processingStatusWillAppear: string;
  initializingProcessing: string;
  elapsedTime: string;
  overallProgress: string;
  pageProgress: string;
  stageProgress: string;
  started: string;
  completed: string;
  errorDetails: string;
  processingCompletedSuccessfully: string;
  totalTime: string;
  processingFailed: string;
  
  // Configuration
  configurationWarnings: string;
  
  // Messages
  translationSuccess: string;
  translationSuccessDescription: string;
  viewInTranslationHistory: string;
  translationFailed: string;
  downloadFailed: string;
  
  // Preview
  pdfPreview: string;
  originalDocument: string;
  translatedDocument: string;
  loadingPreview: string;
  previewLoadFailed: string;
  noPreviewAvailable: string;
  
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
    serviceAvailable: '服务可用',
    serviceUnavailable: '服务不可用',
    checkingStatus: '检查服务状态中...',
    serviceUnavailableMessage: 'PDF 翻译服务当前不可用，请稍后重试。',
    customKeysActive: '自定义密钥已激活',
    
    // File Upload
    uploadPdf: '上传 PDF',
    dropFileHere: '拖拽 PDF 文件到此处或点击选择',
    dropFileHereActive: '将 PDF 文件拖放到此处',
    clickToSelect: '点击选择文件',
    onlyPdfSupported: '仅支持 PDF 文件',
    removeFile: '移除文件',
    
    // Language Selection
    sourceLanguage: '源语言',
    targetLanguage: '目标语言',
    autoDetect: '自动检测',
    
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
    
    // Advanced Options
    quickPresets: '快速预设',
    resetToDefaults: '重置为默认',
    translationSettings: '翻译设置',
    translationEngine: '翻译引擎',
    advancedTranslation: '高级翻译',
    advancedPdfOptions: '高级 PDF 选项',
    customPrompt: '自定义提示',
    customSystemPrompt: '自定义系统提示',
    requestsPerSecond: '每秒请求数',
    minTextLength: '最小文本长度',
    ignoreCache: '忽略缓存',
    rpcDocumentLayout: 'RPC 文档布局',
    pageSelection: '页面选择',
    pageSelectionPlaceholder: '例如：1-5, 8, 10-end',
    proFeature: '专业版功能',
    unavailable: '不可用',
    
    // PDF Options
    noMono: '禁用单语',
    noDual: '禁用双语',
    dualTranslateFirst: '双语优先翻译',
    alternatingPages: '交替页面',
    skipClean: '跳过清理',
    disableRichText: '禁用富文本',
    enhanceCompatibility: '增强兼容性',
    splitShortLines: '分割短行',
    translateTables: '翻译表格',
    skipScanDetection: '跳过扫描检测',
    ocrWorkaround: 'OCR 解决方案',
    shortLineSplitFactor: '短行分割因子',
    maxPagesPerPart: '每部分最大页数',
    formulaFontPattern: '公式字体模式',
    formulaCharPattern: '公式字符模式',
    
    // API Keys Management
    apiKeysManagement: 'API 密钥管理',
    manageApiKeys: '管理密钥',
    addApiKeys: '添加密钥',
    manageKeysDescription: '管理您的自定义 API 密钥（支持 Gemini 和 OpenRouter）',
    usingCustomKeysDescription: '正在使用您的自定义 API 密钥',
    keysConfigured: '个密钥已配置',
    
    // Actions
    history: '历史记录',
    admin: '管理员',
    startTranslation: '开始翻译',
    startingTranslation: '正在启动翻译...',
    translatePdf: '翻译 PDF',
    translating: '翻译中...',
    downloadTranslatedPdf: '下载翻译后的 PDF',
    preparingDownload: '准备下载中...',
    preview: '预览',
    download: '下载',
    preparing: '准备中...',
    startNewTranslation: '开始新翻译',
    
    // Status
    statusAndPreview: '状态与预览',
    processingStatus: '处理状态',
    processingStatusWillAppear: '处理状态将在此显示',
    initializingProcessing: '正在初始化处理...',
    elapsedTime: '已用时间',
    overallProgress: '总体进度',
    pageProgress: '页面进度',
    stageProgress: '阶段进度',
    started: '开始时间',
    completed: '完成时间',
    errorDetails: '错误详情',
    processingCompletedSuccessfully: '处理成功完成！',
    totalTime: '总用时',
    processingFailed: '处理失败',
    
    // Configuration
    configurationWarnings: '配置警告',
    
    // Messages
    translationSuccess: '翻译成功完成！',
    translationSuccessDescription: '您现在可以下载翻译后的 PDF。',
    viewInTranslationHistory: '在翻译历史中查看',
    translationFailed: '翻译失败',
    downloadFailed: '下载失败',
    
    // Preview
    pdfPreview: 'PDF 预览',
    originalDocument: '原始文档',
    translatedDocument: '翻译文档',
    loadingPreview: '正在加载预览...',
    previewLoadFailed: '预览加载失败',
    noPreviewAvailable: '无可用预览',
    
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
    serviceAvailable: 'Service Available',
    serviceUnavailable: 'Service Unavailable',
    checkingStatus: 'Checking service status...',
    serviceUnavailableMessage: 'PDF translation service is currently unavailable. Please try again later.',
    customKeysActive: 'Custom Keys Active',
    
    // File Upload
    uploadPdf: 'Upload PDF',
    dropFileHere: 'Drag & drop PDF or click to select',
    dropFileHereActive: 'Drop PDF here...',
    clickToSelect: 'Click to select',
    onlyPdfSupported: 'Only PDF files are supported',
    removeFile: 'Remove',
    
    // Language Selection
    sourceLanguage: 'Source Language',
    targetLanguage: 'Target Language',
    autoDetect: 'Auto Detect',
    
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
    
    // Advanced Options
    quickPresets: 'Quick Presets',
    resetToDefaults: 'Reset to Defaults',
    translationSettings: 'Translation Settings',
    translationEngine: 'Translation Engine',
    advancedTranslation: 'Advanced Translation',
    advancedPdfOptions: 'Advanced PDF Options',
    customPrompt: 'Custom Prompt',
    customSystemPrompt: 'Custom System Prompt',
    requestsPerSecond: 'Requests/Second',
    minTextLength: 'Min Text Length',
    ignoreCache: 'Ignore Cache',
    rpcDocumentLayout: 'RPC Document Layout',
    pageSelection: 'Page Selection',
    pageSelectionPlaceholder: 'e.g., 1-5, 8, 10-end',
    proFeature: 'Pro Feature',
    unavailable: 'Unavailable',
    
    // PDF Options
    noMono: 'No Mono',
    noDual: 'No Dual',
    dualTranslateFirst: 'Dual Translate First',
    alternatingPages: 'Alternating Pages',
    skipClean: 'Skip Clean',
    disableRichText: 'Disable Rich Text',
    enhanceCompatibility: 'Enhance Compatibility',
    splitShortLines: 'Split Short Lines',
    translateTables: 'Translate Tables',
    skipScanDetection: 'Skip Scan Detection',
    ocrWorkaround: 'OCR Workaround',
    shortLineSplitFactor: 'Short Line Split Factor',
    maxPagesPerPart: 'Max Pages Per Part',
    formulaFontPattern: 'Formula Font Pattern',
    formulaCharPattern: 'Formula Character Pattern',
    
    // API Keys Management
    apiKeysManagement: 'API Keys Management',
    manageApiKeys: 'API Keys',
    addApiKeys: 'Add Keys',
    manageKeysDescription: 'Manage your custom API keys for AI services like Gemini and OpenRouter',
    usingCustomKeysDescription: 'Using your custom API keys',
    keysConfigured: 'keys configured',
    
    // Actions
    history: 'History',
    admin: 'Admin',
    startTranslation: 'Start Translation',
    startingTranslation: 'Starting Translation...',
    translatePdf: 'Translate PDF',
    translating: 'Translating...',
    downloadTranslatedPdf: 'Download Translated PDF',
    preparingDownload: 'Preparing Download...',
    preview: 'Preview',
    download: 'Download',
    preparing: 'Preparing...',
    startNewTranslation: 'Start New Translation',
    
    // Status
    statusAndPreview: 'Status & Preview',
    processingStatus: 'Processing Status',
    processingStatusWillAppear: 'Processing status will appear here',
    initializingProcessing: 'Initializing processing...',
    elapsedTime: 'Elapsed Time',
    overallProgress: 'Overall Progress',
    pageProgress: 'Page Progress',
    stageProgress: 'Stage Progress',
    started: 'Started',
    completed: 'Completed',
    errorDetails: 'Error Details',
    processingCompletedSuccessfully: 'Processing completed successfully!',
    totalTime: 'Total time',
    processingFailed: 'Processing Failed',
    
    // Configuration
    configurationWarnings: 'Configuration Warnings',
    
    // Messages
    translationSuccess: 'Translation completed successfully!',
    translationSuccessDescription: 'You can now download the translated PDF.',
    viewInTranslationHistory: 'View in Translation History',
    translationFailed: 'Translation failed',
    downloadFailed: 'Download failed',
    
    // Preview
    pdfPreview: 'PDF Preview',
    originalDocument: 'Original Document',
    translatedDocument: 'Translated Document',
    loadingPreview: 'Loading preview...',
    previewLoadFailed: 'Preview load failed',
    noPreviewAvailable: 'No preview available',
    
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