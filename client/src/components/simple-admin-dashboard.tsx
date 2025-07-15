import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, ArrowLeft, Users, TrendingUp, Target, Heart, Download, Trash2 } from "lucide-react";
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
  const { toast } = useToast();

  // Load dashboard data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated]);

  const loadDashboardData = async () => {
    setDataLoading(true);
    try {
      const [analyticsRes, responsesRes] = await Promise.all([
        fetch('/api/waitlist/analytics'),
        fetch('/api/waitlist/responses')
      ]);

      if (analyticsRes.ok && responsesRes.ok) {
        const analyticsData = await analyticsRes.json();
        const responsesData = await responsesRes.json();
        
        setAnalytics(analyticsData);
        setResponses(responsesData);
        
        console.log('Dashboard loaded:', { 
          analytics: analyticsData, 
          responsesCount: responsesData.length 
        });
      } else {
        toast({
          title: "Warning",
          description: "Some dashboard data failed to load",
          variant: "destructive",
        });
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
        body: JSON.stringify({ password }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsAuthenticated(true);
        toast({
          title: "Success",
          description: "Admin authentication successful",
        });
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
      await fetch('/api/admin/logout', { method: 'POST' });
      setIsAuthenticated(false);
      toast({
        title: "Logged Out",
        description: "You have been safely logged out",
      });
    } catch (error) {
      console.error('Logout error:', error);
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
                  onClick={() => window.open('/api/backup/export-csv', '_blank')}
                  variant="outline" 
                  size="sm"
                  className="border-purple-500/30 text-purple-200 hover:bg-purple-500/20"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-purple-500/20">
                    <th className="text-left py-2 text-purple-200">Name</th>
                    <th className="text-left py-2 text-purple-200">Email</th>
                    <th className="text-left py-2 text-purple-200">Age</th>
                    <th className="text-left py-2 text-purple-200">Prayer Frequency</th>
                    <th className="text-left py-2 text-purple-200">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {responses.map((response) => (
                    <tr key={response.id} className="border-b border-purple-500/10">
                      <td className="py-2 text-white">{response.fullName}</td>
                      <td className="py-2 text-purple-200">{response.email}</td>
                      <td className="py-2 text-purple-200">{response.age}</td>
                      <td className="py-2 text-purple-200">{response.prayerFrequency}</td>
                      <td className="py-2 text-purple-200">
                        {new Date(response.createdAt).toLocaleDateString()}
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