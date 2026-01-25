import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { promoteSelfToAdmin } from "../lib/userApi";
import { Shield, CheckCircle, XCircle } from "lucide-react";

export default function PromoteAdmin() {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePromote = async () => {
    if (!user) {
      setError("Please sign in first");
      return;
    }

    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const result = await promoteSelfToAdmin();
      setMessage(result.message);
      // Refresh user data to get updated role
      await refreshUser();
      // Redirect to admin dashboard after 2 seconds
      setTimeout(() => {
        window.location.href = "/admin";
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to promote to admin");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-xl text-slate-600 mb-4">Please sign in first</div>
          <a href="/" className="text-indigo-600 hover:text-indigo-700 underline">
            Go to Home
          </a>
        </div>
      </div>
    );
  }

  if (user.role === "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">You're Already an Admin!</h1>
          <p className="text-slate-600 mb-6">Your account has admin privileges.</p>
          <a
            href="/admin"
            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go to Admin Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full">
        <div className="text-center mb-6">
          <Shield className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Promote to Admin</h1>
          <p className="text-slate-600">
            Your email: <span className="font-semibold">{user.email}</span>
          </p>
        </div>

        {message && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="text-green-800 text-sm">{message}</div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="text-red-800 text-sm">{error}</div>
          </div>
        )}

        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-lg text-sm text-slate-600">
            <p className="mb-2">
              <strong>Note:</strong> This will only work if your email is in the <code>ADMIN_EMAILS</code> environment variable on the backend.
            </p>
            <p>
              If you see an error, make sure your email (<code>{user.email}</code>) is listed in the backend's <code>.env</code> file.
            </p>
          </div>

          <button
            onClick={handlePromote}
            disabled={loading}
            className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Promoting...
              </>
            ) : (
              <>
                <Shield className="w-5 h-5" />
                Promote Me to Admin
              </>
            )}
          </button>

          <a
            href="/dashboard"
            className="block text-center text-sm text-slate-600 hover:text-slate-900 underline"
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
