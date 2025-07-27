// http://192.168.100.181:8090/api/trakt/client-id
// https://moots.tigawanna.vip/api/trakt/client-id



// curl -X POST https://yourdomain.com/api/trakt/refresh-token \
//   -H "Content-Type: application/json" \
//   -H "Authorization: Bearer YOUR_POCKETBASE_TOKEN" \
//   -d '{"refresh_token": "YOUR_TRAKT_REFRESH_TOKEN"}'

import { pb } from "./client";

export async function getClientId() {
    // console.log("Fetching client ID from PocketBase...",pb.authStore.token);
  const response = await pb.send("/api/trakt/client-id", {
    method: "GET",
  })


  console.log("Response from getClientId:", response);
  return response
    // .then((response) => {
    //   if (response.status === 200) {
    //     return response.data?.clientId;
    //   } else {
    //     throw new Error(`Failed to fetch client ID: ${response.statusText}`);
    //   }
    // })
    // .catch((error) => {
    //   console.error("Error fetching client ID:", error);
    //   throw error;
    // });
}
