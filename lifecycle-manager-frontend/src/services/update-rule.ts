import { api } from "../config/api";

export type UpdateRuleServiceProps = {
  ruleSet: string;
  ruleName: string;
  ruleDescription: string;
  active: boolean;
};
export function updateRule(id: string, props: UpdateRuleServiceProps) {
  return api.post(`/rules/update/${id}`, {
    Ruleset: props.ruleSet,
    Rulename: props.ruleName,
    Description: props.ruleDescription,
    Active: props.active,
  });
}
