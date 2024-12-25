import { forwardRef, useCallback } from 'react';
import { useWebContainer } from '~/app/lib/webcontainer';
import { IconButton } from '../ui/IconButton';
import { PortDropdown } from './PortDropdown';
import styles from './PortManager.module.scss';

type PortManagerProps = {
  className?: string;
};

export const PortManager = forwardRef<HTMLDivElement, PortManagerProps>(
  ({ className }, ref) => {
    const { isRunning, startPort, stopPort } = useWebContainer();

    const handleStartPort = useCallback(async () => {
      await startPort();
    }, [startPort]);

    const handleStopPort = useCallback(async () => {
      await stopPort();
    }, [stopPort]);

    return (
      <div ref={ref} className={styles.portManager}>
        <PortDropdown />
        <IconButton
          title="Start port"
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
                d="M2.66667 1.33334L1.33333 2.66667V13.3333L2.66667 14.6667H13.3333L14.6667 13.3333V2.66667L13.3333 1.33334H2.66667ZM2.66667 2.66667H13.3333V13.3333H2.66667V2.66667ZM12 12V4H4V12H12ZM10.6667 12V4H5.33333V12H10.6667Z"
                fill="currentColor"
              />
            </svg>
          }
          onClick={handleStartPort}
        />
        <IconButton
          title="Stop port"
          disabled={!isRunning}
          icon={
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.66667 1.33334L1.33333 2.66667V13.3333L2.66667 14.6667H13.3333L14.6667 13.3333V2.66667L13.3333 1.33334H2.66667ZM2.66667 2.66667H13.3333V13.3333H2.66667V2.66667ZM12 12V4H4V12H12ZM10.6667 12V4H5.33333V12H10.6667ZM6.66667 8H9.33333V10H6.66667V8ZM6.66667 4H9.33333V6H6.66667V4Z"
                fill="currentColor"
              />
            </svg>
          }
          onClick={handleStopPort}
        />
      </div>
    );
  },
);
