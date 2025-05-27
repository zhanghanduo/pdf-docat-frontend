import React from 'react';
import { 
  Loader2, 
  FileText, 
  Languages, 
  CheckCircle, 
  XCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { ProcessingStatus } from '../lib/api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';

interface ProcessingStatusDisplayProps {
  status: ProcessingStatus | null;
  isLoading: boolean;
  error: any;
  fileName?: string;
}

const ProcessingStatusDisplay: React.FC<ProcessingStatusDisplayProps> = ({
  status,
  isLoading,
  error,
  fileName
}) => {
  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2 text-red-800">
            <XCircle className="h-5 w-5" />
            <p className="font-medium">处理失败</p>
          </div>
          <p className="text-sm text-red-600 mt-2">
            {error?.message || '处理过程中发生错误'}
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
            <p className="text-sm text-muted-foreground">正在获取处理状态...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!status) {
    return null;
  }

  const getStatusIcon = () => {
    switch (status.status) {
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
    switch (status.status) {
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
    if (status.stage?.toLowerCase().includes('extract')) {
      return <FileText className="h-4 w-4" />;
    } else if (status.stage?.toLowerCase().includes('translat')) {
      return <Languages className="h-4 w-4" />;
    }
    return <Loader2 className="h-4 w-4 animate-spin" />;
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds.toFixed(1)}秒`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}分${remainingSeconds.toFixed(0)}秒`;
  };

  return (
    <Card className={getStatusColor()}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {getStatusIcon()}
          <span>处理状态</span>
          {fileName && (
            <span className="text-sm font-normal text-muted-foreground">
              - {fileName}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">总体进度</span>
            <span className="text-sm text-muted-foreground">
              {status.progress.toFixed(0)}%
            </span>
          </div>
          <Progress value={status.progress} className="h-2" />
        </div>

        {/* Current Stage */}
        {status.stage && (
          <div className="flex items-center space-x-2 p-3 bg-white/50 rounded-lg">
            {getStageIcon()}
            <div className="flex-1">
              <p className="text-sm font-medium">{status.stage}</p>
              {status.message && (
                <p className="text-xs text-muted-foreground">{status.message}</p>
              )}
            </div>
          </div>
        )}

        {/* Page Progress */}
        {status.current_page && status.total_pages && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">页面进度</span>
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
        {status.stage_current && status.stage_total && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">阶段进度</span>
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
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          {status.started_at && (
            <span>
              开始时间: {new Date(status.started_at).toLocaleTimeString()}
            </span>
          )}
          {status.processing_time && (
            <span>
              已用时间: {formatTime(status.processing_time / 1000)}
            </span>
          )}
        </div>

        {/* Error Message */}
        {status.status === 'FAILURE' && status.error && (
          <div className="p-3 bg-red-100 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800 font-medium">错误信息:</p>
            <p className="text-sm text-red-700 mt-1">{status.error}</p>
          </div>
        )}

        {/* Success Message */}
        {status.status === 'SUCCESS' && (
          <div className="p-3 bg-green-100 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 font-medium">
              处理完成！
              {status.processing_time && (
                <span className="ml-2">
                  总用时: {formatTime(status.processing_time / 1000)}
                </span>
              )}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProcessingStatusDisplay; 