import "dotenv/config";
import Pocketbase from "pocketbase";
import fs from "fs/promises";

const url = process.env.EXPO_PUBLIC_PB_URL;
const email = process.env.PB_TYPEGEN_EMAIL;
const password = process.env.PB_TYPEGEN_PASSWORD;

async function getCollectionStructure() {
  if (!url) {
    throw new Error("Missing required environment variables: PB_URL, PB_EMAIL, PB_PASSWORD");
  }
  const pb = new Pocketbase(url);
  if (!email || !password) {
    throw new Error("Missing required environment variables: PB_URL, PB_EMAIL, PB_PASSWORD");
  }
  await pb.collection("_superusers").authWithPassword(email, password);
  const collections = await pb.collections.getFullList({
    sort: "created",
  });
  fs.writeFile("./src/lib/pb/collections.json", JSON.stringify(collections, null, 2));
}
getCollectionStructure().catch((error) => {
  console.warn("Error fetching collections:", error);
});
