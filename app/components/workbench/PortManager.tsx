import React, { useState } from "react";
import { useWebContainer } from "@/app/lib/webcontainer";
import styles from "./PortManager.module.scss";
import { PanelHeader } from "@/app/components/ui/PanelHeader";
import { Dialog } from "@/app/components/ui/Dialog";


interface PortManagerProps {}

const PortManager: React.FC<PortManagerProps> = ({}) => {
    const { exposePort, getExposedPorts } = useWebContainer();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newPort, setNewPort] = useState("");
    const exposedPorts = getExposedPorts();

    const handleOpenDialog = () => {
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setNewPort("");
    };

    const handleExposePort = async () => {
        if(!newPort) {
            return;
        }

        await exposePort(parseInt(newPort, 10));
       handleCloseDialog();
    };
    return (
        <div className={styles.portManager}>
             <PanelHeader
                title="Ports"
            />
               <ul>
                    {exposedPorts?.map((port) => (
                        <li key={port}>{port}</li>
                    ))}
                </ul>
            <button onClick={handleOpenDialog}>Expose Port</button>
                 <Dialog isOpen={isDialogOpen} onClose={handleCloseDialog}>
                <h2>Expose a new Port</h2>
                 <input
                    type="text"
                    value={newPort}
                    onChange={(e) => setNewPort(e.target.value)}
                    placeholder="Port number"
                />
                <button onClick={handleExposePort}>Expose</button>
            </Dialog>
        </div>
    );
};

export default PortManager;
