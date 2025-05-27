import React, { useState, useEffect } from 'react';
import { 
  Loader2, 
  FileText, 
  Languages, 
  CheckCircle, 
  XCircle,
  Clock,
  AlertCircle,
  Timer,
  Activity,
  Zap,
  History
} from 'lucide-react';
import { ProcessingStatus } from '../lib/api';
import { useTranslation, Language } from '../lib/i18n';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface EnhancedStatusDisplayProps {
  status: ProcessingStatus | null;
  isLoading: boolean;
  error: any;
  fileName?: string;
  fileSize?: number;
  startTime?: Date;
  currentLanguage: Language;
  showSuccessActions?: boolean;
  onViewHistory?: () => void;
  isProcessing?: boolean;
  isSuccess?: boolean;
}

const EnhancedStatusDisplay: React.FC<EnhancedStatusDisplayProps> = ({
  status,
  isLoading,
  error,
  fileName,
  fileSize,
  startTime,
  currentLanguage,
  showSuccessActions = false,
  onViewHistory,
  isProcessing = false,
  isSuccess = false
}) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const t = useTranslation(currentLanguage);

  // Real-time elapsed time tracking
  useEffect(() => {
    if (!startTime || status?.status === 'SUCCESS' || status?.status === 'FAILURE') {
      return;
    }

    const interval = setInterval(() => {
      const now = new Date();
      const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, status?.status]);

  const formatElapsedTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getStatusIcon = () => {
    switch (status?.status) {
      case 'PENDING':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'PROCESSING':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
      case 'SUCCESS':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'FAILURE':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'CANCELLED':
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
      default:
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status?.status) {
      case 'PENDING':
        return 'border-yellow-200 bg-yellow-50';
      case 'PROCESSING':
        return 'border-blue-200 bg-blue-50';
      case 'SUCCESS':
        return 'border-green-200 bg-green-50';
      case 'FAILURE':
        return 'border-red-200 bg-red-50';
      case 'CANCELLED':
        return 'border-gray-200 bg-gray-50';
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  const getStageIcon = () => {
    if (status?.stage?.toLowerCase().includes('extract')) {
      return <FileText className="h-4 w-4" />;
    } else if (status?.stage?.toLowerCase().includes('translat')) {
      return <Languages className="h-4 w-4" />;
    } else if (status?.stage?.toLowerCase().includes('process')) {
      return <Activity className="h-4 w-4" />;
    }
    return <Zap className="h-4 w-4" />;
  };

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2 text-red-800">
            <XCircle className="h-5 w-5" />
            <p className="font-medium">{t.processingFailed}</p>
          </div>
          <p className="text-sm text-red-600 mt-2">
            {error?.message || 'An error occurred during processing'}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading && !status) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
            <p className="text-sm text-muted-foreground">
              {isProcessing ? t.processingDocument : t.initializingProcessing}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Handle synchronous processing state
  if (isProcessing && !status) {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
              <p className="text-sm font-medium text-blue-800">{t.processingDocument}</p>
            </div>
            
            {/* Elapsed Time */}
            <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Timer className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">{t.elapsedTime}</span>
              </div>
              <span className="text-sm font-mono text-blue-600">
                {formatElapsedTime(elapsedTime)}
              </span>
            </div>
            
            <p className="text-xs text-blue-600">{t.pleaseWait}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Handle synchronous success state
  if (isSuccess && !status) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <p className="text-sm font-medium text-green-800">{t.translationSuccess}</p>
            </div>
            
            {/* Processing Time */}
            {startTime && (
              <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Timer className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">{t.totalTime}</span>
                </div>
                <span className="text-sm font-mono text-green-600">
                  {formatElapsedTime(elapsedTime)}
                </span>
              </div>
            )}
            
            <p className="text-xs text-green-600">{t.translationCompleted}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!status && !startTime) {
    return (
      <Card className="border-dashed border-gray-300">
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">{t.processingStatusWillAppear}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* File Information */}
      {fileName && (
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-blue-500" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{fileName}</p>
                {fileSize && (
                  <p className="text-xs text-muted-foreground">{formatFileSize(fileSize)}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Processing Status */}
      <Card className={getStatusColor()}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getStatusIcon()}
              <span className="text-base">{t.processingStatus}</span>
            </div>
            <Badge variant={status?.status === 'SUCCESS' ? 'default' : 'secondary'}>
              {status?.status || 'INITIALIZING'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Elapsed Time */}
          <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Timer className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">{t.elapsedTime}</span>
            </div>
            <span className="text-sm font-mono text-blue-600">
              {status?.processing_time 
                ? formatElapsedTime(Math.floor(status.processing_time / 1000))
                : formatElapsedTime(elapsedTime)
              }
            </span>
          </div>

          {/* Overall Progress */}
          {status && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{t.overallProgress}</span>
                <span className="text-sm text-muted-foreground">
                  {status.progress.toFixed(0)}%
                </span>
              </div>
              <Progress value={status.progress} className="h-2" />
            </div>
          )}

          {/* Current Stage */}
          {status?.stage && (
            <div className="flex items-center space-x-2 p-3 bg-white/50 rounded-lg">
              {getStageIcon()}
              <div className="flex-1">
                <p className="text-sm font-medium">{status.stage}</p>
                {status.message && (
                  <p className="text-xs text-muted-foreground mt-1">{status.message}</p>
                )}
              </div>
            </div>
          )}

          {/* Page Progress */}
          {status?.current_page && status?.total_pages && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{t.pageProgress}</span>
                <span className="text-sm text-muted-foreground">
                  {status.current_page} / {status.total_pages}
                </span>
              </div>
              <Progress 
                value={(status.current_page / status.total_pages) * 100} 
                className="h-1.5" 
              />
            </div>
          )}

          {/* Stage Progress */}
          {status?.stage_current && status?.stage_total && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{t.stageProgress}</span>
                <span className="text-sm text-muted-foreground">
                  {status.stage_current} / {status.stage_total}
                </span>
              </div>
              <Progress 
                value={(status.stage_current / status.stage_total) * 100} 
                className="h-1.5" 
              />
            </div>
          )}

          {/* Timing Information */}
          {status?.started_at && (
            <div className="text-xs text-muted-foreground">
              {t.started}: {new Date(status.started_at).toLocaleTimeString()}
              {status.completed_at && (
                <span className="ml-4">
                  {t.completed}: {new Date(status.completed_at).toLocaleTimeString()}
                </span>
              )}
            </div>
          )}

          {/* Error Message */}
          {status?.status === 'FAILURE' && status?.error && (
            <div className="p-3 bg-red-100 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800 font-medium">{t.errorDetails}:</p>
              <p className="text-sm text-red-700 mt-1">{status.error}</p>
            </div>
          )}

          {/* Success Message */}
          {status?.status === 'SUCCESS' && (
            <div className="p-3 bg-green-100 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 font-medium">
                {t.processingCompletedSuccessfully}
                {status.processing_time && (
                  <span className="ml-2">
                    {t.totalTime}: {formatElapsedTime(Math.floor(status.processing_time / 1000))}
                  </span>
                )}
              </p>
              
              {/* Success Actions */}
              {showSuccessActions && onViewHistory && (
                <Button
                  onClick={onViewHistory}
                  variant="ghost"
                  size="sm"
                  className="w-full text-green-700 hover:bg-green-100 h-8 mt-2"
                >
                  <History className="h-3 w-3 mr-2" />
                  <span className="text-xs">{t.viewInTranslationHistory}</span>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedStatusDisplay; 