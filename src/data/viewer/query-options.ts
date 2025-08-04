import { pb } from "@/lib/pb/client";
import { UsersCreate, UsersResponse } from "@/lib/pb/types/pb-types";
import { mutationOptions, queryOptions } from "@tanstack/react-query";

export function viewerQueryOptions() {
  return queryOptions({
    queryKey: ["viewer"],
    queryFn: async () => {
      return new Promise<{ record: UsersResponse | null; token: string | null }>((resolve) => {
        setTimeout(() => {
          if (!pb.authStore.record || !pb.authStore.isValid) {
        resolve({
          record: null,
          token: null,
        });
          } else {
        resolve({
          record: pb.authStore.record as UsersResponse,
          token: pb.authStore.token,
        });
          }
        }, 300);
      });
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

export function logoutViewerMutationOptions() {
  return mutationOptions({
    mutationFn: async () => {
      await pb.authStore.clear();
    },
    meta: {
      invalidates: [["viewer"]],
    },
  });
}

export function signinMutationOption() {
  return mutationOptions({
    mutationFn: ({ password, usernameOrEmail }: { usernameOrEmail: string; password: string }) => {
      return pb.from("users").authWithPassword(usernameOrEmail, password);
    },
    meta: {
      invalidates: [["viewer"]],
    },
  });
}
export function signupMutationOption() {
  return mutationOptions({
    mutationFn: (
      input: UsersCreate & {
        email: string;
        password: string;
        passwordConfirm: string;
      }
    ) => {
      return pb.from("users").create(input);
    },
    meta: {
      invalidates: [["viewer"]],
    },
  });
}
export function logoutMutationOptions() {
  return mutationOptions({
    mutationFn: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
          pb.authStore.clear();
        }, 3000);
      });
    },
    meta: {
      invalidates: [["viewer"]],
    },
  });
}


