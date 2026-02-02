"use client";

import { Video, Clock, Settings, User, Crown } from "lucide-react";

interface NavigationProps {
  activeTab: "generate" | "history" | "settings" | "account";
  onTabChange: (tab: "generate" | "history" | "settings" | "account") => void;
}

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const tabs = [
    { id: "generate" as const, label: "Generate", icon: Video, enabled: true },
    { id: "history" as const, label: "History", icon: Clock, enabled: false },
    { id: "settings" as const, label: "Settings", icon: Settings, enabled: false },
    { id: "account" as const, label: "Account", icon: User, enabled: false },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Video className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">ProductVid</span>
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full ml-2">
              Beta
            </span>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => tab.enabled && onTabChange(tab.id)}
                  disabled={!tab.enabled}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm
                    transition-all duration-200 relative
                    ${
                      isActive
                        ? "text-blue-600 bg-blue-50"
                        : tab.enabled
                        ? "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                        : "text-slate-400 cursor-not-allowed"
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {!tab.enabled && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded font-medium">
                      Soon
                    </span>
                  )}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white rounded-lg font-semibold text-sm transition-all shadow-sm hover:shadow">
              <Crown className="w-4 h-4" />
              Upgrade
            </button>
            <div className="w-9 h-9 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center cursor-pointer hover:from-slate-300 hover:to-slate-400 transition-all">
              <User className="w-5 h-5 text-slate-600" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
