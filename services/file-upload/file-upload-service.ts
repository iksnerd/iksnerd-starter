import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  UploadMetadata,
} from '@firebase/storage';
import { FileUploadService, UploadError } from '@/core';
import { firebaseClient } from '@/infrastructure';

export const fileUploadService: FileUploadService = {
  uploadFile(payload) {
    const {
      file,
      path,
      progressCallback,
      onPaused,
      onRunning,
      onCanceled,
      onError,
      onComplete,
    } = payload;

    const metadata: UploadMetadata = {
      contentType: file.type,
      cacheControl: 'public, max-age=31536000',
    };

    const storageRef = ref(firebaseClient.storage, path);

    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
        );

        progressCallback(progress);

        switch (snapshot.state) {
          case 'paused':
            onPaused();
            break;
          case 'running':
            onRunning();
            break;
          case 'canceled':
            onCanceled();
            break;
        }
      },
      (error) => {
        switch (error.code) {
          case 'storage/unauthorized':
            onError(
              new UploadError(
                'unauthorized',
                "User doesn't have permission to access the object",
              ),
            );
            break;

          case 'storage/canceled':
            onCanceled();
            break;

          default:
            onError(new UploadError('unknown', error.message));
            break;
        }
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        onComplete(downloadURL);
      },
    );

    return {
      pause: () => uploadTask.pause(),
      resume: () => uploadTask.resume(),
      cancel: () => uploadTask.cancel(),
    };
  },
};
