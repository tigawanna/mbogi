import AsyncStorage from "@react-native-async-storage/async-storage";
import { TypedPocketBase } from "@tigawanna/typed-pocketbase";
import { AsyncAuthStore, BaseAuthStore } from "pocketbase";
import { envVariables } from "../env";
import { Schema } from "./types/pb-types";

const store = new AsyncAuthStore({
  save: async (serialized) => AsyncStorage.setItem("pb_auth", serialized),
  initial: AsyncStorage.getItem("pb_auth"),
  clear: async () => await AsyncStorage.removeItem("pb_auth"),
});

export const pb = new TypedPocketBase<Schema>(envVariables.EXPO_PUBLIC_PB_URL, store);

if (pb) {
  pb.afterSend = function (response, data) {
    // do something with the response state
    // console.log("global pocketbase logger  ==>> ", response);
    if (response.status >= 400 && response.status < 500) {
      // Handle client errors (4xx)
      console.error("Client error:", response);
    }
    if (response.status >= 500) {
      // Handle server errors (5xx)
      console.error("Server error:", response);
    }
    // console.log("global pocketbase logger  ==>> ", data);

    // return Object.assign(data, {
    //   // extend the data...
    //   additionalField: 123,
    // });
    return data;
  };
}

export const pocketbaseFriendlyUUID = () => {
  // Generate a random UUID and clean it up for PocketBase
  const initialId = crypto.randomUUID();
  // Remove hyphens, convert to lowercase, and take first 15 characters
  return initialId.replace(/-/g, "").toLowerCase().slice(0, 15);
};
