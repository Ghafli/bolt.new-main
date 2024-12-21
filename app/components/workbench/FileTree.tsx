// app/components/workbench/FileTree.tsx
import React, { useRef, useState, useEffect } from "react";
import { useFiles } from "@/app/lib/stores/files";
import { useWebContainer } from "@/app/lib/webcontainer";
import styles from "./FileTree.module.scss";
import { PanelHeader } from "@/app/components/ui/PanelHeader";
import { IconButton } from "@/app/components/ui/IconButton";
import { Dialog } from "@/app/components/ui/Dialog";

interface File {
	name: string;
	type: "file" | "directory";
	children?: File[];
}

const FileTree: React.FC = () => {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const folderInputRef = useRef<HTMLInputElement>(null);
	const { files, setFiles } = useFiles();
	const webContainer = useWebContainer();
	const [isUploading, setIsUploading] = useState(false);
	const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);
	const [newProjectName, setNewProjectName] = useState("");
	const [selectedProject, setSelectedProject] = useState<string | null>(null);
    const [projects, setProjects] = useState<string[]>([]);

    useEffect(() => {
        const persistedProject = sessionStorage.getItem("selectedProject");
        if(persistedProject){
          setSelectedProject(persistedProject);
        }
        (async () => {
          if(webContainer){
                const projects = await webContainer.getFiles();
                if(projects){
                   const filteredProjects = projects.filter((file) => file.type === "directory").map((file) => file.name)
                  setProjects(filteredProjects);
               }
          }
       })();
     },[webContainer])

	const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files || e.target.files.length === 0) {
			return;
		}

		setIsUploading(true);
		try {
			for (const file of e.target.files) {
				const buffer = await file.arrayBuffer();
				const filePath = (selectedProject ? `${selectedProject}/` : "") + (file.webkitRelativePath || file.name);
				await webContainer?.writeFile(filePath, new Uint8Array(buffer));
			}
			const newFiles = await webContainer?.getFiles();
			if (newFiles) {
                if(selectedProject){
                   const filteredFiles =  newFiles.find((file) => file.type === "directory" && file.name === selectedProject)?.children;
                   setFiles(filteredFiles || []);
                }else{
                    setFiles(newFiles);
                }

			}
		} catch (error) {
			console.error("Error uploading file:", error);
		} finally {
			setIsUploading(false);
		}
	};

	const handleFolderUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files || e.target.files.length === 0) {
			return;
		}

		setIsUploading(true);
		try {
			for (const file of e.target.files) {
				const buffer = await file.arrayBuffer();
                 const filePath = (selectedProject ? `${selectedProject}/` : "")+ file.webkitRelativePath;
				await webContainer?.writeFile(filePath, new Uint8Array(buffer));
			}
			const newFiles = await webContainer?.getFiles();
			if (newFiles) {
                if(selectedProject){
                    const filteredFiles = newFiles.find((file) => file.type === "directory" && file.name === selectedProject)?.children
                    setFiles(filteredFiles || []);
                 }else{
                     setFiles(newFiles);
                 }
			}
		} catch (error) {
			console.error("Error uploading folder:", error);
		} finally {
			setIsUploading(false);
		}
	};

	const handleUploadFileButtonClick = () => {
		fileInputRef.current?.click();
	};

	const handleUploadFolderButtonClick = () => {
		folderInputRef.current?.click();
	};

	const renderTree = (files: File[], depth: number = 0) => {
		if (!files) {
			return null;
		}
		return files.map((file) => (
			<div
				key={file.name}
				className={styles.treeItem}
				style={{ paddingLeft: `${depth * 15}px` }}
			>
				{file.type === "directory" ? (
					<>
						<span>📁 {file.name}</span>
						{file.children && renderTree(file.children, depth + 1)}
					</>
				) : (
					<span>📄 {file.name}</span>
				)}
			</div>
		));
	};

	const handleOpenNewProjectDialog = () => {
		setIsNewProjectDialogOpen(true);
	};

	const handleCloseNewProjectDialog = () => {
		setIsNewProjectDialogOpen(false);
		setNewProjectName("");
	};

	const handleCreateNewProject = async () => {
        if(!newProjectName){
            return;
        }
       await webContainer?.writeFile(newProjectName, new Uint8Array());
        const newFiles = await webContainer?.getFiles();
        if(newFiles){
            const filteredProjects = newFiles.filter((file) => file.type === "directory").map((file) => file.name);
            setProjects(filteredProjects);
              setSelectedProject(newProjectName);
                sessionStorage.setItem("selectedProject", newProjectName);
        }

		handleCloseNewProjectDialog();
	};
    const handleProjectSelect = async(event: React.ChangeEvent<HTMLSelectElement>) => {
         const project = event.target.value;
         setSelectedProject(project);
         sessionStorage.setItem("selectedProject", project);
        const newFiles = await webContainer?.getFiles();
        if(newFiles){
            const filteredFiles = newFiles.find((file) => file.type === "directory" && file.name === project)?.children
            setFiles(filteredFiles || []);
         }
    }

	return (
		<div className={styles.fileTreeContainer}>
			<PanelHeader
				title="Files"
				actions={[
					<IconButton key="newProject" onClick={handleOpenNewProjectDialog}>
						➕
					</IconButton>,
				]}
			/>
			<div style={{ marginBottom: "10px" }}>
				{isUploading && "Uploading..."}
                <select value={selectedProject || ""} onChange={handleProjectSelect}>
                   <option value="">Global</option>
                    {projects.map(project => (
                        <option key={project} value={project}>
                            {project}
                         </option>
                   ))}
                </select>
				<button onClick={handleUploadFileButtonClick}>Upload File</button>
				<button onClick={handleUploadFolderButtonClick}>Upload Folder</button>
			</div>
			<input
				type="file"
				ref={fileInputRef}
				style={{ display: "none" }}
				onChange={handleFileUpload}
			/>
			<input
				type="file"
				ref={folderInputRef}
				style={{ display: "none" }}
				onChange={handleFolderUpload}
				webkitdirectory
				directory
				multiple
			/>
			{renderTree(files)}
			<Dialog isOpen={isNewProjectDialogOpen} onClose={handleCloseNewProjectDialog}>
				<h2>Create a New Project</h2>
				<input
					type="text"
					value={newProjectName}
					onChange={(e) => setNewProjectName(e.target.value)}
					placeholder="Project name"
				/>
				<button onClick={handleCreateNewProject}>Create</button>
			</Dialog>
		</div>
	);
};

export default FileTree;
