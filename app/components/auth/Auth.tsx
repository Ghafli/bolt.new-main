import { useState } from "react";
import styles from "./Auth.module.scss";
import { Icon } from "../ui/IconButton";
import { useAuthStore } from "~/app/lib/stores/auth";
import { useWebcontainerAuth } from "~/app/lib/webcontainer/auth.client";
import { useThemeStore } from "~/app/lib/stores/theme";

export function Auth() {
  const { signIn, signUp, error } = useAuthStore();
  const { authenticate } = useWebcontainerAuth();
  const { theme } = useThemeStore();

  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await signIn();
      await authenticate();
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    try {
      await signUp();
      await authenticate();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.auth}>
      <Icon name="logo" className={styles.logo} />
      <p className={styles.description}>
        Bolt is a web-based IDE that runs directly in your browser. It uses a real
        container environment to provide a full-fledged development experience.
      </p>
      <button
        className={styles.sign_in_button}
        onClick={handleSignIn}
        disabled={loading}
      >
        {loading ? (
          "Signing in..."
        ) : (
          <>
            <Icon name="github" size="sm" />
            Sign in with GitHub
          </>
        )}
      </button>
      <div className={styles.separator}>or</div>
      <button
        className={styles.sign_up_button}
        onClick={handleSignUp}
        disabled={loading}
      >
        {loading ? (
          "Creating account..."
        ) : (
          <>
            <Icon name="github" size="sm" />
            Sign up with GitHub
          </>
        )}
      </button>
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
}
