import { useEffect, useState } from "react";
import { getRules } from "../services/get-rules";
import { Rule } from "../types/Rule";

export type UseGetRulesProps = {
  onError?: () => void;
};

export const useGetRules = ({ onError }: UseGetRulesProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [rules, setRules] = useState<Rule[]>();

  const handleSuccess = (data: Rule[]) => {
    setRules(data);
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    onError?.();
  };

  useEffect(() => {
    // if (process.env.REACT_APP_USE_MOCKS === "TRUE") {
    //   if (
    //     !process.env.REACT_APP_MOCKS_CAN_FAIL ||
    //     Math.round(Math.random() + 0.3)
    //   ) {
    //     handleSuccess(mockData);
    //   } else {
    //     handleError();
    //   }
    // } else {
    getRules()
      .then((r) => {
        handleSuccess(r.data.rules);
      })
      .catch(() => {
        handleError();
      });
    // }
  }, []);

  return { rules, isLoading };
};
