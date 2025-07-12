import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, TrendingUp, Target, Heart, Trash2 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function AnalyticsDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: analytics, isLoading } = useQuery({
    queryKey: ['/api/waitlist/analytics'],
  });

  const { data: responses } = useQuery({
    queryKey: ['/api/waitlist/responses'],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/waitlist/${id}`, null);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/waitlist/responses'] });
      queryClient.invalidateQueries({ queryKey: ['/api/waitlist/analytics'] });
      queryClient.invalidateQueries({ queryKey: ['/api/waitlist/count'] });
      toast({
        title: "Success",
        description: "Response deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete response",
        variant: "destructive",
      });
    },
  });

  const COLORS = {
    spiritual_blue: '#3B82F6',
    spiritual_emerald: '#10B981',
    spiritual_amber: '#F59E0B',
    spiritual_purple: '#8B5CF6',
    spiritual_red: '#EF4444',
    spiritual_cyan: '#06B6D4',
    spiritual_pink: '#EC4899',
    spiritual_orange: '#F97316',
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!analytics) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">No analytics data available</p>
        </CardContent>
      </Card>
    );
  }

  const formatLabel = (key: string) => {
    return key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  // Transform data for charts
  const getChartData = (distribution: Record<string, number>) => {
    return Object.entries(distribution || {}).map(([key, value], index) => ({
      name: formatLabel(key),
      value,
      color: Object.values(COLORS)[index % Object.values(COLORS).length]
    }));
  };

  const ageChartData = getChartData(analytics?.ageDistribution || {});
  const prayerChartData = getChartData(analytics?.prayerFrequencyDistribution || {});
  const arabicChartData = getChartData(analytics?.arabicUnderstandingDistribution || {});
  const arInterestChartData = getChartData(analytics?.arInterestDistribution || {});
  const featuresChartData = getChartData(analytics?.featuresDistribution || {});

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
            <Users className="h-4 w-4 text-spiritual-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-spiritual-blue">{analytics.totalResponses}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Prayers</CardTitle>
            <Target className="h-4 w-4 text-spiritual-emerald" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-spiritual-emerald">
              {analytics.prayerFrequencyDistribution?.['5_times_daily'] || 0}
            </div>
            <p className="text-xs text-muted-foreground">Pray 5 times daily</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Very Interested</CardTitle>
            <Heart className="h-4 w-4 text-spiritual-amber" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-spiritual-amber">
              {analytics.arInterestDistribution?.['very_interested'] || 0}
            </div>
            <p className="text-xs text-muted-foreground">In AR technology</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+12%</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
      </div>

      {/* Visual Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Age Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Age Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ageChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {ageChartData.map((entry, index) => (
                      <Cell key={`age-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Prayer Frequency Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Prayer Frequency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={prayerChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {prayerChartData.map((entry, index) => (
                      <Cell key={`prayer-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Arabic Understanding Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Arabic Understanding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={arabicChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {arabicChartData.map((entry, index) => (
                      <Cell key={`arabic-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* AR Interest Donut Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">AR Technology Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={arInterestChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {arInterestChartData.map((entry, index) => (
                      <Cell key={`ar-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Features Bar Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Most Requested Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={featuresChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={12}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill={COLORS.spiritual_blue} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Popular Features */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Most Requested Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(analytics.featuresDistribution || {})
              .sort(([,a], [,b]) => b - a)
              .map(([feature, count]) => (
                <div key={feature} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">{formatLabel(feature)}</span>
                  <Badge className="bg-spiritual-blue">{count} requests</Badge>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* All Waitlist Responses with Detailed View */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Waitlist Responses ({responses?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {responses?.map((response: any) => (
              <div key={response.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                {/* Header Section */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-spiritual-dark">{response.fullName}</h4>
                    <p className="text-sm text-gray-600">{response.email}</p>
                    <p className="text-xs text-gray-500">
                      Submitted: {new Date(response.submittedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex flex-wrap gap-2">
                      {response.age && <Badge variant="outline">{response.age}</Badge>}
                      {response.role && <Badge variant="secondary">{response.role}</Badge>}
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteMutation.mutate(response.id)}
                      disabled={deleteMutation.isPending}
                      className="ml-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Prayer & Learning Profile */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-xs font-medium text-blue-800 mb-1">Prayer Frequency</p>
                    <p className="text-sm text-blue-700">{formatLabel(response.prayerFrequency || 'Not specified')}</p>
                  </div>
                  <div className="bg-emerald-50 p-3 rounded-lg">
                    <p className="text-xs font-medium text-emerald-800 mb-1">Arabic Understanding</p>
                    <p className="text-sm text-emerald-700">{formatLabel(response.arabicUnderstanding || 'Not specified')}</p>
                  </div>
                  <div className="bg-amber-50 p-3 rounded-lg">
                    <p className="text-xs font-medium text-amber-800 mb-1">Understanding Difficulty</p>
                    <p className="text-sm text-amber-700">{formatLabel(response.understandingDifficulty || 'Not specified')}</p>
                  </div>
                </div>

                {/* Learning & Technology Interest */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <p className="text-xs font-medium text-purple-800 mb-1">Learning Struggle</p>
                    <p className="text-sm text-purple-700">{formatLabel(response.learningStruggle || 'Not specified')}</p>
                  </div>
                  <div className="bg-indigo-50 p-3 rounded-lg">
                    <p className="text-xs font-medium text-indigo-800 mb-1">AR Technology Impact</p>
                    <p className="text-sm text-indigo-700">{formatLabel(response.arInterest || 'Not specified')}</p>
                  </div>
                </div>

                {/* Features Requested */}
                {response.features && response.features.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-700 mb-2">Requested Features:</p>
                    <div className="flex flex-wrap gap-2">
                      {response.features.map((feature: string, index: number) => (
                        <Badge key={index} className="bg-spiritual-blue text-white">
                          {formatLabel(feature)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Insights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {response.importance && (
                    <div>
                      <span className="font-medium text-gray-600">Importance:</span>
                      <p className="text-gray-500">{formatLabel(response.importance)}</p>
                    </div>
                  )}
                  {response.likelihood && (
                    <div>
                      <span className="font-medium text-gray-600">Likelihood to Try:</span>
                      <p className="text-gray-500">{formatLabel(response.likelihood)}</p>
                    </div>
                  )}
                  {response.interviewWillingness && (
                    <div>
                      <span className="font-medium text-gray-600">Interview Willingness:</span>
                      <p className="text-gray-500">{formatLabel(response.interviewWillingness)}</p>
                    </div>
                  )}
                </div>

                {/* Additional Feedback */}
                {response.additionalFeedback && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs font-medium text-gray-700 mb-1">Additional Feedback:</p>
                    <p className="text-sm text-gray-600 italic">"{response.additionalFeedback}"</p>
                  </div>
                )}
              </div>
            ))}
            
            {(!responses || responses.length === 0) && (
              <div className="text-center py-8 text-gray-500">
                <p>No waitlist responses yet.</p>
                <p className="text-sm">Responses will appear here as users complete the waitlist form.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
