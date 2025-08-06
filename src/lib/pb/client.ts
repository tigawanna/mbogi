import AsyncStorage from "@react-native-async-storage/async-storage";
import { TypedPocketBase } from "@tigawanna/typed-pocketbase";
import { AsyncAuthStore } from "pocketbase";
import { envVariables } from "../env";
import { Schema } from "./types/pb-types";

const store = new AsyncAuthStore({
  save: async (serialized) => AsyncStorage.setItem("pb_auth", serialized),
  initial: AsyncStorage.getItem("pb_auth"),
  clear: async () => await AsyncStorage.removeItem("pb_auth"),
});

export const pb = new TypedPocketBase<Schema>(envVariables.EXPO_PUBLIC_PB_URL, store);

export const pocketbaseFriendlyUUID = () => {
  // Generate a random UUID and clean it up for PocketBase
  const initialId = crypto.randomUUID();
  // Remove hyphens, convert to lowercase, and take first 15 characters
  return initialId.replace(/-/g, "").toLowerCase().slice(0, 15);
};

export function addPocketbaseMetadata<T extends Record<string, any>>(
  item: T
): T & {
  id: string;
  created: string;
  updated: string;
  collectionId: string;
} {
  const now = new Date().toISOString();
  
  return {
    ...item,
    id: item.id || pocketbaseFriendlyUUID(),
    created: item.created || now,
    updated: item.updated || now,
    collectionId: item?.collectionId!,
  };
}

export const stripLocalOnlyMetadata = <T extends Record<string, any>>(item: T): T => {
  const { id, created, updated, collectionId, ...rest } = item;
  return rest as T;
}
