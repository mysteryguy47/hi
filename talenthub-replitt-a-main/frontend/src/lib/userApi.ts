// User API client - SIMPLIFIED
// Use relative URL for Vite proxy in dev, or explicit URL from env
const API_BASE = import.meta.env.VITE_API_BASE || "/api";

// Helper to safely read response (can only read once!)
async function readResponse<T = any>(res: Response): Promise<T> {
  const text = await res.text();
  if (!res.ok) {
    try {
      const error = JSON.parse(text);
      throw new Error(error.detail || error.message || `Request failed: ${res.status}`);
    } catch (e) {
      if (e instanceof Error && e.message.includes('Request failed')) throw e;
      throw new Error(text || `Request failed: ${res.status}`);
    }
  }
  return text ? JSON.parse(text) : null;
}

export interface User {
  id: number;
  email: string;
  name: string;
  display_name?: string;
  avatar_url?: string;
  role: string;
  total_points: number;
  current_streak: number;
  longest_streak: number;
  created_at: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface PracticeSessionData {
  operation_type: string;
  difficulty_mode: string;
  total_questions: number;
  correct_answers: number;
  wrong_answers: number;
  accuracy: number;
  score: number;
  time_taken: number;
  points_earned: number;
  attempts: Array<{
    question_data: any;
    user_answer: number | null;
    correct_answer: number;
    is_correct: boolean;
    time_taken: number;
    question_number: number;
  }>;
}

export interface PracticeSession {
  id: number;
  operation_type: string;
  difficulty_mode: string;
  total_questions: number;
  correct_answers: number;
  wrong_answers: number;
  accuracy: number;
  score: number;
  time_taken: number;
  points_earned: number;
  started_at: string;
  completed_at?: string;
}

export interface Attempt {
  id: number;
  question_data: any;
  user_answer: number | null;
  correct_answer: number;
  is_correct: boolean;
  time_taken: number;
  question_number: number;
  created_at: string;
}

export interface PracticeSessionDetail extends PracticeSession {
  attempts: Attempt[];
}

export interface PaperAttempt {
  id: number;
  paper_title: string;
  paper_level: string;
  total_questions: number;
  correct_answers: number;
  wrong_answers: number;
  accuracy: number;
  score: number;
  time_taken: number | null;
  points_earned: number;
  started_at: string;
  completed_at: string | null;
}

export interface StudentStats {
  total_sessions: number;
  total_questions: number;
  total_correct: number;
  total_wrong: number;
  overall_accuracy: number;
  total_points: number;
  current_streak: number;
  longest_streak: number;
  badges: string[];
  recent_sessions: PracticeSession[];
  recent_paper_attempts?: PaperAttempt[];
}

export interface AdminStats {
  total_students: number;
  total_sessions: number;
  total_questions: number;
  average_accuracy: number;
}

export interface LeaderboardEntry {
  rank: number;
  user_id: number;
  name: string;
  avatar_url?: string;
  total_points?: number;
  weekly_points?: number;
}

// Get auth token from localStorage
function getAuthToken(): string | null {
  return localStorage.getItem("auth_token");
}

// Set auth token
export function setAuthToken(token: string): void {
  localStorage.setItem("auth_token", token);
}

// Remove auth token
export function removeAuthToken(): void {
  localStorage.removeItem("auth_token");
}

// Get headers with auth
function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

// Test backend connection
async function testBackendConnection(baseUrl: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout for health check
    
    const res = await fetch(`${baseUrl}/health`, {
      method: "GET",
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return res.ok;
  } catch {
    return false;
  }
}

// Login with Google OAuth token - SIMPLIFIED with checkpoint logging
export async function loginWithGoogle(token: string): Promise<LoginResponse> {
  console.log("🔵 [LOGIN] CHECKPOINT 1: Login started");
  console.log("🔵 [LOGIN] Token length:", token.length);
  console.log("🔵 [LOGIN] API_BASE:", API_BASE);
  
  const loginUrl = `${API_BASE}/users/login`;
  console.log("🔵 [LOGIN] CHECKPOINT 2: Using URL:", loginUrl);
  
  try {
    console.log("🔵 [LOGIN] CHECKPOINT 3: Starting fetch request...");
    
    // Single attempt with clear timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log("❌ [LOGIN] CHECKPOINT TIMEOUT: Request took >10s, aborting");
      controller.abort();
    }, 10000); // 10 second timeout
    
    const startTime = Date.now();
    const res = await fetch(loginUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    const duration = Date.now() - startTime;
    console.log(`🔵 [LOGIN] CHECKPOINT 4: Response received in ${duration}ms, status:`, res.status);
    
    // Read response body ONCE (can't read twice!)
    console.log("🔵 [LOGIN] CHECKPOINT 5: Reading response body...");
    const responseText = await res.text();
    console.log("🔵 [LOGIN] CHECKPOINT 5.5: Response body length:", responseText.length);
    
    if (!res.ok) {
      console.log("❌ [LOGIN] CHECKPOINT ERROR: Response not OK");
      let errorMessage = "Login failed";
      try {
        const errorData = JSON.parse(responseText);
        console.error("❌ [LOGIN] Error data:", errorData);
        errorMessage = errorData.detail || errorData.message || errorMessage;
      } catch (e) {
        console.error("❌ [LOGIN] Error text (not JSON):", responseText);
        errorMessage = responseText || errorMessage;
      }
      throw new Error(errorMessage);
    }
    
    const data = JSON.parse(responseText);
    console.log("🔵 [LOGIN] CHECKPOINT 6: Response parsed, access_token present:", !!data.access_token);
    
    if (!data.access_token) {
      console.error("❌ [LOGIN] No access_token in response:", data);
      throw new Error("No access token in response");
    }
    
    console.log("🔵 [LOGIN] CHECKPOINT 7: Setting auth token...");
    setAuthToken(data.access_token);
    console.log("✅ [LOGIN] CHECKPOINT 8: Login successful!");
    return data;
  } catch (error: any) {
    console.error("❌ [LOGIN] CHECKPOINT FAILED:", error);
    console.error("❌ [LOGIN] Error name:", error.name);
    console.error("❌ [LOGIN] Error message:", error.message);
    
    if (error.name === 'AbortError') {
      throw new Error("Request timed out. Backend is not responding.\n\nPlease check:\n1. Backend is running: docker-compose ps\n2. Backend logs: docker-compose logs backend");
    }
    
    // Re-throw with better message
    if (error.message) {
      throw error;
    }
    throw new Error(`Login failed: ${error.toString()}`);
  }
}

// Update display name
export async function updateDisplayName(displayName: string | null): Promise<User> {
  const res = await fetch(`${API_BASE}/users/me/display-name`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ display_name: displayName }),
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    try {
      const errorJson = JSON.parse(errorText);
      throw new Error(errorJson.detail || errorJson.message || "Failed to update display name");
    } catch (e) {
      throw new Error(errorText || "Failed to update display name");
    }
  }
  
  return readResponse<User>(res);
}

