import { Clock, Video } from "lucide-react";

export default function HistoryTab() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] text-center px-4">
      <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mb-6">
        <Clock className="w-10 h-10 text-slate-400" />
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-2">No videos yet</h3>
      <p className="text-slate-500 max-w-md mb-6">
        Your generated videos will appear here. Create your first video to get started!
      </p>
      <div className="flex gap-3">
        <div className="w-32 h-32 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center">
          <Video className="w-8 h-8 text-slate-300" />
        </div>
        <div className="w-32 h-32 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center">
          <Video className="w-8 h-8 text-slate-300" />
        </div>
        <div className="w-32 h-32 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center">
          <Video className="w-8 h-8 text-slate-300" />
        </div>
      </div>
    </div>
  );
}
