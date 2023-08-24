// import {
//   Button,
//   Table,
//   TableContainer,
//   Tbody,
//   Td,
//   Th,
//   Thead,
//   Tr,
// } from "@chakra-ui/react";
// import { useGetRules } from "../../hooks/useGetRules";
// import { useNavigate } from "react-router-dom";
// import { routes } from "../../config/routes";

// const tableHeaders = [
//   "Ruleset",
//   "Name",
//   "Description",
//   "Active",
//   "ID",
//   "Actions",
// ];
// export function ViewRules() {
//   const { rules, isLoading } = useGetRules({});
//   const navigate = useNavigate();

//   if (isLoading) return <div>loading...</div>;

//   if (!rules) return <div>There was a problem loading the rules</div>;

//   return (
//     <TableContainer>
//       <Table variant="striped">
//         <Thead>
//           {tableHeaders.map((header) => (
//             <Th textAlign="left" fontSize="large">
//               {header}
//             </Th>
//           ))}
//         </Thead>
//         <Tbody>
//           {rules.map((rule) => (
//             <Tr key={rule.id}>
//               <Td>{rule.set}</Td>
//               <Td>{rule.name}</Td>
//               <Td>{rule.description}</Td>
//               <Td>{String(rule.active)}</Td>
//               <Td>{rule.id}</Td>
//               <Td>
//                 <Button onClick={() => navigate(routes.UpdateRule)}>
//                   Update
//                 </Button>
//               </Td>
//             </Tr>
//           ))}
//         </Tbody>
//       </Table>
//     </TableContainer>
//   );
// }

import React from "react";
import {
  Button,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { routes } from "../../config/routes";
import mockData from "../../mock-data.json";

const tableHeaders = [
  "Ruleset",
  "Name",
  "Description",
  "Active",
  "ID",
  "Actions",
];

export function ViewRules() {
  const navigate = useNavigate();

  return (
    <TableContainer>
      <Table variant="striped">
        <Thead>
          {tableHeaders.map((header) => (
            <Th textAlign="left" fontSize="large" key={header}>
              {header}
            </Th>
          ))}
        </Thead>
        <Tbody>
          {mockData.map((rule) => (
            <Tr key={rule.ID}>
              <Td>{rule.Ruleset}</Td>
              <Td>{rule.Name}</Td>
              <Td>{rule.Description}</Td>
              <Td>{String(rule.Active)}</Td>
              <Td>{rule.ID}</Td>
              <Td>
                <Button onClick={() => navigate(routes.UpdateRule)}>
                  Update
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