// Get current user
export async function getCurrentUser(): Promise<User> {
  console.log("🟡 [API] getCurrentUser called");
  const token = getAuthToken();
  console.log("🟡 [API] Token present:", !!token);
  if (token) {
    console.log("🟡 [API] Token length:", token.length);
    console.log("🟡 [API] Token (first 20 chars):", token.substring(0, 20) + "...");
  }
  console.log("🟡 [API] API_BASE:", API_BASE);
  console.log("🟡 [API] Full URL:", `${API_BASE}/users/me`);
  
  const headers = getAuthHeaders();
  console.log("🟡 [API] Headers:", { ...headers, Authorization: headers.Authorization ? `${headers.Authorization.substring(0, 30)}...` : 'None' });
  
  const res = await fetch(`${API_BASE}/users/me`, {
    headers: headers,
  });
  
  console.log("🟡 [API] Response status:", res.status);
  console.log("🟡 [API] Response OK:", res.ok);
  
  if (res.status === 401) {
    const errorText = await res.text();
    console.log("❌ [API] 401 Unauthorized - token invalid");
    console.log("❌ [API] Error response:", errorText);
    console.log("❌ [API] Removing token and user_data");
    removeAuthToken();
    localStorage.removeItem("user_data");
    throw new Error("Unauthorized");
  }
  
  if (!res.ok) {
    console.log("❌ [API] Response not OK:", res.status);
    const responseText = await res.text();
    console.log("❌ [API] Error response:", responseText);
    
    // If 404, the endpoint might not exist (router not included)
    if (res.status === 404) {
      throw new Error("Endpoint not found - user router may not be loaded");
    }
    
    throw new Error(`Failed to get user: ${res.status} - ${responseText.substring(0, 100)}`);
  }
  
  const user = await readResponse<User>(res);
  console.log("✅ [API] User fetched:", user.email);
  // Update stored user data
  localStorage.setItem("user_data", JSON.stringify(user));
  return user;
}

