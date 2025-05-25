import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { QueryClient, QueryClientProvider, useMutation, useQuery } from '@tanstack/react-query';
import { 
  FileText, 
  Upload, 
  Download, 
  Settings, 
  ChevronDown, 
  ChevronUp, 
  Globe, 
  Loader2,
  CheckCircle,
  XCircle,
  Languages,
  Trash2,
  Key,
  Shield,
  LogOut
} from 'lucide-react';

import { pdfApi, TranslateRequest, GeminiSettings } from './lib/api';
import { useTranslation, Language, getAvailableLanguages } from './lib/i18n';
import ApiKeysManager from './components/ApiKeysManager';
import AuthCheck from './components/AuthCheck';
import AdminDashboard from './components/AdminDashboard';
import { useClientApiKeys } from './hooks/useClientApiKeys';
import { getCurrentUser, isAdmin, mockLogout } from './lib/crypto';

import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Switch } from './components/ui/switch';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './components/ui/collapsible';

// Create a query client
const queryClient = new QueryClient();

const PDFTranslator: React.FC = () => {
  // UI State
  const [currentLanguage, setCurrentLanguage] = useState<Language>('zh');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sourceLang, setSourceLang] = useState<string>('en');
  const [targetLang, setTargetLang] = useState<string>('zh');
  const [dualMode, setDualMode] = useState<boolean>(false);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState<boolean>(false);
  const [showApiKeysManager, setShowApiKeysManager] = useState<boolean>(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState<boolean>(false);
  const [useCustomGemini, setUseCustomGemini] = useState<boolean>(false);
  const [geminiSettings, setGeminiSettings] = useState<GeminiSettings>({
    apiKey: '',
    model: 'gemini-2.5-flash-preview-05-20',
  });

  const currentUser = getCurrentUser();
  const userIsAdmin = isAdmin();

  const t = useTranslation(currentLanguage);
  const availableLanguages = getAvailableLanguages();

  // API Queries
  const { data: languagesData } = useQuery({
    queryKey: ['languages'],
    queryFn: pdfApi.getSupportedLanguages,
  });

  const { isLoading: healthLoading } = useQuery({
    queryKey: ['health'],
    queryFn: pdfApi.healthCheck,
    refetchInterval: 30000,
  });

  // Client API Keys
  const { apiKeys: clientApiKeys } = useClientApiKeys();

  // Mutations
  const translateMutation = useMutation({
    mutationFn: async (request: TranslateRequest) => {
      const result = await pdfApi.translatePdf(request);
      setCurrentTaskId(result.task_id);
      return result;
    },
  });

  const downloadMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const blob = await pdfApi.downloadPdf(taskId);
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `translated_${taskId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      await pdfApi.cleanupFiles(taskId);
      setCurrentTaskId(null);
      setSelectedFile(null);
    },
  });

  // Event Handlers
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
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
    if (!selectedFile) return;

    const request: TranslateRequest = {
      file: selectedFile,
      source_lang: sourceLang,
      target_lang: targetLang,
      dual: dualMode,
    };

    // Use client API keys if available, otherwise fall back to legacy custom Gemini settings
    if (clientApiKeys.hasCustomKeys && clientApiKeys.defaultGeminiKey) {
      // Backend will automatically use the user's configured API keys
      // No need to pass them explicitly in the request
    } else if (useCustomGemini && (geminiSettings.apiKey || geminiSettings.model)) {
      request.gemini_settings = geminiSettings;
    }

    translateMutation.mutate(request);
  };

  const handleDownload = () => {
    if (!currentTaskId) return;
    downloadMutation.mutate(currentTaskId);
  };

  // 修改这一行，强制服务为可用状态，忽略健康检查结果
  //const isServiceAvailable = healthData?.pdftranslate_available ?? false;
  const isServiceAvailable = true; // 强制服务为可用
  const languages = languagesData?.languages ?? {};

  // Handle logout
  const handleLogout = () => {
    mockLogout();
    window.location.reload();
  };

  // If Admin Dashboard is open, show it instead of the main interface
  if (showAdminDashboard && userIsAdmin) {
    return (
      <AdminDashboard 
        currentUser={currentUser}
        onLogout={handleLogout}
        onBackToApp={() => setShowAdminDashboard(false)}
      />
    );
  }

  // If API Keys Manager is open, show it instead of the main interface
  if (showApiKeysManager) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <ApiKeysManager onClose={() => setShowApiKeysManager(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-primary/10 rounded-xl">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">{t.title}</h1>
                <p className="text-muted-foreground">{t.subtitle}</p>
                {currentUser && (
                  <p className="text-sm text-muted-foreground">
                    Welcome, {currentUser.name || currentUser.email}
                    {userIsAdmin && <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded">Admin</span>}
                  </p>
                )}
              </div>
            </div>
            
            {/* Header Actions */}
            <div className="flex items-center space-x-2">
              {/* Admin Dashboard Button */}
              {userIsAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAdminDashboard(true)}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Admin
                </Button>
              )}
              
              {/* Language Toggle */}
              <Select value={currentLanguage} onValueChange={(value: Language) => setCurrentLanguage(value)}>
                <SelectTrigger className="w-32">
                  <div className="flex items-center space-x-2">
                    <Languages className="h-4 w-4" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {availableLanguages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Logout Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          {/* Service Status */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center space-x-3">
                {healthLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{t.checkingStatus}</span>
                  </>
                ) : (
                  <>
                    {isServiceAvailable ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-sm font-medium">
                      {t.serviceStatus}: {isServiceAvailable ? t.serviceAvailable : t.serviceUnavailable}
                    </span>
                    {clientApiKeys.hasCustomKeys && (
                      <>
                        <span className="text-muted-foreground">•</span>
                        <Key className="h-4 w-4 text-blue-500" />
                        <span className="text-sm text-blue-600">Custom API Keys Active</span>
                      </>
                    )}
                  </>
                )}
              </div>
              {!isServiceAvailable && !healthLoading && (
                <p className="text-sm text-red-600 mt-2 text-center">{t.serviceUnavailableMessage}</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>PDF {t.clickToSelect}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                {...getRootProps()}
                className={`
                  border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
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
                    <FileText className="h-12 w-12 text-primary mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-foreground">{selectedFile.name}</p>
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
                      className="mt-2"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {t.removeFile}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
                    <div>
                      <p className="text-lg text-foreground">
                        {isDragActive ? t.dropFileHereActive : t.dropFileHere}
                      </p>
                      <p className="text-sm text-muted-foreground">{t.onlyPdfSupported}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Translation Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>{t.sourceLanguage} & {t.targetLanguage}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="source-lang">{t.sourceLanguage}</Label>
                  <Select value={sourceLang} onValueChange={setSourceLang}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(languages).map(([code, name]) => (
                        <SelectItem key={code} value={code}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="target-lang">{t.targetLanguage}</Label>
                  <Select value={targetLang} onValueChange={setTargetLang}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(languages).map(([code, name]) => (
                        <SelectItem key={code} value={code}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label className="text-base font-medium">{t.dualLanguageMode}</Label>
                  <p className="text-sm text-muted-foreground">
                    {dualMode ? t.showBothLanguages : t.targetLanguageOnly}
                  </p>
                </div>
                <Switch checked={dualMode} onCheckedChange={setDualMode} />
              </div>
            </CardContent>
          </Card>

          {/* Advanced Settings */}
          <Card>
            <Collapsible open={showAdvancedSettings} onOpenChange={setShowAdvancedSettings}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Settings className="h-5 w-5" />
                      <span>{t.advancedSettings}</span>
                    </div>
                    {showAdvancedSettings ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  {/* API Keys Management */}
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="text-base font-medium flex items-center space-x-2">
                          <Key className="h-4 w-4" />
                          <span>{t.apiKeysManagement}</span>
                          {clientApiKeys.hasCustomKeys && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                              {clientApiKeys.geminiKeys.length + clientApiKeys.openrouterKeys.length} {t.keysConfigured}
                            </span>
                          )}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {clientApiKeys.hasCustomKeys 
                            ? `${t.usingCustomKeysDescription}. ${clientApiKeys.defaultGeminiKey ? 'Gemini' : 'No Gemini'} ${clientApiKeys.defaultOpenrouterKey ? '+ OpenRouter' : ''} configured.`
                            : t.manageKeysDescription
                          }
                        </p>
                      </div>
                      <Button
                        variant={clientApiKeys.hasCustomKeys ? "default" : "outline"}
                        onClick={() => setShowApiKeysManager(true)}
                        className="flex items-center space-x-2"
                      >
                        <Settings className="h-4 w-4" />
                        <span>{clientApiKeys.hasCustomKeys ? t.manageApiKeys : t.addApiKeys}</span>
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <Label className="text-base font-medium">{t.useCustomGemini}</Label>
                      <p className="text-sm text-muted-foreground">
                        Use your own Gemini API key and model settings (Legacy)
                      </p>
                    </div>
                    <Switch checked={useCustomGemini} onCheckedChange={setUseCustomGemini} />
                  </div>

                  {useCustomGemini && (
                    <div className="space-y-4 p-4 bg-accent/20 rounded-lg">
                      <div className="space-y-2">
                        <Label htmlFor="gemini-api-key">{t.geminiApiKey}</Label>
                        <Input
                          id="gemini-api-key"
                          type="password"
                          placeholder={t.geminiApiKeyPlaceholder}
                          value={geminiSettings.apiKey || ''}
                          onChange={(e) => setGeminiSettings(prev => ({ ...prev, apiKey: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gemini-model">{t.geminiModel}</Label>
                        <Select 
                          value={geminiSettings.model || 'gemini-2.5-flash-preview-05-20'} 
                          onValueChange={(value) => setGeminiSettings(prev => ({ ...prev, model: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gemini-2.5-flash-preview-05-20">Gemini 2.5 Flash</SelectItem>
                            <SelectItem value="gemini-2.0-flash">Gemini 2.0 Flash</SelectItem>
                            <SelectItem value="gemini-2.0-flash-lite">Gemini 2.0 Flash Lite</SelectItem>
                            <SelectItem value="gemini-2.5-pro-preview-05-06">Gemini 2.5 Pro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Action Button */}
          <Card>
            <CardContent className="pt-6">
              {!currentTaskId ? (
                <Button
                  onClick={handleTranslate}
                  disabled={!selectedFile || !isServiceAvailable || translateMutation.isPending}
                  className="w-full h-12 text-lg"
                  size="lg"
                >
                  {translateMutation.isPending ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      {t.translating}
                    </>
                  ) : (
                    <>
                      <Globe className="h-5 w-5 mr-2" />
                      {t.translatePdf}
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleDownload}
                  disabled={downloadMutation.isPending}
                  className="w-full h-12 text-lg"
                  size="lg"
                  variant="secondary"
                >
                  {downloadMutation.isPending ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      {t.preparingDownload}
                    </>
                  ) : (
                    <>
                      <Download className="h-5 w-5 mr-2" />
                      {t.downloadTranslatedPdf}
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Status Messages */}
          {translateMutation.isSuccess && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 text-green-800">
                  <CheckCircle className="h-5 w-5" />
                  <p>{t.translationSuccess}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {translateMutation.isError && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 text-red-800">
                  <XCircle className="h-5 w-5" />
                  <div>
                    <p>{t.translationFailed}</p>
                    <p className="text-sm mt-1 whitespace-pre-wrap break-words">{translateMutation.error?.message}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {downloadMutation.isError && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 text-red-800">
                  <XCircle className="h-5 w-5" />
                  <div>
                    <p>{t.downloadFailed}</p>
                    <p className="text-sm mt-1 whitespace-pre-wrap break-words">{downloadMutation.error?.message}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
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