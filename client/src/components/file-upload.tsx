import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { CloudUpload } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface FileUploadProps {
  onUpload: (file: File) => void;
}

export default function FileUpload({ onUpload }: FileUploadProps) {
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.type.startsWith('image/')) {
        onUpload(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a JPG or PNG image",
          variant: "destructive",
        });
      }
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragReject } = useDropzone({
    onDrop,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
    },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
        isDragActive
          ? "border-primary bg-primary/5"
          : isDragReject
          ? "border-destructive bg-destructive/5"
          : "border-border hover:border-primary"
      }`}
      data-testid="file-upload-zone"
    >
      <input {...getInputProps()} data-testid="file-input" />
      <div className="space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <CloudUpload className="text-primary text-2xl" />
        </div>
        <div>
          <p className="text-foreground font-medium">
            {isDragActive
              ? "Drop your distinguished photo here"
              : "Drop your distinguished photo here"}
          </p>
          <p className="text-muted-foreground text-sm">or click to browse files</p>
          <p className="text-muted-foreground text-xs mt-2">Supports JPG, PNG formats</p>
        </div>
        <Button
          type="button"
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          data-testid="button-choose-file"
        >
          Choose File
        </Button>
      </div>
    </div>
  );
}