// Save practice session
export async function savePracticeSession(session: PracticeSessionData): Promise<any> {
  console.log("🟡 [API] savePracticeSession called");
  console.log("🟡 [API] Session data:", {
    operation_type: session.operation_type,
    total_questions: session.total_questions,
    correct_answers: session.correct_answers,
    attempts_count: session.attempts.length
  });
  
  const res = await fetch(`${API_BASE}/users/practice-session`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(session),
  });
  
  console.log("🟡 [API] Save response status:", res.status);
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error("❌ [API] Save failed:", res.status, errorText);
    try {
      const errorJson = JSON.parse(errorText);
      throw new Error(errorJson.detail || errorJson.message || "Failed to save practice session");
    } catch (e) {
      throw new Error(errorText || "Failed to save practice session");
    }
  }
  
  const data = await readResponse(res);
  console.log("✅ [API] Practice session saved successfully!");
  return data;
}

// Get student stats
export async function getStudentStats(): Promise<StudentStats> {
  console.log("🟡 [API] getStudentStats called");
  const res = await fetch(`${API_BASE}/users/stats`, {
    headers: getAuthHeaders(),
  });
  console.log("🟡 [API] Stats response status:", res.status);
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error("❌ [API] Stats failed:", res.status, errorText);
    try {
      const errorJson = JSON.parse(errorText);
      throw new Error(errorJson.detail || errorJson.message || "Failed to get stats");
    } catch (e) {
      throw new Error(errorText || "Failed to get stats");
    }
  }
  
  const data = await readResponse<StudentStats>(res);
  console.log("✅ [API] Stats loaded:", {
    total_points: data.total_points,
    total_sessions: data.total_sessions,
    recent_sessions: data.recent_sessions.length
  });
  return data;
}

// Get overall leaderboard
export async function getOverallLeaderboard(): Promise<LeaderboardEntry[]> {
  const res = await fetch(`${API_BASE}/users/leaderboard/overall`, {
    headers: getAuthHeaders(),
  });
  return readResponse<LeaderboardEntry[]>(res);
}

// Get weekly leaderboard
export async function getWeeklyLeaderboard(): Promise<LeaderboardEntry[]> {
  const res = await fetch(`${API_BASE}/users/leaderboard/weekly`, {
    headers: getAuthHeaders(),
  });
  return readResponse<LeaderboardEntry[]>(res);
}

// Admin: Get all students
export async function getAllStudents(): Promise<User[]> {
  const res = await fetch(`${API_BASE}/users/admin/students`, {
    headers: getAuthHeaders(),
  });
  return readResponse<User[]>(res);
}

// Admin: Get admin stats
export async function getAdminStats(): Promise<AdminStats> {
  const res = await fetch(`${API_BASE}/users/admin/stats`, {
    headers: getAuthHeaders(),
  });
  return readResponse<AdminStats>(res);
}

// Admin: Get student stats
export async function getStudentStatsAdmin(studentId: number): Promise<StudentStats> {
  const res = await fetch(`${API_BASE}/users/admin/students/${studentId}/stats`, {
    headers: getAuthHeaders(),
  });
  return readResponse<StudentStats>(res);
}

// Admin: Delete student
export async function deleteStudent(studentId: number): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/users/admin/students/${studentId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return readResponse<{ message: string }>(res);
}

// Admin: Update student points
export async function updateStudentPoints(studentId: number, points: number): Promise<{ message: string; old_points: number; new_points: number }> {
  const res = await fetch(`${API_BASE}/users/admin/students/${studentId}/points`, {
    method: "PUT",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ points }),
  });
  return readResponse<{ message: string; old_points: number; new_points: number }>(res);
}

