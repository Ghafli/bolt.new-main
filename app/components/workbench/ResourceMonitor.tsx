import { forwardRef } from 'react';
import { useWebContainer } from '~/app/lib/webcontainer';
import styles from './ResourceMonitor.module.scss';

type ResourceMonitorProps = {
  className?: string;
};

export const ResourceMonitor = forwardRef<HTMLDivElement, ResourceMonitorProps>(
  ({ className }, ref) => {
    const { cpu, memory } = useWebContainer();
    return (
      <div ref={ref} className={styles.resourceMonitor}>
        <span className={styles.label}>CPU</span>
        <span>{cpu?.toFixed(2) ?? 0}%</span>
        <span className={styles.label}>Memory</span>
        <span>{memory?.toFixed(2) ?? 0}%</span>
      </div>
    );
  },
);
