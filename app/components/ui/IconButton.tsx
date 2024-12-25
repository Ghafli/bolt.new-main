import { forwardRef } from 'react';
import styles from './IconButton.module.scss';
import { classNames } from '~/app/utils/classNames';

type IconButtonProps = {
  icon: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  small?: boolean;
  ariaLabel?: string;
  title?: string;
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, onClick, className, disabled, small, ariaLabel, title }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        onClick={onClick}
        className={classNames(styles.iconButton, className, {
          [styles.small]: small,
        })}
        aria-label={ariaLabel}
        title={title}
      >
        {icon}
      </button>
    );
  },
);
