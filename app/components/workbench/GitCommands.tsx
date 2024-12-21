import React from "react";
import { useTerminal } from "@/app/lib/stores/terminal";
import styles from "./GitCommands.module.scss";

interface GitCommandsProps {}

const GitCommands: React.FC<GitCommandsProps> = ({}) => {
  const { execute } = useTerminal();

  const handleGitInit = () => {
    execute("git init");
  };
  const handleGitAdd = () => {
    execute("git add .");
  };

  const handleGitCommit = () => {
      const message = prompt("Enter a commit message");
      if (message) {
          execute(`git commit -m "${message}"`);
      }
    };

    const handleGitPush = () => {
      const remote = prompt("Enter a remote to push (e.g origin main)");
        if(remote){
           execute(`git push ${remote}`)
        }
  };

  return (
    <div className={styles.gitCommands}>
      <button onClick={handleGitInit}>git init</button>
      <button onClick={handleGitAdd}>git add</button>
      <button onClick={handleGitCommit}>git commit</button>
        <button onClick={handleGitPush}>git push</button>
    </div>
  );
};

export default GitCommands;
