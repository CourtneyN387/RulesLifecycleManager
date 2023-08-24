import { api } from "../config/api";
import { Rule } from "../types/Rule";

export async function getRules() {
  const response = await api.get<{ rules: Rule[] }>("/rules/view");
  return response;
}