// Admin: Refresh leaderboard
export async function refreshLeaderboard(): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/users/admin/leaderboard/refresh`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  return readResponse<{ message: string }>(res);
}

// Admin: Get database stats
export interface DatabaseStats {
  total_users: number;
  total_students: number;
  total_admins: number;
  total_sessions: number;
  total_paper_attempts: number;
  total_rewards: number;
  total_papers: number;
  database_size_mb: number;
}

export async function getDatabaseStats(): Promise<DatabaseStats> {
  const res = await fetch(`${API_BASE}/users/admin/database/stats`, {
    headers: getAuthHeaders(),
  });
  return readResponse<DatabaseStats>(res);
}

// Promote self to admin (if email is in ADMIN_EMAILS)
export async function promoteSelfToAdmin(): Promise<{ message: string; email: string; role: string }> {
  const res = await fetch(`${API_BASE}/users/admin/promote-self`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  return readResponse<{ message: string; email: string; role: string }>(res);
}

// Get practice session details with attempts
export async function getPracticeSessionDetail(sessionId: number): Promise<PracticeSessionDetail> {
  const res = await fetch(`${API_BASE}/users/practice-session/${sessionId}`, {
    headers: getAuthHeaders(),
  });
  return readResponse<PracticeSessionDetail>(res);
}

// Student Profile Types
export interface StudentProfile {
  id: number;
  user_id: number;
  public_id: string | null;
  internal_uuid: string;
  full_name: string | null;
  display_name: string | null;
  class_name: string | null;
  course: string | null;
  level_type: string | null;
  level: string | null;
  branch: string | null;
  status: string;
  join_date: string | null;
  finish_date: string | null;
  parent_contact_number: string | null;
  created_at: string;
  updated_at: string;
}

export interface StudentProfileUpdate {
  full_name?: string | null;
  display_name?: string | null;
  class_name?: string | null;
  course?: string | null;
  level_type?: string | null;
  level?: string | null;
  branch?: string | null;
  status?: string;
  join_date?: string | null;
  finish_date?: string | null;
  parent_contact_number?: string | null;
}export interface ProfileAuditLog {
  id: number;
  profile_id: number;
  changed_by_user_id: number;
  changed_by_name: string | null;
  field_name: string;
  old_value: string | null;
  new_value: string | null;
  change_reason: string | null;
  created_at: string;
}

// Get current user's student profile
export async function getStudentProfile(): Promise<StudentProfile> {
  const res = await fetch(`${API_BASE}/users/profile`, {
    headers: getAuthHeaders(),
  });
  return readResponse<StudentProfile>(res);
}

// Get student profile by user ID
export async function getStudentProfileById(userId: number): Promise<StudentProfile> {
  const res = await fetch(`${API_BASE}/users/profile/${userId}`, {
    headers: getAuthHeaders(),
  });
  return readResponse<StudentProfile>(res);
}

// Update student profile (admin only)
export async function updateStudentProfile(profileData: StudentProfileUpdate): Promise<StudentProfile> {
  const res = await fetch(`${API_BASE}/users/profile`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(profileData),
  });
  return readResponse<StudentProfile>(res);
}// Update student profile by user ID (admin only)
export async function updateStudentProfileById(userId: number, profileData: StudentProfileUpdate): Promise<StudentProfile> {
  const res = await fetch(`${API_BASE}/users/profile/${userId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(profileData),
  });
  return readResponse<StudentProfile>(res);
}

// Get profile audit logs (admin only)
export async function getProfileAuditLogs(userId: number): Promise<ProfileAuditLog[]> {
  const res = await fetch(`${API_BASE}/users/profile/${userId}/audit-logs`, {
    headers: getAuthHeaders(),
  });
  return readResponse<ProfileAuditLog[]>(res);
}// Get valid levels for a course and level type
export async function getValidLevels(course: string, levelType: string): Promise<{ levels: string[] }> {
  const res = await fetch(`${API_BASE}/users/valid-levels?course=${encodeURIComponent(course)}&level_type=${encodeURIComponent(levelType)}`, {
    headers: getAuthHeaders(),
  });
  return readResponse<{ levels: string[] }>(res);
}