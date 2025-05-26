import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  History, 
  Download, 
  Eye, 
  FileText, 
  Calendar, 
  Clock, 
  HardDrive,
  ArrowLeft,
  Loader2,
  CheckCircle,
  XCircle,
  RefreshCw,
  Trash2,
  Square,
  CheckSquare
} from 'lucide-react';

import { pdfApi, ProcessingLog } from '../lib/api';
import { Language } from '../lib/i18n';

import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
// import { Badge } from './ui/badge'; // 暂时注释掉，稍后修复

interface TranslationHistoryProps {
  currentLanguage: Language;
  onClose: () => void;
}

const TranslationHistory: React.FC<TranslationHistoryProps> = ({ 
  currentLanguage, 
  onClose 
}) => {
  const [selectedLog, setSelectedLog] = useState<ProcessingLog | null>(null);
  const [previewContent, setPreviewContent] = useState<any>(null);
  const [selectedLogs, setSelectedLogs] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  
  const queryClient = useQueryClient();
  // const t = useTranslation(currentLanguage); // 暂时注释掉未使用的翻译函数

  // Fetch processing logs
  const { 
    data: logs = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['processing-logs'],
    queryFn: () => pdfApi.getProcessingLogs(50, 0),
    retry: 1, // Only retry once
    retryDelay: 1000, // Wait 1 second before retry
  });

  // Download mutation
  const downloadMutation = useMutation({
    mutationFn: async (logId: number) => {
      const blob = await pdfApi.downloadTranslatedPdf(logId);
      
      const log = logs.find(l => l.id === logId);
      const fileName = log ? `translated_${log.file_name}` : `translated_${logId}.pdf`;
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
  });

  // Delete single log mutation
  const deleteMutation = useMutation({
    mutationFn: async (logId: number) => {
      return await pdfApi.deleteProcessingLog(logId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processing-logs'] });
    },
  });

  // Batch delete mutation
  const batchDeleteMutation = useMutation({
    mutationFn: async (logIds: number[]) => {
      return await pdfApi.batchDeleteProcessingLogs(logIds);
    },
    onSuccess: () => {
      setSelectedLogs(new Set());
      setSelectAll(false);
      queryClient.invalidateQueries({ queryKey: ['processing-logs'] });
    },
  });

  // Preview mutation
  const previewMutation = useMutation({
    mutationFn: async (logId: number) => {
      const log = await pdfApi.getProcessingLog(logId);
      setSelectedLog(log);
      setPreviewContent(log.extracted_content);
    },
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString(currentLanguage === 'zh' ? 'zh-CN' : 'en-US');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />完成</span>;
      case 'failed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />失败</span>;
      case 'processing':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"><Loader2 className="h-3 w-3 mr-1 animate-spin" />处理中</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const getLanguageDisplay = (content: any) => {
    if (!content || !content.metadata) return '';
    const { sourceLanguage, targetLanguage, isTranslated } = content.metadata;
    if (!isTranslated) return '仅提取';
    return `${sourceLanguage} → ${targetLanguage}`;
  };

  const handleSelectLog = (logId: number) => {
    const newSelected = new Set(selectedLogs);
    if (newSelected.has(logId)) {
      newSelected.delete(logId);
    } else {
      newSelected.add(logId);
    }
    setSelectedLogs(newSelected);
    setSelectAll(newSelected.size === logs.length);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedLogs(new Set());
      setSelectAll(false);
    } else {
      setSelectedLogs(new Set(logs.map(log => log.id)));
      setSelectAll(true);
    }
  };

  const handleBatchDelete = () => {
    if (selectedLogs.size === 0) return;
    
    if (confirm(`确定要删除选中的 ${selectedLogs.size} 条记录吗？此操作不可撤销。`)) {
      batchDeleteMutation.mutate(Array.from(selectedLogs));
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="flex items-center justify-between mb-6">
            <Button variant="outline" onClick={onClose}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回主页
            </Button>
          </div>
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 text-red-800">
                <XCircle className="h-5 w-5" />
                <div>
                  <p>加载翻译历史失败</p>
                  <p className="text-sm mt-1">{error.message}</p>
                  <Button 
                    variant="outline" 
                    onClick={() => refetch()} 
                    className="mt-2"
                  >
                    重试
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (previewContent && selectedLog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Preview Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setPreviewContent(null);
                  setSelectedLog(null);
                }}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回历史记录
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">文档预览</h1>
                <p className="text-muted-foreground">{selectedLog.file_name}</p>
              </div>
            </div>
            <Button
              onClick={() => downloadMutation.mutate(selectedLog.id)}
              disabled={downloadMutation.isPending}
            >
              {downloadMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              下载PDF
            </Button>
          </div>

          {/* Preview Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>文档内容</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{getLanguageDisplay(previewContent)}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {previewContent.content?.map((item: any, index: number) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">页面 {item.page_number || item.page}</span>
                      <span className="text-xs text-muted-foreground">{item.type}</span>
                    </div>
                    <div className="text-sm whitespace-pre-wrap">
                      {item.content || item.text}
                      {item.translatedContent && (
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <span className="text-xs text-blue-600 font-medium">翻译：</span>
                          <div className="text-blue-800">{item.translatedContent}</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={onClose}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回主页
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center space-x-2">
                <History className="h-6 w-6" />
                <span>翻译历史</span>
              </h1>
              <p className="text-muted-foreground">查看和管理您的翻译记录</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {selectedLogs.size > 0 && (
              <Button
                variant="destructive"
                onClick={handleBatchDelete}
                disabled={batchDeleteMutation.isPending}
              >
                {batchDeleteMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                删除选中 ({selectedLogs.size})
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              刷新
            </Button>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p>加载翻译历史中...</p>
            </div>
          </div>
        ) : logs.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">暂无翻译记录</h3>
                <p className="text-muted-foreground">开始翻译您的第一个PDF文档吧！</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>翻译记录 ({logs.length})</span>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAll}
                  >
                    {selectAll ? (
                      <CheckSquare className="h-4 w-4 mr-2" />
                    ) : (
                      <Square className="h-4 w-4 mr-2" />
                    )}
                    {selectAll ? '取消全选' : '全选'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className={`p-4 border rounded-lg transition-colors ${
                      selectedLogs.has(log.id) ? 'bg-blue-50 border-blue-200' : 'hover:bg-accent/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleSelectLog(log.id)}
                          className="p-1"
                        >
                          {selectedLogs.has(log.id) ? (
                            <CheckSquare className="h-4 w-4 text-blue-600" />
                          ) : (
                            <Square className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                        <FileText className="h-8 w-8 text-primary" />
                        <div>
                          <h3 className="font-medium text-foreground">{log.file_name}</h3>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center space-x-1">
                              <HardDrive className="h-3 w-3" />
                              <span>{formatFileSize(log.file_size)}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(log.timestamp)}</span>
                            </span>
                            {log.processing_time && (
                              <span className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>{(log.processing_time / 1000).toFixed(1)}s</span>
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            {getStatusBadge(log.status)}
                            {log.extracted_content && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {getLanguageDisplay(log.extracted_content)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {log.status === 'completed' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => previewMutation.mutate(log.id)}
                              disabled={previewMutation.isPending}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              预览
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => downloadMutation.mutate(log.id)}
                              disabled={downloadMutation.isPending}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              下载
                            </Button>
                          </>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (confirm('确定要删除这条记录吗？此操作不可撤销。')) {
                              deleteMutation.mutate(log.id);
                            }
                          }}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TranslationHistory; 