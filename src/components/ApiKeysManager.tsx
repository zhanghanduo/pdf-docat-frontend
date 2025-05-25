import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  TestTube, 
  CheckCircle, 
  XCircle, 
  Loader2,
  Key,
  AlertTriangle
} from 'lucide-react';

import { 
  clientApiKeysApi, 
  ClientApiKeyCreate, 
  ClientApiKeyUpdate, 
  ClientApiKeyListResponse
} from '../lib/api';

import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';

interface ApiKeysManagerProps {
  onClose?: () => void;
}

interface ApiKeyFormData {
  service_name: string;
  api_key: string;
  name: string;
  description: string;
  model_name: string;
  is_default: boolean;
}

const ApiKeysManager: React.FC<ApiKeysManagerProps> = ({ onClose }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingKey, setEditingKey] = useState<ClientApiKeyListResponse | null>(null);
  const [showApiKey, setShowApiKey] = useState<Record<number, boolean>>({});
  const [testingKey, setTestingKey] = useState<number | null>(null);
  const [formData, setFormData] = useState<ApiKeyFormData>({
    service_name: '',
    api_key: '',
    name: '',
    description: '',
    model_name: '',
    is_default: false,
  });

  const queryClient = useQueryClient();

  // Fetch supported services
  const { data: services, isLoading: servicesLoading } = useQuery({
    queryKey: ['supportedServices'],
    queryFn: clientApiKeysApi.getSupportedServices,
  });

  // Fetch user's API keys
  const { data: apiKeys, isLoading: keysLoading } = useQuery({
    queryKey: ['clientApiKeys'],
    queryFn: () => clientApiKeysApi.getApiKeys(),
  });

  // Create API key mutation
  const createMutation = useMutation({
    mutationFn: clientApiKeysApi.createApiKey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientApiKeys'] });
      setShowAddForm(false);
      resetForm();
    },
  });

  // Update API key mutation
  const updateMutation = useMutation({
    mutationFn: ({ keyId, data }: { keyId: number; data: ClientApiKeyUpdate }) =>
      clientApiKeysApi.updateApiKey(keyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientApiKeys'] });
      setEditingKey(null);
      resetForm();
    },
  });

  // Delete API key mutation
  const deleteMutation = useMutation({
    mutationFn: clientApiKeysApi.deleteApiKey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientApiKeys'] });
    },
  });

  // Test API key mutation
  const testMutation = useMutation({
    mutationFn: clientApiKeysApi.testApiKey,
    onSettled: () => {
      setTestingKey(null);
    },
  });

  const resetForm = () => {
    setFormData({
      service_name: '',
      api_key: '',
      name: '',
      description: '',
      model_name: '',
      is_default: false,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingKey) {
      const updateData: ClientApiKeyUpdate = {
        name: formData.name || undefined,
        description: formData.description || undefined,
        model_name: formData.model_name || undefined,
        is_default: formData.is_default,
      };
      updateMutation.mutate({ keyId: editingKey.id, data: updateData });
    } else {
      const createData: ClientApiKeyCreate = {
        service_name: formData.service_name,
        api_key: formData.api_key,
        name: formData.name || undefined,
        description: formData.description || undefined,
        model_name: formData.model_name || undefined,
        is_default: formData.is_default,
      };
      createMutation.mutate(createData);
    }
  };

  const handleEdit = (key: ClientApiKeyListResponse) => {
    setEditingKey(key);
    setFormData({
      service_name: key.service_name,
      api_key: '', // Don't populate for security
      name: key.name || '',
      description: '', // Would need to fetch full details
      model_name: key.model_name || '',
      is_default: key.is_default,
    });
    setShowAddForm(true);
  };

  const handleTestApiKey = (key: ClientApiKeyListResponse) => {
    setTestingKey(key.id);
    // Note: We'll test using the key ID instead of the masked key
    // The backend should have a test endpoint that accepts key ID
    alert('API key testing will be implemented in the backend to securely test without exposing the full key.');
    setTestingKey(null);
  };

  const toggleApiKeyVisibility = (keyId: number) => {
    setShowApiKey(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const getSelectedService = () => {
    if (!services || !formData.service_name) return null;
    return services[formData.service_name];
  };

  const selectedService = getSelectedService();

  if (servicesLoading || keysLoading) {
    return (
      <Card className="w-full max-w-4xl">
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading API keys...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Key className="h-6 w-6" />
              <div>
                <CardTitle>API Keys Management</CardTitle>
                <CardDescription>
                  Manage your custom API keys for AI services like Gemini and OpenRouter
                </CardDescription>
              </div>
            </div>
            {onClose && (
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Add New Key Button */}
      {!showAddForm && (
        <Card>
          <CardContent className="pt-6">
            <Button onClick={() => setShowAddForm(true)} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add New API Key
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingKey ? 'Edit API Key' : 'Add New API Key'}</CardTitle>
            <CardDescription>
              {editingKey ? 'Update your API key settings' : 'Add a new API key for AI services'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Service Selection */}
              {!editingKey && (
                <div className="space-y-2">
                  <Label htmlFor="service">Service *</Label>
                  <Select
                    value={formData.service_name}
                    onValueChange={(value) => setFormData(prev => ({ 
                      ...prev, 
                      service_name: value,
                      model_name: services?.[value]?.default_model || ''
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services && Object.values(services).map((service) => (
                        <SelectItem key={service.service_name} value={service.service_name}>
                          {service.service_name.toUpperCase()} - {service.rate_limit_per_minute} req/min
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* API Key */}
              {!editingKey && (
                <div className="space-y-2">
                  <Label htmlFor="api_key">API Key *</Label>
                  <Input
                    id="api_key"
                    type="password"
                    placeholder="Enter your API key"
                    value={formData.api_key}
                    onChange={(e) => setFormData(prev => ({ ...prev, api_key: e.target.value }))}
                    required
                  />
                </div>
              )}

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., My Gemini Key"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Optional description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              {/* Model Selection */}
              {selectedService && (
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Select
                    value={formData.model_name}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, model_name: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedService.supported_models.map((model) => (
                        <SelectItem key={model} value={model}>
                          {model} {model === selectedService.default_model && '(default)'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Default Key Toggle */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Default Key</Label>
                  <p className="text-sm text-muted-foreground">
                    Use this as the default key for this service
                  </p>
                </div>
                <Switch
                  checked={formData.is_default}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_default: checked }))}
                />
              </div>

              {/* Form Actions */}
              <div className="flex space-x-2">
                <Button 
                  type="submit" 
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1"
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  {editingKey ? 'Update' : 'Add'} API Key
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingKey(null);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* API Keys List */}
      <Card>
        <CardHeader>
          <CardTitle>Your API Keys</CardTitle>
          <CardDescription>
            {apiKeys?.length || 0} API key{(apiKeys?.length || 0) !== 1 ? 's' : ''} configured
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!apiKeys || apiKeys.length === 0 ? (
            <div className="text-center py-8">
              <Key className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No API keys configured yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Add your first API key to get started
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {apiKeys.map((key) => (
                <div key={key.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">
                          {key.name || `${key.service_name.toUpperCase()} Key`}
                        </h3>
                        {key.is_default && (
                          <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                            Default
                          </span>
                        )}
                        {!key.is_active && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                            Inactive
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Service: {key.service_name.toUpperCase()}
                        {key.model_name && ` • Model: ${key.model_name}`}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-sm font-mono">
                          {showApiKey[key.id] ? key.api_key_masked : key.api_key_masked}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleApiKeyVisibility(key.id)}
                        >
                          {showApiKey[key.id] ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Used {key.usage_count} times
                        {key.last_used && ` • Last used: ${new Date(key.last_used).toLocaleDateString()}`}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTestApiKey(key)}
                        disabled={testingKey === key.id}
                      >
                        {testingKey === key.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <TestTube className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(key)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteMutation.mutate(key.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Test Result */}
                  {testMutation.data && testingKey === null && (
                    <div className="mt-3 p-3 bg-gray-50 rounded">
                      <div className="flex items-center space-x-2">
                        {testMutation.data.valid ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className="text-sm">
                          {testMutation.data.valid 
                            ? 'API key is valid and working' 
                            : `Test failed: ${testMutation.data.error}`
                          }
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error Messages */}
      {(createMutation.error || updateMutation.error || deleteMutation.error) && (
        <Card className="border-red-200">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-red-600">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">
                {createMutation.error?.message || 
                 updateMutation.error?.message || 
                 deleteMutation.error?.message}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ApiKeysManager; 