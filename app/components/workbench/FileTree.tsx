--- a/app/components/workbench/FileTree.tsx
+++ b/app/components/workbench/FileTree.tsx
@@ -1,4 +1,4 @@
-import React, { useRef, useState } from "react";
+import React, { useRef, useState, useEffect } from "react";
 import { useFiles } from "@/app/lib/stores/files";
 import { useWebContainer } from "@/app/lib/webcontainer";
 import styles from "./FileTree.module.scss";
@@ -11,9 +11,17 @@
 const FileTree: React.FC = () => {
 	const fileInputRef = useRef<HTMLInputElement>(null);
     const folderInputRef = useRef<HTMLInputElement>(null);
-	const { files, setFiles } = useFiles();
+    const { files, setFiles } = useFiles();
 	const webContainer = useWebContainer();
     const [isUploading, setIsUploading] = useState(false);
+    const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);
+    const [newProjectName, setNewProjectName] = useState("");
+	const [selectedProject, setSelectedProject] = useState<string | null>(null);
+    const [projects, setProjects] = useState<string[]>([]);
+	 const {showToast} = useToast();
+     const showError = (message: string) => {
+        showToast({message, type: "error"})
+     }
 
 	const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
 		if (!e.target.files || e.target.files.length === 0) {
@@ -24,12 +32,19 @@
 		try {
 			for (const file of e.target.files) {
 				const buffer = await file.arrayBuffer();
-                const filePath = file.webkitRelativePath || file.name;
+				const filePath = (selectedProject ? `${selectedProject}/` : "") + (file.webkitRelativePath || file.name);
                 await webContainer?.writeFile(filePath, new Uint8Array(buffer));
             }
             const newFiles = await webContainer?.getFiles();
             if(newFiles){
-                setFiles(newFiles);
+                if(selectedProject){
+                   const filteredFiles =  newFiles.find((file) => file.type === "directory" && file.name === selectedProject)?.children;
+                   setFiles(filteredFiles || []);
+                }else{
+                    setFiles(newFiles);
+                }
+
             }
 		}
         catch(error){
@@ -39,7 +54,6 @@
         finally{
            setIsUploading(false)
         }
-
 	};
 
     const handleFolderUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
@@ -52,12 +66,18 @@
         try {
             for (const file of e.target.files) {
                 const buffer = await file.arrayBuffer();
-                const filePath = file.webkitRelativePath;
+                 const filePath = (selectedProject ? `${selectedProject}/` : "")+ file.webkitRelativePath;
                 await webContainer?.writeFile(filePath, new Uint8Array(buffer));
             }
             const newFiles = await webContainer?.getFiles();
             if(newFiles){
-                setFiles(newFiles);
+                if(selectedProject){
+                    const filteredFiles = newFiles.find((file) => file.type === "directory" && file.name === selectedProject)?.children
+                    setFiles(filteredFiles || []);
+                 }else{
+                     setFiles(newFiles);
+                 }
             }
         }
         catch(error){
@@ -77,6 +97,11 @@
     const handleUploadFolderButtonClick = () => {
         folderInputRef.current?.click();
     };
+    useEffect(() => {
+         (async () => {
+            const projects = await webContainer?.getFiles();
+        })();
+     },[webContainer])
 
 
 
@@ -101,10 +126,63 @@
 		));
 	};
 
+	const handleOpenNewProjectDialog = () => {
+		setIsNewProjectDialogOpen(true);
+	};
+
+	const handleCloseNewProjectDialog = () => {
+		setIsNewProjectDialogOpen(false);
+		setNewProjectName("");
+	};
+
+	const handleCreateNewProject = async () => {
+        if(!newProjectName){
+            return;
+        }
+        try{
+             await webContainer?.writeFile(newProjectName, new Uint8Array());
+            const newFiles = await webContainer?.getFiles();
+            if(newFiles){
+                const filteredProjects = newFiles.filter((file) => file.type === "directory").map((file) => file.name);
+                setProjects(filteredProjects);
+                  setSelectedProject(newProjectName);
+                    sessionStorage.setItem("selectedProject", newProjectName);
+            }
+        }catch(e){
+            showError("Error creating project");
+            console.error("Error creating project", e)
+        }
+
+		handleCloseNewProjectDialog();
+	};
+    const handleProjectSelect = async(event: React.ChangeEvent<HTMLSelectElement>) => {
+         const project = event.target.value;
+          try{
+             setSelectedProject(project);
+             sessionStorage.setItem("selectedProject", project);
+            const newFiles = await webContainer?.getFiles();
+            if(newFiles){
+                const filteredFiles = newFiles.find((file) => file.type === "directory" && file.name === project)?.children
+                setFiles(filteredFiles || []);
+             }
+        } catch(e){
+           showError("Error selecting project")
+             console.error("Error selecting project", e)
+         }
+    }
 	return (
 		<div className={styles.fileTreeContainer}>
             <div style={{marginBottom: "10px"}}>
                {isUploading && "Uploading..."}
+                <select value={selectedProject || ""} onChange={handleProjectSelect}>
+                   <option value="">Global</option>
+                    {projects.map(project => (
+                        <option key={project} value={project}>
+                            {project}
+                         </option>
+                   ))}
+                </select>
                <button onClick={handleUploadFileButtonClick}>Upload File</button>
                <button onClick={handleUploadFolderButtonClick}>Upload Folder</button>
             </div>
@@ -124,6 +202,17 @@
                  multiple
             />
 			{renderTree(files)}
+			<Dialog isOpen={isNewProjectDialogOpen} onClose={handleCloseNewProjectDialog}>
+				<h2>Create a New Project</h2>
+				<input
+					type="text"
+					value={newProjectName}
+					onChange={(e) => setNewProjectName(e.target.value)}
+					placeholder="Project name"
+				/>
+				<button onClick={handleCreateNewProject}>Create</button>
+			</Dialog>
+
 		</div>
 	);
 };
