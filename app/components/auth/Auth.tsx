// app/components/auth/Auth.tsx
import React, { useState } from 'react';
import { useAuth } from "@/app/lib/stores/auth";
import styles from "./Auth.module.scss";
import { Dialog } from '@/app/components/ui/Dialog';


interface AuthProps {}
const Auth: React.FC<AuthProps> = ({}) => {
  const { signUp, signIn, user, signOut } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
    const [isSignInOpen, setIsSignInOpen] = useState(false);

    const handleOpenSignUp = () => {
        setIsSignUpOpen(true)
    };

     const handleCloseSignUp = () => {
        setIsSignUpOpen(false);
        setUsername("");
        setPassword("");
    };
      const handleOpenSignIn = () => {
        setIsSignInOpen(true)
    };

     const handleCloseSignIn = () => {
        setIsSignInOpen(false);
         setUsername("");
         setPassword("");
    };

  const handleSignUp = async () => {
    if (!username || !password) {
        return;
    }
    await signUp({username, password})
        handleCloseSignUp();
  };

  const handleSignIn = async () => {
      if (!username || !password) {
            return;
        }
    await signIn({username, password})
         handleCloseSignIn();
  };
  const handleSignOut = async () => {
        await signOut();
  };

    if(user){
      return (
           <div className={styles.auth}>
               <span>{user.username}</span>
                <button onClick={handleSignOut}>Sign Out</button>
            </div>
        )
    }
  return (
      <div className={styles.auth}>
          <button onClick={handleOpenSignUp}>Sign Up</button>
          <button onClick={handleOpenSignIn}>Sign In</button>
          <Dialog isOpen={isSignUpOpen} onClose={handleCloseSignUp}>
                <h2>Sign Up</h2>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                />
                 <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />
                 <button onClick={handleSignUp}>Sign Up</button>
            </Dialog>
             <Dialog isOpen={isSignInOpen} onClose={handleCloseSignIn}>
                <h2>Sign In</h2>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                />
                 <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />
                 <button onClick={handleSignIn}>Sign In</button>
            </Dialog>
        </div>
  );
};

export default Auth;
