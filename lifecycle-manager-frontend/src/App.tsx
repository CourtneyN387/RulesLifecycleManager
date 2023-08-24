import { Button, HStack } from "@chakra-ui/react";
import { Image } from "@chakra-ui/react";
import { Route, Routes, useNavigate } from "react-router-dom";

import logo from "./rain.png";
import { ViewRules } from "./pages/ViewRules";
import { routes } from "./config/routes";
import { AddRule } from "./pages/AddRule";

function App() {
  const navigate = useNavigate();
  return (
    <div className="App">
      <HStack spacing={4} margin={5} justifyContent={"space-between"}>
        <Image className="logo" src={logo} alt="Logo" height={12} />
        <HStack>
          <Button size="lg" onClick={() => navigate(routes.ViewRules)}>
            View Rules
          </Button>
          <Button size="lg" onClick={() => navigate(routes.AddRule)}>
            Add Rule
          </Button>
        </HStack>
      </HStack>
      <Routes>
        <Route path={routes.ViewRules} element={<ViewRules />} />
        <Route path={routes.AddRule} element={<AddRule />} />
        <Route path={routes.UpdateRule} element={<AddRule />} />
      </Routes>
    </div>
  );
}

export default App;
