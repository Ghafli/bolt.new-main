import { useState } from 'react';
import styles from './Auth.module.scss';
import { useAuth } from '@/app/lib/stores/auth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';

export function Auth() {
  const { login, user, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

    if(user) {
        navigate('/');
        return null;
    }
  const handleLogin = async () => {
    if(!email || !password) {
      return;
    }
    await login(email, password);
  };

  return (
    <div className={styles.auth}>
      <h2>Sign In</h2>
      <Input
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
      />
      <Input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
      />
      <div className={styles.buttonContainer}>
        <Button onClick={handleLogin} disabled={loading}>
          Sign In
        </Button>
      </div>
    </div>
  );
}
