import { z } from "zod";


export const envSchema = z.object({
  EXPO_PUBLIC_PB_URL: z.url(),
  EXPO_PUBLIC_TRAKT_CLIENT_ID: z.string().min(1, "Trakt Client ID is required"),
  // EXPO_PUBLIC_TMDB_API_KEY: z.string().min(1, "TMDB API Key is required"),
});

export type Env = z.infer<typeof envSchema>;

const { success, data, error } = envSchema.safeParse(process.env);
if (!success || !data || error) {
    console.error("Invalid environment variables:", z.treeifyError(error));
    throw new Error("Invalid environment variables");
}

export const envVariables = data;
