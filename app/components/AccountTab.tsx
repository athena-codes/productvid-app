import { User, Shield, CreditCard, Bell } from "lucide-react";

export default function AccountTab() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] text-center px-4">
      <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mb-6">
        <User className="w-10 h-10 text-slate-500" />
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-2">Account Management</h3>
      <p className="text-slate-500 max-w-md mb-8">
        User authentication and account features are coming soon. You'll be able to save your work, manage subscriptions, and more.
      </p>
      <div className="grid grid-cols-3 gap-4 max-w-2xl w-full">
        <div className="card p-6 text-left opacity-50">
          <Shield className="w-6 h-6 text-slate-400 mb-3" />
          <h4 className="font-semibold text-slate-900 mb-1">Profile</h4>
          <p className="text-sm text-slate-500">Personal info</p>
        </div>
        <div className="card p-6 text-left opacity-50">
          <CreditCard className="w-6 h-6 text-slate-400 mb-3" />
          <h4 className="font-semibold text-slate-900 mb-1">Billing</h4>
          <p className="text-sm text-slate-500">Plans & payments</p>
        </div>
        <div className="card p-6 text-left opacity-50">
          <Bell className="w-6 h-6 text-slate-400 mb-3" />
          <h4 className="font-semibold text-slate-900 mb-1">Notifications</h4>
          <p className="text-sm text-slate-500">Email preferences</p>
        </div>
      </div>
    </div>
  );
}
