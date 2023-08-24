import { useNavigate } from "react-router-dom";
import { routes } from "../../config/routes";
import { useMutation } from "../../hooks/useMutation";
import { addRule } from "../../services/add-rule";
import AddRuleForm from "./components/AddRuleForm";
export const AddRule = () => {
  const navigate = useNavigate();
  const { mutate, isLoading } = useMutation(addRule, {
    onSuccess: () => {
      navigate(routes.ViewRules);
    },
    onError(message) {
      alert(message);
    },
  });

  return (
    <>
      <AddRuleForm onSubmit={(e) => mutate(e)} isLoading={isLoading} />
    </>
  );
};
