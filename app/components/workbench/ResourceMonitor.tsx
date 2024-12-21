import React, { useState, useEffect } from "react";
import { useWebContainer } from "@/app/lib/webcontainer";
import styles from "./ResourceMonitor.module.scss"

interface ResourceMonitorProps {}

const ResourceMonitor: React.FC<ResourceMonitorProps> = ({}) => {
    const { getResourceUsage } = useWebContainer();
    const [cpu, setCpu] = useState<number | null>(null);
    const [memory, setMemory] = useState<number | null>(null);

      useEffect(() => {
        const fetchResourceUsage = async () => {
          const usage = await getResourceUsage();
          if(usage){
            setCpu(usage.cpu);
            setMemory(usage.memory);
          }
        }

         fetchResourceUsage();
        const intervalId = setInterval(fetchResourceUsage, 5000);

      return () => clearInterval(intervalId);
    },[getResourceUsage])


	return (
		<div className={styles.resourceMonitor}>
             <div>CPU: {cpu !== null ? cpu.toFixed(2) : "N/A"}%</div>
             <div>Memory: {memory !== null ? memory.toFixed(2) : "N/A"}MB</div>
		</div>
	);
};

export default ResourceMonitor;
