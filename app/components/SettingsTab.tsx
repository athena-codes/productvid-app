import { Settings, Sparkles } from "lucide-react";

export default function SettingsTab() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] text-center px-4">
      <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center mb-6 relative">
        <Settings className="w-10 h-10 text-blue-500" />
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-2">Settings Coming Soon</h3>
      <p className="text-slate-500 max-w-md mb-6">
        We're working on bringing you powerful customization options. Stay tuned for video quality settings, branding options, and more!
      </p>
      <div className="inline-flex px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
        Launching soon
      </div>
    </div>
  );
}
