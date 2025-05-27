import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { QueryClient, QueryClientProvider, useMutation, useQuery } from '@tanstack/react-query';
import { 
  FileText, 
  Upload, 
  Download, 
  Loader2,
  CheckCircle,
  Languages,
  Trash2,
  Key,
  Shield,
  LogOut,
  History,
  Eye,
  Play,
  RotateCcw,
  AlertTriangle,
  Activity
} from 'lucide-react';

import { 
  pdfApi, 
  AdvancedTranslateRequest, 
  ValidationResponse
} from './lib/api';
import { useTranslation, Language as UILanguage, getAvailableLanguages } from './lib/i18n';
import ApiKeysManager from './components/ApiKeysManager';
import AuthCheck from './components/AuthCheck';
import AdminDashboard from './components/AdminDashboard';
import TranslationHistory from './components/TranslationHistory';
import PdfPreview from './components/PdfPreview';
import EnhancedStatusDisplay from './components/EnhancedStatusDisplay';
import AdvancedOptionsPanel from './components/AdvancedOptionsPanel';
import InlinePdfPreview from './components/InlinePdfPreview';
import { useClientApiKeys } from './hooks/useClientApiKeys';
import { useProcessingStatus } from './hooks/useProcessingStatus';
import { getCurrentUser, isAdmin, logout } from './lib/auth';

import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger } from './components/ui/select';
import { Badge } from './components/ui/badge';

// Create a query client
const queryClient = new QueryClient();

