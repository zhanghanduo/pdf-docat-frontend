import React, { useState, useEffect } from 'react';
import { FileText, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useTranslation, Language } from '../lib/i18n';

interface InlinePdfPreviewProps {
  file?: File;
  logId?: number;
  currentLanguage: Language;
  showTranslated?: boolean;
}

const InlinePdfPreview: React.FC<InlinePdfPreviewProps> = ({
  file,
  logId,
  currentLanguage,
  showTranslated = false
}) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(true);
  
  const t = useTranslation(currentLanguage);

  // Load original file preview
  useEffect(() => {
    if (file && !showTranslated) {
      const url = URL.createObjectURL(file);
      setPdfUrl(url);
      setError(null);
      
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [file, showTranslated]);

  // Load translated file preview
  useEffect(() => {
    if (logId && showTranslated) {
      const loadTranslatedPdf = async () => {
        try {
          setLoading(true);
          setError(null);
          
          const response = await fetch(`http://localhost:8000/api/v1/pdf/download/${logId}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          
          if (!response.ok) {
            throw new Error('Failed to load translated PDF');
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

      loadTranslatedPdf();

      return () => {
        if (pdfUrl) {
          URL.revokeObjectURL(pdfUrl);
        }
      };
    }
  }, [logId, showTranslated]);

  // Clean up when switching between original and translated
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [showTranslated]);

  const getTitle = () => {
    if (showTranslated && logId) {
      return t.translatedDocument;
    } else if (file) {
      return t.originalDocument;
    }
    return t.pdfPreview;
  };

  const getBadgeVariant = () => {
    if (showTranslated && logId) {
      return 'default';
    } else if (file) {
      return 'secondary';
    }
    return 'outline';
  };

  const getBadgeText = () => {
    if (showTranslated && logId) {
      return t.translatedDocument;
    } else if (file) {
      return t.originalDocument;
    }
    return t.noPreviewAvailable;
  };

  if (!file && !logId) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">{t.noPreviewAvailable}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0 pb-3">
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>{getTitle()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={getBadgeVariant()} className="text-xs">
              {getBadgeText()}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="h-6 w-6 p-0"
            >
              {showPreview ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 p-0 min-h-0">
        {loading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">{t.loadingPreview}</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-red-600">
              <AlertCircle className="h-6 w-6 mx-auto mb-2" />
              <p className="text-sm font-medium">{t.previewLoadFailed}</p>
              <p className="text-xs text-muted-foreground mt-1">{error}</p>
            </div>
          </div>
        )}
        
        {pdfUrl && showPreview && !loading && !error && (
          <iframe
            src={pdfUrl}
            className="w-full h-full border-0 rounded-b-lg"
            title="PDF Preview"
          />
        )}
        
        {!showPreview && !loading && !error && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Eye className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">
                {currentLanguage === 'zh' ? '预览已隐藏' : 'Preview hidden'}
              </p>
              <Button
                onClick={() => setShowPreview(true)}
                variant="outline"
                size="sm"
              >
                {currentLanguage === 'zh' ? '显示预览' : 'Show preview'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InlinePdfPreview; 