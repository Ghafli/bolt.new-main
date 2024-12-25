import { forwardRef } from 'react';
import styles from './FileBreadcrumb.module.scss';
import { classNames } from '~/app/utils/classNames';

type FileBreadcrumbProps = {
  segments: string[];
  className?: string;
  onClick?: (index: number) => void;
};

export const FileBreadcrumb = forwardRef<HTMLDivElement, FileBreadcrumbProps>(
  ({ segments, className, onClick }, ref) => {
    return (
      <div ref={ref} className={classNames(styles.breadcrumb, className)}>
        {segments.map((segment, index) => (
          <button
            key={index}
            className={styles.segment}
            onClick={() => onClick?.(index)}
          >
            {segment}
          </button>
        ))}
      </div>
    );
  },
);
