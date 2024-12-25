import { forwardRef } from 'react';
import styles from './PanelHeader.module.scss';
import { classNames } from '~/app/utils/classNames';

type PanelHeaderProps = {
  children?: React.ReactNode;
  className?: string;
};
export const PanelHeader = forwardRef<HTMLDivElement, PanelHeaderProps>(
  ({ children, className }, ref) => {
    return (
      <div ref={ref} className={classNames(styles.panelHeader, className)}>
        {children}
      </div>
    );
  },
);
