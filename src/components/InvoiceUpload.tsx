
import React, { useState, useRef } from "react";
import { Upload, Camera, Loader2 } from "lucide-react";

interface InvoiceUploadProps {
  onUpload: (file: File) => void;
  isProcessing: boolean;
}

const InvoiceUpload: React.FC<InvoiceUploadProps> = ({ onUpload, isProcessing }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleCameraCapture = () => {
    // In a real implementation, we would use the device's camera
    if (fileInputRef.current) {
      fileInputRef.current.accept = "image/*";
      fileInputRef.current.capture = "environment";
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div
        className={`w-full max-w-2xl border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all ${
          isDragging ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary/50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        {isProcessing ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <h3 className="text-xl font-medium mb-2">Processing your invoice</h3>
            <p className="text-muted-foreground">
              Our AI is extracting all the important information...
            </p>
          </div>
        ) : (
          <>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*,application/pdf"
            />
            <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium mb-2">Upload an invoice</h3>
            <p className="text-muted-foreground mb-4">
              Drag and drop a file here, or click to select a file
            </p>
            <p className="text-xs text-muted-foreground">
              Supported formats: JPG, PNG, PDF (max 10MB)
            </p>
          </>
        )}
      </div>

      {!isProcessing && (
        <div className="mt-6">
          <button
            onClick={handleCameraCapture}
            className="flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/80 py-2 px-4 rounded-md"
            type="button"
          >
            <Camera className="h-5 w-5" />
            <span>Take a photo</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default InvoiceUpload;
