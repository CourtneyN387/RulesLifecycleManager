import { useState } from "react";

type UseAddRuleProps = {
  onError?: (message: string) => void;
  onSuccess?: () => void;
};

//eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useMutation<T extends (e: any) => Promise<unknown>>(
  service: T,
  { onError, onSuccess }: UseAddRuleProps
) {
  const [isLoading, setIsLoading] = useState(false);
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mutate = async (props: any) => {
    setIsLoading(true);
    /*
    if (process.env.REACT_APP_USE_MOCKS) {
      await until(500);
      if (
        !process.env.REACT_APP_MOCKS_CAN_FAIL ||
        Math.round(Math.random() + 0.3)
      ) {
        onSuccess?.();
      } else {
        onError?.("The mock randomly returned an error!");
      }
      setIsLoading(false);
    } else {
      */
    service(props)
      .then(() => {
        onSuccess?.();
      })
      .catch((err) => {
        onError?.(err?.message || "Error submitting the data");
      })
      .finally(() => {
        setIsLoading(false);
      });
    // }
  };
  return { mutate, isLoading };
}
