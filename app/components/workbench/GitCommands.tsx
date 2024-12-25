import { forwardRef, useCallback } from 'react';
import { useWebContainer } from '~/app/lib/webcontainer';
import { IconButton } from '../ui/IconButton';
import styles from './GitCommands.module.scss';

type GitCommandsProps = {
  className?: string;
};

export const GitCommands = forwardRef<HTMLDivElement, GitCommandsProps>(
  ({ className }, ref) => {
    const { isRunning, gitStatus, gitAdd, gitCommit, gitPull } = useWebContainer();
    const handleGitAdd = useCallback(async () => {
      await gitAdd();
    }, [gitAdd]);

    const handleGitCommit = useCallback(async () => {
      await gitCommit();
    }, [gitCommit]);

    const handleGitPull = useCallback(async () => {
      await gitPull();
    }, [gitPull]);

    return (
      <div ref={ref} className={styles.gitCommands}>
        <IconButton
          title="Stage all changes"
          disabled={isRunning}
          icon={
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 1.33334C4.459 1.33334 1.333 4.45934 1.333 8.00001C1.333 11.5407 4.459 14.6667 8 14.6667C11.541 14.6667 14.667 11.5407 14.667 8.00001C14.667 4.45934 11.541 1.33334 8 1.33334ZM8 13.3334C5.202 13.3334 2.667 10.7987 2.667 8.00001C2.667 5.20134 5.202 2.66668 8 2.66668C10.798 2.66668 13.333 5.20134 13.333 8.00001C13.333 10.7987 10.798 13.3334 8 13.3334ZM8 4.66668V7.33334H5.33333V8.66668H8V11.3334L10.667 8.00001L8 4.66668Z"
                fill="currentColor"
              />
            </svg>
          }
          onClick={handleGitAdd}
        />
        <IconButton
          title="Commit changes"
          disabled={isRunning || !gitStatus?.length}
          icon={
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.7833 5.33333L9.33333 7.78333L7.91667 6.36667L9.78333 4.5L11.7833 5.33333ZM11.0417 1.33334L11.7833 0.591675L15.4083 4.21668L14.6667 4.95834L11.0417 1.33334ZM11.7833 10.6667L9.33333 8.21668L7.91667 9.63335L9.78333 11.5L11.7833 10.6667ZM11.0417 14.6667L11.7833 15.4083L15.4083 11.7833L14.6667 11.0417L11.0417 14.6667ZM7.91667 11.25L7.33333 11.8333L7.33333 15.3333L11.4167 15.3333L11.9917 14.7583L7.91667 11.25ZM4.74167 11.775L4.16667 11.2L2.16667 13.1917L3.05833 14.0833L4.74167 11.775ZM4.675 1.6L4.09167 2.175L2.075 0.158325L2.94167 1.04166L4.675 1.6ZM7.33333 4.66667L7.33333 1.33333L3.25 1.33333L3.25 5.41667L3.825 6L7.33333 4.66667ZM7.33333 8.66667L7.33333 12L3.25 12L3.25 7.91667L3.825 7.34167L7.33333 8.66667Z"
                fill="currentColor"
              />
            </svg>
          }
          onClick={handleGitCommit}
        />

        <IconButton
          title="Pull changes"
          disabled={isRunning}
          icon={
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.6667 2.83334V6.33334H16L12.6667 2.83334ZM14 7.66668C13.2083 7.66668 12.475 7.97084 11.95 8.48334C11.425 9.00001 11.1667 9.73334 11.1667 10.6667C11.1667 11.6001 11.425 12.3334 11.95 12.85C12.475 13.3667 13.2083 13.6667 14 13.6667C14.7917 13.6667 15.525 13.3667 16.05 12.85C16.575 12.3334 16.8333 11.6001 16.8333 10.6667H15.3333C15.3333 11.0667 15.1917 11.425 14.9583 11.65C14.725 11.8833 14.3917 12 14 12C13.6083 12 13.275 11.8833 13.0417 11.65C12.8083 11.4167 12.6667 11.0667 12.6667 10.6667C12.6667 10.2667 12.8083 9.91668 13.0417 9.68334C13.275 9.45001 13.6083 9.33334 14 9.33334C14.3917 9.33334 14.725 9.45001 14.9583 9.68334C15.1917 9.91668 15.3333 10.2667 15.3333 10.6667H16.8333C16.8333 9.73334 16.575 9.00001 16.05 8.48334C15.525 7.97084 14.7917 7.66668 14 7.66668ZM5.66667 13.1667L9.16667 16L5.66667 12.5L4.83333 11.6667L8.33333 14.5L5.66667 13.1667ZM1.99998 8.33334L0 6.33334H3.33331V2.83334L0.99998 5.16668L1.99998 6.33334V8.33334Z"
                fill="currentColor"
              />
            </svg>
          }
          onClick={handleGitPull}
        />
      </div>
    );
  },
);
