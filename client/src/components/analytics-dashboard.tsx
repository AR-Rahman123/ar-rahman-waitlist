import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, Target, Heart } from "lucide-react";

export function AnalyticsDashboard() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['/api/waitlist/analytics'],
  });

  const { data: responses } = useQuery({
    queryKey: ['/api/waitlist/responses'],
  });

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

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Age Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Age Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(analytics.ageDistribution || {}).map(([age, count]) => (
                <div key={age} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{age}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-spiritual-blue h-2 rounded-full"
                        style={{ width: `${(count / analytics.totalResponses) * 100}%` }}
                      />
                    </div>
                    <Badge variant="secondary">{count}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Prayer Frequency */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Prayer Frequency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(analytics.prayerFrequencyDistribution || {}).map(([freq, count]) => (
                <div key={freq} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{formatLabel(freq)}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-spiritual-emerald h-2 rounded-full"
                        style={{ width: `${(count / analytics.totalResponses) * 100}%` }}
                      />
                    </div>
                    <Badge variant="secondary">{count}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Arabic Understanding */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Arabic Understanding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(analytics.arabicUnderstandingDistribution || {}).map(([level, count]) => (
                <div key={level} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{formatLabel(level)}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-spiritual-amber h-2 rounded-full"
                        style={{ width: `${(count / analytics.totalResponses) * 100}%` }}
                      />
                    </div>
                    <Badge variant="secondary">{count}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AR Interest */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">AR Interest Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(analytics.arInterestDistribution || {}).map(([interest, count]) => (
                <div key={interest} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{formatLabel(interest)}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: `${(count / analytics.totalResponses) * 100}%` }}
                      />
                    </div>
                    <Badge variant="secondary">{count}</Badge>
                  </div>
                </div>
              ))}
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

      {/* Recent Responses */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Responses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {responses?.slice(0, 5).map((response: any) => (
              <div key={response.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{response.fullName}</p>
                  <p className="text-sm text-gray-600">{response.email}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(response.submittedAt).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant="outline">{response.age || 'N/A'}</Badge>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatLabel(response.arInterest || 'unknown')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
