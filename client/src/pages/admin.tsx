import { AnalyticsDashboard } from "@/components/analytics-dashboard";
import { TestCharts } from "@/components/test-charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function Admin() {
  console.log("Admin component rendering");
  
  return (
    <div className="min-h-screen bg-red-100">
      <div className="p-8">
        <h1 className="text-4xl font-bold text-red-600 mb-4">ADMIN PAGE TEST</h1>
        <div className="bg-yellow-200 p-4 mb-4 border-2 border-black">
          <p className="text-2xl">If you can see this, the admin page is working!</p>
        </div>
        
        <div className="bg-blue-200 p-4 mb-4">
          <h2 className="text-xl font-bold">Component Test:</h2>
          <TestCharts />
        </div>
        
        <div className="bg-green-200 p-4">
          <h2 className="text-xl font-bold">Dashboard:</h2>
          <AnalyticsDashboard />
        </div>
      </div>
    </div>
  );
}
