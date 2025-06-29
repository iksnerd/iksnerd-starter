import { ErrorBase } from "@/utils/errors/error-base";

type UploadErrorName = "unauthorized" | "unknown";

export class UploadError extends ErrorBase<UploadErrorName> {}

export interface UploadPayload {
  path: string;
  file: File | Blob;
  progressCallback: (progress: number) => void;
  onPaused: () => void;
  onRunning: () => void;
  onCanceled: () => void;
  onError: (error: UploadError) => void;
  onComplete: (url: string) => void;
}

export interface UploadTask {
  pause: () => void;
  resume: () => void;
  cancel: () => void;
}

export interface FileUploadService {
  uploadFile(payload: UploadPayload): UploadTask;
}
