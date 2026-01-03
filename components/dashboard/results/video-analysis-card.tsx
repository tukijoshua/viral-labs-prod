"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { AlertTriangle } from "lucide-react";

interface VideoAnalysisCardProps {
  viewerInterest: {
    timestamps: number[];
    scores: number[];
  };
  dropZones: {
    timestamp: number;
    reason: string;
  }[];
}

export function VideoAnalysisCard({ viewerInterest, dropZones }: VideoAnalysisCardProps) {
  // Transform data for recharts
  const chartData = viewerInterest.timestamps.map((timestamp, index) => ({
    time: `${Math.floor(timestamp / 60)}:${String(timestamp % 60).padStart(2, '0')}`,
    score: viewerInterest.scores[index],
  }));

  return (
    <div className="bg-white rounded-lg shadow-quiet-lg border border-border p-8 space-y-8">
      {/* Viewer Interest Chart */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Viewer Interest Pulse</h2>
        <p className="text-muted-foreground mb-6">
          Real-time engagement prediction throughout your video
        </p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="time"
                stroke="#64748b"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke="#64748b"
                style={{ fontSize: '12px' }}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#0f172a"
                strokeWidth={3}
                dot={{ fill: '#0f172a', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Drop Zones */}
      <div>
        <h3 className="text-xl font-bold mb-4">Potential Drop Zones</h3>
        <div className="space-y-3">
          {dropZones.map((zone, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="font-medium font-data text-sm text-red-900 mb-1">
                  {Math.floor(zone.timestamp / 60)}:{String(zone.timestamp % 60).padStart(2, '0')}
                </div>
                <p className="text-sm text-red-800">{zone.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
