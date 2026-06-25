import { api } from "./client";

export type User = {
  id: number;
  login: string;
  email: string;
  role: string;
  is_active: boolean;
  is_enabled: boolean;
};

export function listUsers() {
  return api<User[]>("/users/");
}

export function setUserEnabled(userId: number, isEnabled: boolean) {
  return api<User>(`/users/${userId}/enabled`, {
    method: "PATCH",
    body: JSON.stringify({ is_enabled: isEnabled }),
  });
}