const PDFTranslator: React.FC = () => {
  // UI State
  const [currentLanguage, setCurrentLanguage] = useState<UILanguage>('zh');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentLogId, setCurrentLogId] = useState<number | null>(null);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [processingStartTime, setProcessingStartTime] = useState<Date | null>(null);
  
  // Modal states
  const [showApiKeysManager, setShowApiKeysManager] = useState<boolean>(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState<boolean>(false);
  const [showTranslationHistory, setShowTranslationHistory] = useState<boolean>(false);
  const [showPdfPreview, setShowPdfPreview] = useState<boolean>(false);

  // Advanced options state
  const [advancedOptions, setAdvancedOptions] = useState<Partial<AdvancedTranslateRequest>>({
    source_lang: 'auto',
    target_lang: 'simplified-chinese',
    dual: false, // Default to single language mode (disabled)
    translation_engine: 'auto',
    requests_per_second: 4,
    min_text_length: 1,
    ignore_cache: false,
    short_line_split_factor: 0.5,
    max_pages_per_part: 0
  });

  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);

  const currentUser = getCurrentUser();
  const userIsAdmin = isAdmin();
  const t = useTranslation(currentLanguage);
  const availableLanguages = getAvailableLanguages();

  // API Queries
  const { data: languagesData } = useQuery({
    queryKey: ['languages'],
    queryFn: pdfApi.getSupportedLanguages,
  });

  const { data: translationEnginesData } = useQuery({
    queryKey: ['translation-engines'],
    queryFn: pdfApi.getTranslationEngines,
  });

  const { data: userLimitsData } = useQuery({
    queryKey: ['user-limits'],
    queryFn: pdfApi.getUserLimits,
    enabled: !!currentUser,
  });

  const { data: defaultSettingsData } = useQuery({
    queryKey: ['default-settings'],
    queryFn: pdfApi.getDefaultSettings,
    enabled: !!currentUser,
  });

  const { data: presetConfigurationsData } = useQuery({
    queryKey: ['preset-configurations'],
    queryFn: pdfApi.getPresetConfigurations,
    enabled: !!currentUser,
  });

  const { isLoading: healthLoading } = useQuery({
    queryKey: ['health'],
    queryFn: pdfApi.healthCheck,
    refetchInterval: 30000,
  });

  // Client API Keys
  const { apiKeys: clientApiKeys } = useClientApiKeys();

  // Processing Status Hook
  const {
    status: processingStatus,
    isLoading: statusLoading,
    error: statusError
  } = useProcessingStatus({
    taskId: currentTaskId,
    enabled: !!currentTaskId,
    onComplete: (result: any) => {
      console.log('Processing completed:', result);
      if (result.logId) {
        setCurrentLogId(result.logId);
      }
      setCurrentTaskId(null);
      setProcessingStartTime(null);
    },
    onError: (error: any) => {
      console.error('Processing failed:', error);
      setCurrentTaskId(null);
      setProcessingStartTime(null);
    }
  });

  // Debug logging
  React.useEffect(() => {
    if (currentTaskId) {
      console.log('Current task ID:', currentTaskId);
      console.log('Processing status:', processingStatus);
      console.log('Status loading:', statusLoading);
      console.log('Status error:', statusError);
    }
  }, [currentTaskId, processingStatus, statusLoading, statusError]);

  // Validation mutation
  const validateOptionsMutation = useMutation({
    mutationFn: async (options: Partial<AdvancedTranslateRequest>) => {
      // Convert to TranslationOptions format for validation
      const translationOptions = {
        translate_enabled: true,
        source_language: options.source_lang,
        target_language: options.target_lang,
        dual_language: options.dual,
        advanced_translation: {
          translation_engine: options.translation_engine,
          custom_prompt: options.custom_prompt,
          custom_system_prompt: options.custom_system_prompt,
          requests_per_second: options.requests_per_second,
          min_text_length: options.min_text_length,
          ignore_cache: options.ignore_cache,
          rpc_doclayout: options.rpc_doclayout
        },
        advanced_pdf: {
          pages: options.pages,
          no_mono: options.no_mono,
          no_dual: !options.dual, // When dual is false, set no_dual to true
          dual_translate_first: options.dual_translate_first,
          use_alternating_pages_dual: options.use_alternating_pages_dual,
          skip_clean: options.skip_clean,
          disable_rich_text_translate: options.disable_rich_text_translate,
          enhance_compatibility: options.enhance_compatibility,
          split_short_lines: options.split_short_lines,
          short_line_split_factor: options.short_line_split_factor,
          translate_table_text: options.translate_table_text,
          skip_scanned_detection: options.skip_scanned_detection,
          ocr_workaround: options.ocr_workaround,
          max_pages_per_part: options.max_pages_per_part,
          formular_font_pattern: options.formular_font_pattern,
          formular_char_pattern: options.formular_char_pattern
        }
      };
      return await pdfApi.validateTranslationOptions(translationOptions);
    },
    onSuccess: (data: ValidationResponse) => {
      setValidationWarnings(data.warnings || []);
    }
  });

  // Translation mutation
  const translateMutation = useMutation({
    mutationFn: async (request: AdvancedTranslateRequest) => {
      setProcessingStartTime(new Date());
      const result = await pdfApi.translatePdfAdvanced(request);
      if (result.task_id) {
        setCurrentTaskId(result.task_id);
      } else if (result.logId) {
        // Direct completion without async processing
        setCurrentLogId(result.logId);
        setProcessingStartTime(null);
      }
      return result;
    },
    onSuccess: (result) => {
      // Translation completed successfully
      if (result.logId) {
        setCurrentLogId(result.logId);
        setProcessingStartTime(null);
      }
    },
    onError: () => {
      setProcessingStartTime(null);
    },
  });

  const downloadMutation = useMutation({
    mutationFn: async (logId: number) => {
      const blob = await pdfApi.downloadTranslatedPdf(logId);
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `translated_${selectedFile?.name || 'document'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
  });

  // Load default settings on mount
  useEffect(() => {
    if (defaultSettingsData?.default_settings) {
      setAdvancedOptions(prev => ({
        ...prev,
        ...defaultSettingsData.default_settings
      }));
    }
  }, [defaultSettingsData]);

  // Validate options when they change
  useEffect(() => {
    if (selectedFile && Object.keys(advancedOptions).length > 0) {
      validateOptionsMutation.mutate(advancedOptions);
    }
  }, [advancedOptions, selectedFile]);

  // Event Handlers
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
      // Reset previous results
      setCurrentLogId(null);
      setCurrentTaskId(null);
      setProcessingStartTime(null);
      translateMutation.reset();
      downloadMutation.reset();
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
  });

  const handleTranslate = () => {
    if (!selectedFile || !advancedOptions.target_lang) return;

    const request: AdvancedTranslateRequest = {
      file: selectedFile,
      target_lang: advancedOptions.target_lang,
      ...advancedOptions,
      // Ensure no_dual is set correctly based on dual setting
      no_dual: !advancedOptions.dual
    };

    translateMutation.mutate(request);
  };

  const handleDownload = () => {
    if (!currentLogId) return;
    downloadMutation.mutate(currentLogId);
  };

  const handleReset = () => {
    setCurrentLogId(null);
    setCurrentTaskId(null);
    setSelectedFile(null);
    setProcessingStartTime(null);
    setValidationWarnings([]);
    translateMutation.reset();
    downloadMutation.reset();
  };

  const handleOptionsChange = (newOptions: Partial<AdvancedTranslateRequest>) => {
    setAdvancedOptions(newOptions);
  };

  const handleLoadPreset = async (presetId: string) => {
    if (!presetConfigurationsData?.presets[presetId]) return;
    
    const presetSettings = presetConfigurationsData.presets[presetId].settings;
    setAdvancedOptions(prev => ({
      ...prev,
      ...presetSettings
    }));
  };

  const handleResetOptions = () => {
    if (defaultSettingsData?.default_settings) {
      setAdvancedOptions(defaultSettingsData.default_settings);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  // Service availability
  const isServiceAvailable = true; // Force service as available

  // Data processing
  const languages = languagesData?.languages || [];
  const translationEngines = translationEnginesData?.engines || [];
  const availablePresets = presetConfigurationsData ? 
    Object.entries(presetConfigurationsData.presets).map(([id, preset]) => ({
      id,
      name: preset.name,
      description: preset.description
    })) : [];

  // Modal handlers
  if (showAdminDashboard && userIsAdmin) {
    return (
      <AdminDashboard 
        currentUser={currentUser}
        onLogout={handleLogout}
        onBackToApp={() => setShowAdminDashboard(false)}
      />
    );
  }

  if (showApiKeysManager) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <ApiKeysManager onClose={() => setShowApiKeysManager(false)} />
        </div>
      </div>
    );
  }

  if (showTranslationHistory) {
    return (
      <TranslationHistory 
        currentLanguage={currentLanguage}
        onClose={() => setShowTranslationHistory(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">{t.title}</h1>
                <p className="text-sm text-muted-foreground">{t.subtitle}</p>
              </div>
            </div>
            
            {/* Header Actions */}
            <div className="flex items-center space-x-2">
              {/* User Info */}
              {currentUser && (
                <div className="text-right mr-4">
                  <p className="text-sm font-medium">{currentUser.name || currentUser.email}</p>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {currentUser.tier}
                    </Badge>
                    {userIsAdmin && (
                      <Badge variant="destructive" className="text-xs">
                        Admin
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTranslationHistory(true)}
              >
                <History className="h-4 w-4 mr-2" />
                {t.history}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowApiKeysManager(true)}
              >
                <Key className="h-4 w-4 mr-2" />
                {t.manageApiKeys}
              </Button>

              {userIsAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAdminDashboard(true)}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  {t.admin}
                </Button>
              )}
              
              {/* Language Toggle */}
              <Select value={currentLanguage} onValueChange={(value: UILanguage) => setCurrentLanguage(value)}>
                <SelectTrigger className="w-24">
                  <Languages className="h-4 w-4" />
                </SelectTrigger>
                <SelectContent>
                  {availableLanguages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Dual Column Layout */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-140px)]">
          
          {/* Left Column - Controls & Upload */}
          <div className="space-y-4 overflow-y-auto">
            {/* Service Status */}
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-center space-x-3">
                  {healthLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{t.checkingStatus}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">{t.serviceAvailable}</span>
                      {clientApiKeys.hasCustomKeys && (
                        <>
                          <span className="text-muted-foreground">•</span>
                          <Key className="h-4 w-4 text-blue-500" />
                          <span className="text-sm text-blue-600">{t.customKeysActive}</span>
                        </>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* File Upload */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-base">
                  <Upload className="h-4 w-4" />
                  <span>{t.uploadPdf}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  {...getRootProps()}
                  className={`
                    border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200
                    ${isDragActive 
                      ? 'border-primary bg-primary/5 scale-105' 
                      : 'border-border hover:border-primary/50 hover:bg-accent/50'
                    }
                    ${!isServiceAvailable ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <input {...getInputProps()} disabled={!isServiceAvailable} />
                  {selectedFile ? (
                    <div className="space-y-3">
                      <FileText className="h-8 w-8 text-primary mx-auto" />
                      <div>
                        <p className="font-medium text-foreground">{selectedFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {t.removeFile}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Upload className="h-8 w-8 text-muted-foreground mx-auto" />
                      <div>
                        <p className="text-foreground">
                          {isDragActive ? t.dropFileHereActive : t.dropFileHere}
                        </p>
                        <p className="text-sm text-muted-foreground">{t.onlyPdfSupported}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Validation Warnings */}
            {validationWarnings.length > 0 && (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="pt-4">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">{t.configurationWarnings}</p>
                      <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                        {validationWarnings.map((warning, index) => (
                          <li key={index}>• {warning}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Advanced Options Panel */}
            <AdvancedOptionsPanel
              options={advancedOptions}
              onOptionsChange={handleOptionsChange}
              translationEngines={translationEngines}
              languages={languages}
              userLimits={userLimitsData}
              onReset={handleResetOptions}
              onLoadPreset={handleLoadPreset}
              availablePresets={availablePresets}
              currentLanguage={currentLanguage}
            />

            {/* Action Buttons */}
            <div className="space-y-3">
              {!translateMutation.isSuccess && !currentTaskId && (
                <Button
                  onClick={handleTranslate}
                  disabled={!selectedFile || !isServiceAvailable || translateMutation.isPending}
                  className="w-full"
                  size="lg"
                >
                  {translateMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {t.startingTranslation}
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      {t.startTranslation}
                    </>
                  )}
                </Button>
              )}

              {(translateMutation.isSuccess || currentLogId) && (
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => setShowPdfPreview(true)}
                    disabled={!currentLogId}
                    variant="outline"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {t.preview}
                  </Button>
                  
                  <Button
                    onClick={handleDownload}
                    disabled={downloadMutation.isPending || !currentLogId}
                  >
                    {downloadMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {t.preparing}
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        {t.download}
                      </>
                    )}
                  </Button>
                </div>
              )}

              {(translateMutation.isSuccess || translateMutation.isError) && (
                <Button
                  variant="ghost"
                  onClick={handleReset}
                  className="w-full"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  {t.startNewTranslation}
                </Button>
              )}
            </div>
          </div>

          {/* Right Column - Status & Preview */}
          <div className="flex flex-col h-full space-y-4">
            {/* Status Section - Compact */}
            <Card className="flex-shrink-0">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-4 w-4" />
                    <span>{t.processingStatus}</span>
                  </div>
                  {currentTaskId && (
                    <div className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${processingStatus ? 'bg-green-500' : 'bg-yellow-500'}`} />
                      <span className="text-xs text-muted-foreground">
                        {processingStatus ? (currentLanguage === 'zh' ? '处理中' : 'Processing') : (currentLanguage === 'zh' ? '等待中' : 'Waiting')}
                      </span>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <EnhancedStatusDisplay
                  status={processingStatus || null}
                  isLoading={statusLoading || translateMutation.isPending}
                  error={statusError || translateMutation.error}
                  fileName={selectedFile?.name}
                  fileSize={selectedFile?.size}
                  startTime={processingStartTime || undefined}
                  currentLanguage={currentLanguage}
                  showSuccessActions={translateMutation.isSuccess && !!currentLogId}
                  onViewHistory={() => setShowTranslationHistory(true)}
                  isProcessing={translateMutation.isPending}
                  isSuccess={translateMutation.isSuccess && !!currentLogId}
                />
              </CardContent>
            </Card>

            {/* PDF Preview Section - Takes remaining space */}
            <div className="flex-1 min-h-0 overflow-hidden">
              <InlinePdfPreview
                file={selectedFile || undefined}
                logId={currentLogId || undefined}
                currentLanguage={currentLanguage}
                showTranslated={!!currentLogId && translateMutation.isSuccess}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* PDF Preview Modal */}
      {showPdfPreview && currentLogId && selectedFile && (
        <PdfPreview
          logId={currentLogId}
          fileName={selectedFile.name}
          onClose={() => setShowPdfPreview(false)}
          onDownload={handleDownload}
          downloadPending={downloadMutation.isPending}
        />
      )}
    </div>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthCheck>
        <PDFTranslator />
      </AuthCheck>
    </QueryClientProvider>
  );
}

export default App; 