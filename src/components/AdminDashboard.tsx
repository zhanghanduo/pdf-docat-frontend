import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Loader2, 
  Shield, 
  CreditCard, 
  User as UserIcon,
  LogOut,
  ArrowLeft,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { mockUsers, mockLogout } from '../lib/crypto';
import { UserCreate, UserUpdate } from '../lib/api';

interface AdminDashboardProps {
  currentUser: any;
  onLogout: () => void;
  onBackToApp: () => void;
}

interface UserFormData {
  email: string;
  name: string;
  password: string;
  role: 'admin' | 'user';
  tier: string;
  is_active: boolean;
  credits: number;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentUser, onLogout, onBackToApp }) => {
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [showCreditForm, setShowCreditForm] = useState<number | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    email: '',
    name: '',
    password: '',
    role: 'user',
    tier: 'basic',
    is_active: true,
    credits: 100,
  });
  const [creditFormData, setCreditFormData] = useState({
    credits: 0,
    operation: 'add' as 'add' | 'subtract' | 'set',
    description: '',
  });

  const queryClient = useQueryClient();

  // Mock queries (in production, these would be real API calls)
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => Promise.resolve(mockUsers),
  });

  // Mock mutations
  const createUserMutation = useMutation({
    mutationFn: async (userData: UserCreate) => {
      // Mock user creation
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newUser = {
        id: Date.now(),
        email: userData.email,
        name: userData.name || '',
        role: userData.role || 'user',
        tier: userData.tier || 'basic',
        is_active: formData.is_active,
        created_at: new Date().toISOString(),
        credits: { used: 0, limit: formData.credits, available: formData.credits }
      };
      mockUsers.push(newUser);
      return newUser;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setShowUserForm(false);
      resetForm();
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ userId, userData }: { userId: number; userData: UserUpdate }) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const userIndex = mockUsers.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
        mockUsers[userIndex] = { ...mockUsers[userIndex], ...userData };
      }
      return mockUsers[userIndex];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setEditingUser(null);
      setShowUserForm(false);
      resetForm();
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const userIndex = mockUsers.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
        mockUsers.splice(userIndex, 1);
      }
      return { message: 'User deleted successfully' };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const updateCreditsMutation = useMutation({
    mutationFn: async ({ userId, creditData }: { userId: number; creditData: any }) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const userIndex = mockUsers.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
        const user = mockUsers[userIndex];
        const currentCredits = user.credits;
        
        let newLimit = currentCredits.limit;
        switch (creditData.operation) {
          case 'add':
            newLimit = currentCredits.limit + creditData.credits;
            break;
          case 'subtract':
            newLimit = Math.max(0, currentCredits.limit - creditData.credits);
            break;
          case 'set':
            newLimit = creditData.credits;
            break;
        }
        
        user.credits = {
          ...currentCredits,
          limit: newLimit,
          available: newLimit - currentCredits.used
        };
      }
      return mockUsers[userIndex];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setShowCreditForm(null);
      setCreditFormData({ credits: 0, operation: 'add', description: '' });
    },
  });

  const resetForm = () => {
    setFormData({
      email: '',
      name: '',
      password: '',
      role: 'user',
      tier: 'basic',
      is_active: true,
      credits: 100,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingUser) {
      const updateData: UserUpdate = {
        email: formData.email,
        name: formData.name,
        role: formData.role,
        tier: formData.tier,
        is_active: formData.is_active,
      };
      updateUserMutation.mutate({ userId: editingUser.id, userData: updateData });
    } else {
      const createData: UserCreate = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: formData.role,
        tier: formData.tier,
      };
      createUserMutation.mutate(createData);
    }
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      name: user.name || '',
      password: '', // Don't populate password for security
      role: user.role,
      tier: user.tier,
      is_active: user.is_active,
      credits: user.credits?.limit || 100,
    });
    setShowUserForm(true);
  };

  const handleCreditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (showCreditForm) {
      updateCreditsMutation.mutate({
        userId: showCreditForm,
        creditData: creditFormData
      });
    }
  };

  const handleLogout = () => {
    mockLogout();
    onLogout();
  };

  if (usersLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shield className="h-6 w-6 text-blue-600" />
                <div>
                  <CardTitle>Admin Dashboard</CardTitle>
                  <CardDescription>
                    Welcome back, {currentUser.name}. Manage users and credits.
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" onClick={onBackToApp}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to App
                </Button>
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                {users?.filter(u => u.role === 'admin').length || 0} admins, {users?.filter(u => u.role === 'user').length || 0} users
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users?.filter(u => u.is_active).length || 0}</div>
              <p className="text-xs text-muted-foreground">
                {users?.filter(u => !u.is_active).length || 0} inactive
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users?.reduce((total, user) => total + (user.credits?.limit || 0), 0) || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {users?.reduce((total, user) => total + (user.credits?.used || 0), 0) || 0} used
              </p>
            </CardContent>
          </Card>
        </div>

        {/* User Management */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Add, edit, and manage user accounts</CardDescription>
              </div>
              <Button onClick={() => setShowUserForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* User Form */}
            {showUserForm && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>{editingUser ? 'Edit User' : 'Add New User'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      {!editingUser && (
                        <div className="space-y-2">
                          <Label htmlFor="password">Password *</Label>
                          <Input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                            required={!editingUser}
                          />
                        </div>
                      )}
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select value={formData.role} onValueChange={(value: 'admin' | 'user') => setFormData(prev => ({ ...prev, role: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tier">Tier</Label>
                        <Select value={formData.tier} onValueChange={(value) => setFormData(prev => ({ ...prev, tier: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="basic">Basic</SelectItem>
                            <SelectItem value="premium">Premium</SelectItem>
                            <SelectItem value="enterprise">Enterprise</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {!editingUser && (
                        <div className="space-y-2">
                          <Label htmlFor="credits">Initial Credits</Label>
                          <Input
                            id="credits"
                            type="number"
                            value={formData.credits}
                            onChange={(e) => setFormData(prev => ({ ...prev, credits: parseInt(e.target.value) || 0 }))}
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={formData.is_active}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                      />
                      <Label>Active</Label>
                    </div>
                    <div className="flex space-x-2">
                      <Button type="submit" disabled={createUserMutation.isPending || updateUserMutation.isPending}>
                        {(createUserMutation.isPending || updateUserMutation.isPending) && (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        )}
                        {editingUser ? 'Update' : 'Create'} User
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowUserForm(false);
                          setEditingUser(null);
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

            {/* Users List */}
            <div className="space-y-4">
              {users?.map((user) => (
                <div key={user.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <UserIcon className="h-4 w-4" />
                        <h3 className="font-medium">{user.name || user.email}</h3>
                        <span className={`px-2 py-1 text-xs rounded ${
                          user.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {user.role}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded ${
                          user.tier === 'premium' ? 'bg-purple-100 text-purple-700' : 
                          user.tier === 'enterprise' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {user.tier}
                        </span>
                        {!user.is_active && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                            Inactive
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <p className="text-xs text-muted-foreground">
                        Credits: {user.credits?.used || 0} / {user.credits?.limit || 0} 
                        ({user.credits?.available || 0} available)
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowCreditForm(user.id)}
                      >
                        <CreditCard className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {user.id !== currentUser.id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteUserMutation.mutate(user.id)}
                          disabled={deleteUserMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Credit Management Modal */}
        {showCreditForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Manage Credits</CardTitle>
              <CardDescription>
                Update credits for {users?.find(u => u.id === showCreditForm)?.email}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreditSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="operation">Operation</Label>
                    <Select 
                      value={creditFormData.operation} 
                      onValueChange={(value: 'add' | 'subtract' | 'set') => 
                        setCreditFormData(prev => ({ ...prev, operation: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="add">Add Credits</SelectItem>
                        <SelectItem value="subtract">Subtract Credits</SelectItem>
                        <SelectItem value="set">Set Credits</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="credits">Credits</Label>
                    <Input
                      id="credits"
                      type="number"
                      value={creditFormData.credits}
                      onChange={(e) => setCreditFormData(prev => ({ ...prev, credits: parseInt(e.target.value) || 0 }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      placeholder="Optional description"
                      value={creditFormData.description}
                      onChange={(e) => setCreditFormData(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button type="submit" disabled={updateCreditsMutation.isPending}>
                    {updateCreditsMutation.isPending && (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    )}
                    Update Credits
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowCreditForm(null);
                      setCreditFormData({ credits: 0, operation: 'add', description: '' });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Error Messages */}
        {(createUserMutation.isError || updateUserMutation.isError || deleteUserMutation.isError || updateCreditsMutation.isError) && (
          <Card className="border-red-200">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 text-red-600">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">
                  {createUserMutation.error?.message || 
                   updateUserMutation.error?.message || 
                   deleteUserMutation.error?.message ||
                   updateCreditsMutation.error?.message}
                </span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard; 