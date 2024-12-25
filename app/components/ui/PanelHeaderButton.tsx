import { forwardRef } from 'react';
import styles from './PanelHeaderButton.module.scss';
import { classNames } from '~/app/utils/classNames';

type PanelHeaderButtonProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

export const PanelHeaderButton = forwardRef<HTMLButtonElement, PanelHeaderButtonProps>(
  ({ children, className, onClick }, ref) => {
    return (
      <button
        ref={ref}
        className={classNames(styles.panelHeaderButton, className)}
        onClick={onClick}
      >
        {children}
      </button>
    );
  },
);
