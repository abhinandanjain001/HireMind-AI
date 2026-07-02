import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts";
import { SourcingAnalytics } from "../types";

interface ChartsProps {
  data: SourcingAnalytics;
}

const COLORS = ["#06b6d4", "#3b82f6", "#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#14b8a6", "#10b981"];

export default function AnalyticsCharts({ data }: ChartsProps) {
  const {
    topSkills = [],
    experienceDistribution = [],
    behaviorDistribution = [],
    educationDistribution = [],
    pipelineFunnel = [],
    featureImportance = []
  } = data;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-950/90 backdrop-blur-md border border-white/10 p-3 rounded-lg shadow-xl">
          <p className="font-display font-semibold text-sm text-slate-200">{label}</p>
          <p className="text-cyan-400 font-mono text-xs mt-1">
            {payload[0].name}: <span className="font-bold">{payload[0].value.toLocaleString()}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Upper Grid - Funnel & Top Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Funnel */}
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden border border-white/10">
          <h3 className="font-display text-lg font-semibold mb-4 text-slate-200">AI Sourcing Pipeline Funnel</h3>
          <p className="text-xs text-slate-400 mb-6">Scale representation from scanning 100,000+ profiles down to the shortlisted Top-100 candidates.</p>
          
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={pipelineFunnel}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" horizontal={false} />
                <XAxis type="number" stroke="#64748b" fontSize={11} tickFormatter={(v) => v >= 1000 ? `${v/1000}k` : v} />
                <YAxis dataKey="step" type="category" stroke="#64748b" fontSize={11} width={120} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="url(#barGradient)" radius={[0, 4, 4, 0]} barSize={24}>
                  {pipelineFunnel.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 4 ? "#3b82f6" : "#06b6d4"} fillOpacity={1 - index * 0.15} />
                  ))}
                </Bar>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Matching Skills */}
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden border border-white/10">
          <h3 className="font-display text-lg font-semibold mb-4 text-slate-200">Sourcing Talent Skill Matrix</h3>
          <p className="text-xs text-slate-400 mb-6">Frequency count of core skills matched among the high-ranking candidate shortlist.</p>
          
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topSkills} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} angle={-30} textAnchor="end" height={50} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#06b6d4" radius={[4, 4, 0, 0]} barSize={20}>
                  {topSkills.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Middle Grid - Seniority, Engagement & School Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Seniority Years */}
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden border border-white/10">
          <h3 className="font-display text-base font-semibold mb-4 text-slate-200">Seniority Curve (Experience)</h3>
          <div className="h-60 flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={experienceDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {experienceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend layout="horizontal" align="center" verticalAlign="bottom" iconSize={8} iconType="circle" wrapperStyle={{ fontSize: 10, color: "#94a3b8" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Engagement Level */}
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden border border-white/10">
          <h3 className="font-display text-base font-semibold mb-4 text-slate-200">On-Platform Behavior Heat</h3>
          <div className="h-60 flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={behaviorDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={80}
                  paddingAngle={0}
                  dataKey="value"
                >
                  {behaviorDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend layout="horizontal" align="center" verticalAlign="bottom" iconSize={8} iconType="circle" wrapperStyle={{ fontSize: 10, color: "#94a3b8" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* School tiers */}
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden border border-white/10">
          <h3 className="font-display text-base font-semibold mb-4 text-slate-200">Academic Backgrounds</h3>
          <div className="h-60 flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={educationDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {educationDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 4) % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend layout="horizontal" align="center" verticalAlign="bottom" iconSize={8} iconType="circle" wrapperStyle={{ fontSize: 10, color: "#94a3b8" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Feature Importance Area Chart */}
      <div className="glass-panel p-6 rounded-2xl relative overflow-hidden border border-white/10">
        <h3 className="font-display text-lg font-semibold mb-2 text-slate-200">AI Ranking Feature Weights</h3>
        <p className="text-xs text-slate-400 mb-6">Visualizes the weighted index applied by the scoring engine to determine the Final AI Score.</p>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={featureImportance} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={9} interval={0} angle={-15} textAnchor="end" height={40} />
              <YAxis stroke="#64748b" fontSize={11} domain={[0, 30]} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="weight" name="Model Weight (%)" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#areaGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
