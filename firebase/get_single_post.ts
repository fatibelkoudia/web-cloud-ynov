import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Post } from "./get_post_data";

/**
 * Retrieves a single blog post by its ID.
 * @param id The document ID of the post.
 * @returns A promise that resolves to the post data or null if not found.
 */
export const getPostById = async (id: string): Promise<Post | null> => {
  try {
    const docRef = doc(db, "posts", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Post;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting post:", error);
    throw error;
  }
};
