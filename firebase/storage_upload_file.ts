import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebaseConfig";

/**
 * Uploads a file from a URI to Firebase Storage and returns the download URL.
 * @param uri The local URI of the file to upload.
 * @param path The destination path in Firebase Storage (e.g., 'avatars/user123.jpg').
 * @returns A promise that resolves to the download URL.
 */
export const uploadFileAndGetURL = async (uri: string, path: string): Promise<string> => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, path);
    
    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};
