import { TypedPocketBase } from "@tigawanna/typed-pocketbase";
import { AsyncAuthStore } from "pocketbase";
import { Schema } from "./types/pb-types";
import { envVariables } from "../env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const store = new AsyncAuthStore({
  save: async (serialized) => AsyncStorage.setItem("pb_auth", serialized),
  initial: AsyncStorage.getItem("pb_auth"),
  clear: async () => await AsyncStorage.removeItem("pb_auth"),
});


export const pb = new TypedPocketBase<Schema>(envVariables.EXPO_PUBLIC_PB_URL,store);
