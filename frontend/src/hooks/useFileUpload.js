import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const useFileUpload = (onUpload, maxSizeMB = 10) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const selectedFile = acceptedFiles[0];
      if (selectedFile) {
        setFile(selectedFile);
        if (selectedFile.type.startsWith('image/')) {
          setPreview(URL.createObjectURL(selectedFile));
        } else {
          setPreview(null);
        }
        if (onUpload) onUpload(selectedFile);
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxSize: maxSizeMB * 1024 * 1024,
    multiple: false,
  });

  const clearFile = () => {
    setFile(null);
    setPreview(null);
  };

  return {
    file,
    preview,
    getRootProps,
    getInputProps,
    isDragActive,
    clearFile,
  };
};

export default useFileUpload;