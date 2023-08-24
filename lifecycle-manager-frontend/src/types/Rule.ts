export type RuleBody = {
  salience: string;
  when: string;
  then: string;
};

export type Rule = {
  rule: RuleBody;
  id: string;
  set: string;
  name: string;
  description: string;
  active: boolean;
};
