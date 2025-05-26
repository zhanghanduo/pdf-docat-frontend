import React, { useState, useEffect } from 'react';
import { X, Download, Loader2, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface PdfPreviewProps {
  logId: number;
  fileName: string;
  onClose: () => void;
  onDownload: () => void;
  downloadPending?: boolean;
}

const PdfPreview: React.FC<PdfPreviewProps> = ({
  logId,
  fileName,
  onClose,
  onDownload,
  downloadPending = false
}) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(true);

  useEffect(() => {
    const loadPdf = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 获取PDF blob
        const response = await fetch(`http://localhost:8000/api/v1/pdf/download/${logId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to load PDF');
        }
        
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load PDF');
      } finally {
        setLoading(false);
      }
    };

    loadPdf();

    // Cleanup
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [logId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl h-[90vh] flex flex-col">
        <CardHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              PDF预览 - {fileName}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showPreview ? '隐藏预览' : '显示预览'}
              </Button>
              <Button
                onClick={onDownload}
                disabled={downloadPending}
                size="sm"
              >
                {downloadPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    下载中...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    下载PDF
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 p-0">
          {loading && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p>加载PDF预览中...</p>
              </div>
            </div>
          )}
          
          {error && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-red-600">
                <p className="mb-4">预览加载失败</p>
                <p className="text-sm text-gray-500">{error}</p>
                <Button
                  variant="outline"
                  onClick={onDownload}
                  className="mt-4"
                  disabled={downloadPending}
                >
                  直接下载PDF
                </Button>
              </div>
            </div>
          )}
          
          {pdfUrl && showPreview && !loading && !error && (
            <iframe
              src={pdfUrl}
              className="w-full h-full border-0"
              title="PDF Preview"
            />
          )}
          
          {!showPreview && !loading && !error && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Eye className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-4">预览已隐藏</p>
                <Button
                  onClick={() => setShowPreview(true)}
                  variant="outline"
                >
                  显示预览
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PdfPreview; 