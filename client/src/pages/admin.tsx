import { AnalyticsDashboard } from "@/components/analytics-dashboard";
import { TestCharts } from "@/components/test-charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function Admin() {
  return (
    <div className="min-h-screen bg-spiritual-light">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-spiritual-dark">Admin Dashboard</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-spiritual-dark">AR Rahman Waitlist Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Monitor waitlist signups, analyze user responses, and track engagement metrics.
            </p>
          </CardContent>
        </Card>

        <TestCharts />
        <AnalyticsDashboard />
      </main>
    </div>
  );
}
