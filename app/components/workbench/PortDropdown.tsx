import { forwardRef, useCallback, useState } from 'react';
import styles from './PortDropdown.module.scss';
import { useWorkbench } from '~/app/lib/stores/workbench';
import { classNames } from '~/app/utils/classNames';

type PortDropdownProps = {
  className?: string;
};

export const PortDropdown = forwardRef<HTMLDivElement, PortDropdownProps>(
  ({ className }, ref) => {
    const { ports, selectedPort, selectPort } = useWorkbench();
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = useCallback(() => {
      setIsOpen((prev) => !prev);
    }, [setIsOpen]);

    const handleSelect = useCallback(
      (port: number) => {
        selectPort(port);
        setIsOpen(false);
      },
      [selectPort, setIsOpen],
    );
    const activePort = ports.find((port) => port === selectedPort);
    const label = activePort ? `Port ${activePort}` : 'No port selected';

    return (
      <div ref={ref} className={classNames(styles.portDropdown, className)}>
        <button onClick={handleToggle} className={styles.button}>
          {label}
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={classNames(styles.icon, { [styles.open]: isOpen })}
          >
            <path d="M8 10.06L3.94 6L12.06 6L8 10.06Z" fill="currentColor" />
          </svg>
        </button>
        {isOpen && (
          <div className={styles.menu}>
            {ports.length ? (
              ports.map((port) => (
                <button
                  key={port}
                  className={classNames(styles.menuItem, {
                    [styles.active]: port === selectedPort,
                  })}
                  onClick={() => handleSelect(port)}
                >
                  {`Port ${port}`}
                </button>
              ))
            ) : (
              <div className={styles.menuItem}>No ports available</div>
            )}
          </div>
        )}
      </div>
    );
  },
);
