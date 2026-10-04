"use client";

import { useState } from "react";
import Link from "next/link";
import { Activity, ShieldAlert, CheckCircle, FolderGit2, ArrowUpRight, Zap, Check } from "lucide-react";

export default function DashboardOverview() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("as_live_8f92j3x9k1m0p4n5v6c7b8");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const metrics = [
    { label: "Global Health Score", value: "94%", change: "+2%", trend: "up", icon: Activity, color: "text-terminal-green" },
    { label: "Unresolved Slop", value: "12", change: "-5", trend: "down", icon: ShieldAlert, color: "text-[#ffbd2e]" },
    { label: "Pro Auto-Fixes", value: "842", change: "+120", trend: "up", icon: Zap, color: "text-[#27c93f]" },
    { label: "Active Projects", value: "3", change: "0", trend: "neutral", icon: FolderGit2, color: "text-white" },
  ];

  const recentScans = [
    { id: "scan-901", project: "frontend-core", time: "10 mins ago", status: "passed", issues: 0 },
    { id: "scan-900", project: "auth-service", time: "2 hours ago", status: "warning", issues: 4 },
    { id: "scan-899", project: "landing-page", time: "5 hours ago", status: "failed", issues: 12 },
    { id: "scan-898", project: "frontend-core", time: "Yesterday", status: "passed", issues: 0 },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-white mb-2">Dashboard</h1>
        <p className="text-white/50 font-mono text-sm">Welcome back. Here is the current state of your codebases.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, i) => (
          <div key={i} className="bg-[#0f0f13] border border-white/10 rounded-xl p-5 shadow-lg relative overflow-hidden group hover:border-white/20 transition-colors">
            {/* Background Accent */}
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/5 rounded-full blur-xl group-hover:bg-white/10 transition-colors" />
            
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-2 bg-white/5 rounded-lg">
                <metric.icon size={20} className={metric.color} />
              </div>
              <div className={`text-xs font-mono px-2 py-1 rounded-full ${
                metric.trend === 'up' ? 'bg-terminal-green/10 text-terminal-green' : 
                metric.trend === 'down' ? 'bg-[#ff5f56]/10 text-[#ff5f56]' : 
                'bg-white/5 text-white/50'
              }`}>
                {metric.change}
              </div>
            </div>
            
            <div className="relative z-10">
              <div className="text-3xl font-bold text-white mb-1 font-mono tracking-tight">{metric.value}</div>
              <div className="text-sm text-white/50">{metric.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Scans Table */}
        <div className="lg:col-span-2 bg-[#0f0f13] border border-white/10 rounded-xl shadow-lg overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-white/10 flex justify-between items-center bg-[#111]">
            <h2 className="text-lg font-semibold text-white">Recent CI Scans</h2>
            <Link href="/dashboard/reports" className="text-xs font-mono text-terminal-green hover:underline flex items-center gap-1">
              View All <ArrowUpRight size={14} />
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-mono uppercase tracking-widest text-white/40">
                  <th className="px-6 py-4 font-normal">Scan ID</th>
                  <th className="px-6 py-4 font-normal">Project</th>
                  <th className="px-6 py-4 font-normal">Status</th>
                  <th className="px-6 py-4 font-normal text-right">Issues</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {recentScans.map((scan, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4 font-mono text-white/70">
                      {scan.id}
                      <div className="text-[10px] text-white/30 mt-1">{scan.time}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-white">{scan.project}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {scan.status === 'passed' && <CheckCircle size={14} className="text-[#27c93f]" />}
                        {scan.status === 'warning' && <ShieldAlert size={14} className="text-[#ffbd2e]" />}
                        {scan.status === 'failed' && <ShieldAlert size={14} className="text-[#ff5f56]" />}
                        <span className="capitalize text-white/70">{scan.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`font-mono px-2.5 py-1 rounded-md text-xs ${
                        scan.issues === 0 ? 'bg-[#27c93f]/10 text-[#27c93f]' : 
                        scan.issues < 5 ? 'bg-[#ffbd2e]/10 text-[#ffbd2e]' : 
                        'bg-[#ff5f56]/10 text-[#ff5f56]'
                      }`}>
                        {scan.issues}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Action / Setup Card */}
        <div className="bg-[#0f0f13] border border-white/10 rounded-xl shadow-lg p-6 flex flex-col relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-terminal-green/20 blur-3xl rounded-full pointer-events-none" />
          
          <h2 className="text-lg font-semibold text-white mb-2">CLI Integration</h2>
          <p className="text-sm text-white/60 mb-6">Run AntiSlop locally in your CI/CD pipeline using your active organization token.</p>
          
          <div className="bg-[#0a0a0a] border border-white/10 rounded-lg p-4 mb-6">
            <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-2">Your API Token</div>
            <div className="flex items-center justify-between font-mono text-xs text-white/90 bg-[#111] px-3 py-2 rounded border border-white/5">
              <span>as_live_8f92j...</span>
              <button 
                onClick={handleCopy}
                className={`transition-colors flex items-center gap-1 ${copied ? 'text-[#27c93f]' : 'text-terminal-green hover:text-white'}`}
              >
                {copied ? <><Check size={14} /> Copied!</> : 'Copy'}
              </button>
            </div>
          </div>
          
          <div className="mt-auto">
            <Link href="/docs" className="w-full bg-white text-black hover:bg-white/90 font-mono font-bold text-sm py-3 rounded-lg transition-colors flex justify-center">
              Read Documentation
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
