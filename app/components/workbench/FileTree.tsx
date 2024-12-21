// app/components/workbench/FileTree.tsx
import React, { useRef, useState } from "react";
import { useFiles } from "@/app/lib/stores/files";
import { useWebContainer } from "@/app/lib/webcontainer";
import styles from "./FileTree.module.scss";

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

	const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files || e.target.files.length === 0) {
			return;
		}

        setIsUploading(true)
		try {
			for (const file of e.target.files) {
				const buffer = await file.arrayBuffer();
                const filePath = file.webkitRelativePath || file.name;
                await webContainer?.writeFile(filePath, new Uint8Array(buffer));
            }
            const newFiles = await webContainer?.getFiles();
            if(newFiles){
                setFiles(newFiles);
            }
		}
        catch(error){
            console.error("Error uploading file:", error);
        }
        finally{
           setIsUploading(false)
        }

	};

    const handleFolderUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) {
            return;
        }

        setIsUploading(true)
        try {
            for (const file of e.target.files) {
                const buffer = await file.arrayBuffer();
                const filePath = file.webkitRelativePath;
                await webContainer?.writeFile(filePath, new Uint8Array(buffer));
            }
            const newFiles = await webContainer?.getFiles();
            if(newFiles){
                setFiles(newFiles);
            }
        }
        catch(error){
            console.error("Error uploading folder:", error);
        }
        finally{
            setIsUploading(false)
        }
    };

    const handleUploadFileButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleUploadFolderButtonClick = () => {
        folderInputRef.current?.click();
    };



	const renderTree = (files: File[], depth: number = 0) => {
        if(!files){
            return null
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

	return (
		<div className={styles.fileTreeContainer}>
            <div style={{marginBottom: "10px"}}>
               {isUploading && "Uploading..."}
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
		</div>
	);
};

export default FileTree;
