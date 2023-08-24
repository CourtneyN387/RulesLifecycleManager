import { api } from "../config/api";
import { Rule } from "../types/Rule";

export type AddRuleServiceProps = Omit<Rule, "id">;
export function addRule(props: AddRuleServiceProps) {
  return api.post("/rules/add", props);
}
