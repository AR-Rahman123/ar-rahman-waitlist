import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, ArrowLeft, Users, TrendingUp, Target, Heart, Download, Trash2, Database, CheckSquare, Square, FileSpreadsheet } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export function SimpleAdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [responses, setResponses] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [selectedResponses, setSelectedResponses] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const { toast } = useToast();

  // Check authentication status on component mount only once
  useEffect(() => {
    let mounted = true;
    
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/api/admin/status', {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok && mounted) {
          const data = await response.json();
          if (data.authenticated) {
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      }
    };
    
    checkAuthStatus();
    
    return () => {
      mounted = false;
    };
  }, []);

  // Load dashboard data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated]);

  const loadDashboardData = async () => {
    setDataLoading(true);
    try {
      console.log('🔄 Starting dashboard data load...');
      
      const [analyticsRes, responsesRes] = await Promise.all([
        fetch('/api/waitlist/analytics', {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        }),
        fetch('/api/waitlist/responses', {
          credentials: 'include', 
          headers: { 
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        })
      ]);

      console.log('📡 API Response Status:', { 
        analytics: { status: analyticsRes.status, ok: analyticsRes.ok },
        responses: { status: responsesRes.status, ok: responsesRes.ok }
      });

      if (analyticsRes.ok && responsesRes.ok) {
        const analyticsData = await analyticsRes.json();
        const responsesData = await responsesRes.json();
        
        console.log('✅ Raw Response Data:', {
          analyticsTotal: analyticsData?.totalResponses,
          responsesType: typeof responsesData,
          responsesIsArray: Array.isArray(responsesData),
          responsesLength: responsesData?.length,
          firstResponse: responsesData?.[0]
        });
        
        // Debug: Log the exact API response size
        console.log('🔍 EXACT API RESPONSE DEBUG:', {
          responseHeaders: responsesRes.headers.get('content-length'),
          responseContentType: responsesRes.headers.get('content-type'),
          responseCache: responsesRes.headers.get('cache-control'),
          fullResponseData: responsesData
        });
        
        setAnalytics(analyticsData);
        setResponses(responsesData);
        
        console.log('🎯 State Updated - Dashboard loaded with:', { 
          analyticsTotal: analyticsData.totalResponses,
          responsesInState: responsesData.length,
          allResponseIds: responsesData.map(r => r.id),
          allNames: responsesData.map(r => r.full_name || r.fullName)
        });

        // Table view of all responses for debugging
        console.table(responsesData.map(r => ({
          id: r.id,
          name: r.full_name || r.fullName,
          email: r.email
        })));
      } else {
        console.error('❌ API Response Failed:', { 
          analyticsStatus: analyticsRes.status, 
          responsesStatus: responsesRes.status,
          analyticsText: await analyticsRes.text(),
          responsesText: await responsesRes.text()
        });
        
        if (analyticsRes.status === 401 || responsesRes.status === 401) {
          console.error('🔐 Authentication failed - redirecting to login');
          toast({
            title: "Session Expired",
            description: "Please login again",
            variant: "destructive",
          });
          setIsAuthenticated(false);
        } else {
          toast({
            title: "Data Load Error",
            description: "Failed to load dashboard data",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Dashboard data error:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setDataLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password.trim()) {
      toast({
        title: "Error",
        description: "Please enter the admin password",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Admin login successful, loading data...');
        setIsAuthenticated(true);
        toast({
          title: "Success",
          description: "Admin authentication successful",
        });
        // Wait a moment for session to persist then load data
        setTimeout(() => {
          console.log('🔄 Loading dashboard data after login...');
          loadDashboardData();
          
          // Manual data reload after successful login
          setTimeout(() => {
            console.log('🔄 Manual reload after login success...');
            loadDashboardData();
          }, 100);
        }, 200);
      } else {
        toast({
          title: "Access Denied",
          description: "Invalid admin password",
          variant: "destructive",
        });
        setPassword('');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Authentication failed. Please try again.",
        variant: "destructive",
      });
      setPassword('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { 
        method: 'POST',
        credentials: 'include'
      });
      setIsAuthenticated(false);
      setResponses([]);
      setAnalytics(null);
      toast({
        title: "Logged Out",
        description: "You have been safely logged out",
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/waitlist/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        await loadDashboardData(); // Reload data
        toast({
          title: "Success",
          description: "Response deleted successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete response",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Error",
        description: "Failed to delete response",
        variant: "destructive",
      });
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await fetch('/api/backup/export-csv', {
        credentials: 'include',
        headers: { 'Accept': 'text/csv' }
      });

      if (response.ok) {
        const csvContent = await response.text();
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'waitlist-responses-server.csv';
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);

        toast({
          title: "Success",
          description: "Server CSV export downloaded successfully",
        });
      } else {
        console.error('CSV Export failed:', response.status, await response.text());
        toast({
          title: "Export Error",
          description: `CSV export failed: ${response.status}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('CSV Export error:', error);
      toast({
        title: "Export Error",
        description: "Failed to download CSV file",
        variant: "destructive",
      });
    }
  };

  const handleExportExcel = () => {
    // Convert responses to Excel-friendly format and download
    const excelData = responses.map(r => ({
      'ID': r.id,
      'Full Name': r.full_name || r.fullName,
      'Email': r.email,
      'Role': r.role,
      'Age': r.age,
      'Prayer Frequency': r.prayer_frequency || r.prayerFrequency,
      'Arabic Understanding': r.arabic_understanding || r.arabicUnderstanding,
      'Understanding Difficulty': r.understanding_difficulty || r.understandingDifficulty,
      'Importance': r.importance,
      'Learning Struggle': r.learning_struggle || r.learningStruggle,
      'Current Approach': r.current_approach || r.currentApproach,
      'AR Experience': r.ar_experience || r.arExperience,
      'AR Interest': r.ar_interest || r.arInterest,
      'Features': Array.isArray(r.features) ? r.features.join('; ') : r.features,
      'Likelihood': r.likelihood,
      'Additional Feedback': r.additional_feedback || r.additionalFeedback,
      'Interview Willingness': r.interview_willingness || r.interviewWillingness,
      'Investor Presentation': r.investor_presentation || r.investorPresentation,
      'Additional Comments': r.additional_comments || r.additionalComments,
      'Created At': new Date(r.created_at || r.createdAt).toLocaleDateString()
    }));

    // Create CSV content for Excel
    const headers = Object.keys(excelData[0] || {});
    const csvContent = [
      headers.join(','),
      ...excelData.map(row => 
        headers.map(header => `"${(row[header] || '').toString().replace(/"/g, '""')}"`).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'waitlist-responses.csv';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    toast({
      title: "Success",
      description: "Excel file downloaded successfully",
    });
  };

  const handleBackup = async () => {
    try {
      const response = await fetch('/api/backup/create', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Database backup created successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to create backup",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Backup error:', error);
      toast({
        title: "Error",
        description: "Failed to create backup",
        variant: "destructive",
      });
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedResponses([]);
    } else {
      setSelectedResponses(responses.map(r => r.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectResponse = (id) => {
    if (selectedResponses.includes(id)) {
      setSelectedResponses(selectedResponses.filter(responseId => responseId !== id));
    } else {
      setSelectedResponses([...selectedResponses, id]);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedResponses.length === 0) {
      toast({
        title: "Warning",
        description: "Please select responses to delete",
        variant: "destructive",
      });
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedResponses.length} response(s)? This action cannot be undone.`)) {
      return;
    }

    try {
      for (const id of selectedResponses) {
        await fetch(`/api/waitlist/${id}`, {
          method: 'DELETE',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });
      }

      await loadDashboardData();
      setSelectedResponses([]);
      setSelectAll(false);
      
      toast({
        title: "Success",
        description: `${selectedResponses.length} response(s) deleted successfully`,
      });
    } catch (error) {
      console.error('Bulk delete error:', error);
      toast({
        title: "Error",
        description: "Failed to delete responses",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-blue-950 to-indigo-950 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-black/20 backdrop-blur-lg border-purple-500/20">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">Admin Access</CardTitle>
            <p className="text-purple-200">Enter your credentials to access the dashboard</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-purple-200">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-black/20 border-purple-500/30 text-white placeholder:text-purple-300"
                  placeholder="Enter admin password"
                  disabled={isLoading}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                disabled={isLoading}
              >
                {isLoading ? "Authenticating..." : "Access Dashboard"}
              </Button>
            </form>
            <div className="mt-6 pt-4 border-t border-purple-500/20">
              <Link href="/">
                <Button variant="ghost" className="w-full text-purple-200 hover:text-white hover:bg-purple-500/20">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderDashboard = () => {
    if (dataLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
            <p className="text-purple-200">Loading dashboard data...</p>
          </div>
        </div>
      );
    }

    const totalResponses = analytics?.totalResponses || responses.length || 0;

    // Color scheme for charts
    const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#ec4899', '#84cc16'];

    // Prepare chart data
    const ageData = analytics?.ageDistribution ? Object.entries(analytics.ageDistribution).map(([name, value]) => ({ name, value })) : [];
    const prayerData = analytics?.prayerFrequencyDistribution ? Object.entries(analytics.prayerFrequencyDistribution).map(([name, value]) => ({ name, value })) : [];

    return (
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-black/20 backdrop-blur-lg border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-purple-400" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-purple-200">Total Responses</p>
                  <p className="text-2xl font-bold text-white">{totalResponses}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-lg border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-blue-400" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-purple-200">Completion Rate</p>
                  <p className="text-2xl font-bold text-white">100%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-lg border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Target className="h-8 w-8 text-green-400" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-purple-200">Target Progress</p>
                  <p className="text-2xl font-bold text-white">{Math.round((totalResponses / 100) * 100)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-lg border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Heart className="h-8 w-8 text-pink-400" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-purple-200">Engagement</p>
                  <p className="text-2xl font-bold text-white">High</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Age Distribution */}
          <Card className="bg-black/20 backdrop-blur-lg border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white">Age Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={ageData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {ageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Prayer Frequency */}
          <Card className="bg-black/20 backdrop-blur-lg border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white">Prayer Frequency</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={prayerData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Responses Table */}
        <Card className="bg-black/20 backdrop-blur-lg border-purple-500/20">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-white">All Responses ({responses.length})</CardTitle>
              <div className="flex gap-2">
                <Button 
                  onClick={handleExportCSV}
                  variant="outline" 
                  size="sm"
                  className="border-purple-500/30 text-purple-200 hover:bg-purple-500/20"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
                <Button 
                  onClick={handleExportExcel}
                  variant="outline" 
                  size="sm"
                  className="border-green-500/30 text-green-200 hover:bg-green-500/20"
                >
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Export Excel
                </Button>
                <Button 
                  onClick={handleBackup}
                  variant="outline" 
                  size="sm"
                  className="border-blue-500/30 text-blue-200 hover:bg-blue-500/20"
                >
                  <Database className="w-4 h-4 mr-2" />
                  Backup
                </Button>
                {selectedResponses.length > 0 && (
                  <Button 
                    onClick={handleBulkDelete}
                    variant="outline" 
                    size="sm"
                    className="border-red-500/30 text-red-400 hover:bg-red-500/20"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Selected ({selectedResponses.length})
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-purple-500/20">
                    <th className="text-left py-2 text-purple-200">
                      <div className="flex items-center space-x-2">
                        <button onClick={handleSelectAll} className="text-purple-200 hover:text-white">
                          {selectAll ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                        </button>
                        <span>Select All</span>
                      </div>
                    </th>
                    <th className="text-left py-2 text-purple-200">Name</th>
                    <th className="text-left py-2 text-purple-200">Email</th>
                    <th className="text-left py-2 text-purple-200">Age</th>
                    <th className="text-left py-2 text-purple-200">Prayer Frequency</th>
                    <th className="text-left py-2 text-purple-200">Date</th>
                    <th className="text-left py-2 text-purple-200">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {responses.map((response) => (
                    <tr key={response.id} className="border-b border-purple-500/10">
                      <td className="py-2">
                        <button 
                          onClick={() => handleSelectResponse(response.id)}
                          className="text-purple-200 hover:text-white"
                        >
                          {selectedResponses.includes(response.id) ? 
                            <CheckSquare className="w-4 h-4" /> : 
                            <Square className="w-4 h-4" />
                          }
                        </button>
                      </td>
                      <td className="py-2 text-white">{response.full_name || response.fullName}</td>
                      <td className="py-2 text-purple-200">{response.email}</td>
                      <td className="py-2 text-purple-200">{response.age}</td>
                      <td className="py-2 text-purple-200">{response.prayer_frequency || response.prayerFrequency}</td>
                      <td className="py-2 text-purple-200">
                        {new Date(response.created_at || response.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-2">
                        <Button
                          onClick={() => handleDelete(response.id)}
                          variant="outline"
                          size="sm"
                          className="border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-blue-950 to-indigo-950">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <Button 
            onClick={handleLogout}
            variant="outline" 
            className="border-purple-500/30 text-purple-200 hover:bg-purple-500/20"
          >
            Logout
          </Button>
        </div>
        {renderDashboard()}
      </div>
    </div>
  );
}