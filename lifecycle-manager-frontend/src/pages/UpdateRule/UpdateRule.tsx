import { useNavigate, useParams } from "react-router-dom";
import { routes } from "../../config/routes";
import { useMutation } from "../../hooks/useMutation";
import { addRule } from "../../services/add-rule";
import AddRuleForm from "../AddRule/components/AddRuleForm";
export const UpdateRule = () => {
  const navigate = useNavigate();

  const { id } = useParams();

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
