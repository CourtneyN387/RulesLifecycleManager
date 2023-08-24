import {
  FormControl,
  Input,
  Button,
  Heading,
  Stack,
  Textarea,
  Box,
  FormLabel,
  RadioGroup,
  Radio,
} from "@chakra-ui/react";
import { useState } from "react";
import { Rule } from "../../../types/Rule";

type AddRuleFormProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (e: any) => void;
  isLoading: boolean;
  initialValues?: Rule;
};

export default function AddRuleForm({
  onSubmit,
  isLoading = false,
}: AddRuleFormProps) {
  const [set, setRuleSet] = useState("");
  const [name, setRuleName] = useState("");
  const [description, setRuleDescription] = useState("");
  const [salience, setSalience] = useState("");
  const [when, setWhen] = useState("");
  const [then, setThen] = useState("");
  const [active, setActive] = useState("1");

  const handleAddRule = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (isLoading) return;
    onSubmit({
      description: description,
      name: name,
      set: set,
      active: Boolean("1" === active),
      rule: { salience, when, then },
    });
  };

  return (
    <>
      <Stack marginTop={5} marginRight={20} marginLeft={20}>
        <Box>
          <form method="POST" onSubmit={handleAddRule}>
            <Stack
              maxWidth={800}
              margin="auto"
              spacing={5}
              boxShadow="sm"
              bgPosition="center"
              display="flex"
              alignItems="center"
              justifyContent="center"
              width="100%"
              bgRepeat="no-repeat"
              py={12}
            >
              <FormControl isRequired>
                <FormLabel>Ruleset</FormLabel>
                <Input
                  disabled={isLoading}
                  size="md"
                  placeholder="Rule Set"
                  value={set}
                  onChange={({ target }) => setRuleSet(target.value)}
                  variant="filled"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Rule Name</FormLabel>
                <Input
                  disabled={isLoading}
                  size="md"
                  placeholder="Rule Name"
                  value={name}
                  onChange={({ target }) => setRuleName(target.value)}
                  variant="filled"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Rule Description</FormLabel>
                <Textarea
                  disabled={isLoading}
                  placeholder="Rule Description"
                  value={description}
                  onChange={({ target }) => setRuleDescription(target.value)}
                  variant="filled"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Salience</FormLabel>
                <Input
                  disabled={isLoading}
                  placeholder="Salience"
                  value={salience}
                  onChange={({ target }) => setSalience(target.value)}
                  variant="filled"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>When</FormLabel>
                <Input
                  disabled={isLoading}
                  size="md"
                  placeholder="When"
                  value={when}
                  onChange={({ target }) => setWhen(target.value)}
                  variant="filled"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Then</FormLabel>
                <Input
                  disabled={isLoading}
                  size="md"
                  placeholder="Then"
                  value={then}
                  onChange={({ target }) => setThen(target.value)}
                  variant="filled"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Active</FormLabel>
                <RadioGroup onChange={setActive} value={active}>
                  <Stack spacing={5} direction="row">
                    <Radio colorScheme="green" value="1">
                      Active
                    </Radio>
                    <Radio colorScheme="red" value="0">
                      Inactive
                    </Radio>
                  </Stack>
                </RadioGroup>
              </FormControl>
              <Button type="submit" disabled={isLoading} colorScheme="blue">
                Submit
              </Button>
              {isLoading && <Heading>Submitting...</Heading>}
            </Stack>
          </form>
        </Box>
      </Stack>
    </>
  );
}
