import { pb } from "@/lib/pb/client";
import { createTMDBSDK } from "./sdk-via-pb";

/**
 * Global TMDB SDK instance using the PocketBase client
 */
export const tmdb = createTMDBSDK(pb);
