import { useState } from 'react';
import { Dialog } from '~/app/components/ui/Dialog';
import { useAuthStore } from '~/app/lib/stores/auth';
import styles from './Auth.module.scss';
import { LoadingDots } from '../ui/LoadingDots';

export function Auth() {
  const [error, setError] = useState<string | null>(null);
  const auth = useAuthStore((state) => state);

  const handleSignIn = async () => {
    setError(null);
    try {
      await auth.signIn();
    } catch (error: any) {
      setError(error?.message || 'Failed to sign in');
    }
  };

  return (
    <Dialog
      open={!auth.isAuthenticated}
      onClose={() => {}}
      title="Authentication"
    >
      <div className={styles['auth-dialog']}>
        <p className={styles.description}>
          Sign in to start using Bolt. Your changes will be saved to the cloud.
        </p>
        <button
          className={styles.button}
          onClick={handleSignIn}
          disabled={auth.isLoading}
        >
          {auth.isLoading ? (
            <span className={styles['loading-message']}>
              Signing In <LoadingDots />
            </span>
          ) : (
            'Sign in with GitHub'
          )}
        </button>
        {error && <div className={styles.error}>{error}</div>}
      </div>
    </Dialog>
  );
}