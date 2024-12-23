--- a/app/lib/stores/auth.ts
+++ b/app/lib/stores/auth.ts
@@ -11,7 +11,7 @@
     signOut: () => Promise<void>;
 }
 
-const AUTH_STORAGE_KEY = "auth-user"
+const AUTH_STORAGE_KEY = "auth-user";
 
 export const useAuth = create<AuthState>((set) => ({
      user: localStorage.getItem(AUTH_STORAGE_KEY) ? JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY)!) : null,
