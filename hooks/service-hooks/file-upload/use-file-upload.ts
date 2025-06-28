import { useCallback, useState } from "react";
import { serviceHost } from "@/services";
import {
  FileValidationConfig,
  FileValidationError,
  validateFile,
} from "@/lib/files/file-validation";
import { UploadError, UploadPayload, UploadTask } from "@/core";

const fileUploadService = serviceHost.getFileUploadService();

export interface FileUploadConfig {
  path: string;
  fileValidationConfig?: FileValidationConfig;
}

export interface FileUploadTaskAndState extends UploadTask {
  uploadFile: (file: UploadPayload["file"]) => void;
  uploadProgress: number;
  isLoading: boolean;
  isComplete: boolean;
  isCancelled: boolean;
  isPaused: boolean;
  error: FileValidationError | UploadError | null;
  url: string | null;
}

export function useFileUpload(
  config: FileUploadConfig,
): FileUploadTaskAndState {
  const [task, setTask] = useState<UploadTask | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<FileValidationError | UploadError | null>(
    null,
  );
  const [isCancelled, setIsCancelled] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [url, setUrl] = useState<string | null>(null);

  const uploadFile = useCallback(
    (file: UploadPayload["file"]) => {
      const { isValid, error: validationError } = validateFile({
        file,
        config: config.fileValidationConfig,
      });

      if (!isValid) {
        setError(validationError);
        return;
      }

      const task = fileUploadService.uploadFile({
        path: config.path,
        file: file,
        progressCallback: (progress: number) => {
          setUploadProgress(progress);
        },
        onPaused: () => {
          setIsPaused(true);
        },
        onRunning: () => {
          setIsPaused(false);
        },
        onCanceled: () => {
          setIsCancelled(true);
        },
        onError: (error: UploadError) => {
          setError(error);
        },
        onComplete: (url: string) => {
          setIsComplete(true);
          setUrl(url);
        },
      });

      setTask(task);
    },
    [config.fileValidationConfig, config.path],
  );

  if (!task) {
    return {
      uploadFile,
      uploadProgress: 0,
      isComplete: false,
      isLoading: false,
      error: null,
      isCancelled: false,
      isPaused: false,
      url: null,
      pause: () => undefined,
      resume: () => undefined,
      cancel: () => undefined,
    };
  }

  return {
    uploadFile,
    uploadProgress,
    isLoading:
      !isComplete &&
      !error &&
      !isCancelled &&
      !isPaused &&
      uploadProgress > 0 &&
      uploadProgress < 100,
    isComplete,
    error,
    isCancelled,
    isPaused,
    url,
    ...task,
  };
}
