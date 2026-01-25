import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { updateDisplayName } from "../lib/userApi";
import { Settings as SettingsIcon, User, Save, CheckCircle2, Loader2 } from "lucide-react";
import { Link } from "wouter";

export default function Settings() {
  const { user, isAuthenticated, refreshUser } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      // Use display_name if set, otherwise use name from Google
      const displayNameValue = (user as any).display_name || user.name || "";
      setDisplayName(displayNameValue);
    }
  }, [user]);

  const handleSave = async () => {
    if (!isAuthenticated || !user) {
      setError("You must be logged in to save settings");
      return;
    }

    setLoading(true);
    setError(null);
    setSaved(false);

    try {
      const updatedUser = await updateDisplayName(displayName.trim() || null);
      setSaved(true);
      // Refresh user context to get updated display_name
      try {
        if (refreshUser) {
          await refreshUser();
        }
      } catch (refreshError) {
        console.error("Failed to refresh user:", refreshError);
        // Continue anyway - the update was successful
      }
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      console.error("Failed to update display name:", err);
      setError(err.message || "Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Please log in to access settings</p>
          <Link href="/login">
            <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              Go to Login
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <button className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:text-slate-900 transition-all mb-6 hover:bg-white/80 rounded-2xl backdrop-blur-sm border border-slate-200/50 hover:border-slate-300 hover:shadow-lg group bg-white/60">
              <span className="font-semibold">← Back</span>
            </button>
          </Link>
          
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/50 overflow-hidden">
            <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-8 md:px-16 py-12 text-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-700/50 to-purple-700/50"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl mb-4 shadow-xl border border-white/30">
                  <SettingsIcon className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 drop-shadow-lg">
                  Settings
                </h1>
                <p className="text-white/95 text-lg font-medium">
                  Customize your experience
                </p>
              </div>
            </div>

            {/* Settings Content */}
            <div className="p-8 md:p-12">
              {/* Display Name Section */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Display Name</h2>
                    <p className="text-slate-600 text-sm">
                      Set a custom name for practice sessions. Leave empty to use your Google name.
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200/50 shadow-sm">
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Practice Session Name
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => {
                      setDisplayName(e.target.value);
                      setSaved(false);
                      setError(null);
                    }}
                    placeholder={user.name || "Enter your name"}
                    className="w-full px-5 py-4 border-2 border-slate-300 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 outline-none bg-white text-slate-900 placeholder:text-slate-400 font-semibold shadow-sm hover:shadow-md"
                  />
                  <p className="mt-3 text-xs text-slate-500">
                    This name will be automatically filled in the "Your Name" field on the practice page.
                    {!displayName && ` Currently using: ${user.name}`}
                  </p>
                </div>

                {error && (
                  <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 text-sm">
                    {error}
                  </div>
                )}

                {saved && (
                  <div className="mt-4 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-green-700 text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Settings saved successfully!</span>
                  </div>
                )}

                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="mt-6 w-full px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>Save Settings</span>
                    </>
                  )}
                </button>
              </div>

              {/* Info Section */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200/50">
                <h3 className="text-lg font-bold text-slate-900 mb-2">About Display Name</h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 mt-1">•</span>
                    <span>Your display name is used in practice sessions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 mt-1">•</span>
                    <span>If not set, your Google account name will be used</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 mt-1">•</span>
                    <span>The name field on the practice page will auto-fill with your display name</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

