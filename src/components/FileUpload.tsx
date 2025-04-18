
import { useCallback, useState } from "react";
import { Upload } from "lucide-react";

type FileUploadProps = {
  label: string;
  acceptedFileTypes?: string;
  onFileUpload: (file: File) => void;
};

const FileUpload = ({ 
  label, 
  acceptedFileTypes = ".pdf,.doc,.docx,.txt", 
  onFileUpload 
}: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      onFileUpload(file);
    }
  }, [onFileUpload]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      onFileUpload(file);
    }
  }, [onFileUpload]);

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-ubs-darkgray mb-2">
        {label}
      </label>
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          dragActive ? "border-ubs-red bg-red-50" : "border-gray-300"
        } hover:border-ubs-red transition-colors cursor-pointer`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          id="file-upload"
          type="file"
          accept={acceptedFileTypes}
          onChange={handleChange}
          className="hidden"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            <span className="text-ubs-red">Click to upload</span> or drag and drop
          </p>
          <p className="mt-1 text-xs text-gray-500">{acceptedFileTypes.replace(/\./g, "").toUpperCase()}</p>
        </label>
        {selectedFile && (
          <div className="mt-4 flex items-center justify-center text-sm text-ubs-darkgray">
            File selected: {selectedFile.name}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
