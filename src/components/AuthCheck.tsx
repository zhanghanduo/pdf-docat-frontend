import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Key, AlertTriangle } from 'lucide-react';

interface AuthCheckProps {
  children: React.ReactNode;
}

const AuthCheck: React.FC<AuthCheckProps> = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="container mx-auto px-4 py-8 max-w-md">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <AlertTriangle className="h-8 w-8 text-yellow-600" />
                </div>
              </div>
              <CardTitle>Authentication Required</CardTitle>
              <CardDescription>
                You need to be logged in to access the PDF translation service and manage your API keys.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  For now, you can use a demo token to test the API key management features.
                </p>
                <Button
                  onClick={() => {
                    // Set a demo token for testing
                    localStorage.setItem('token', 'demo-token-for-testing');
                    window.location.reload();
                  }}
                  className="w-full"
                >
                  <Key className="h-4 w-4 mr-2" />
                  Use Demo Access
                </Button>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  Note: In production, this would integrate with a proper authentication system.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthCheck; 