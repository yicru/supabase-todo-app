import { FormEvent, useMemo, useState } from "react";
import { Todo, useTodo } from "../hooks/useTodo";
import {
  Alert,
  Button,
  Checkbox,
  Grid,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
} from "@chakra-ui/react";

export const TodoList = () => {
  const [task, setTask] = useState("");

  const { add, error, isLoading } = useTodo();

  const handleOnSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await add(task, {
      onComplete: () => setTask(""),
    });
  };

  return (
    <Grid gap={4} w={"full"} maxW={"xl"}>
      <form onSubmit={handleOnSubmit}>
        <InputGroup size="lg">
          <Input
            pr="4.5rem"
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button isLoading={isLoading} h="1.75rem" size="sm" type={"submit"}>
              追加
            </Button>
          </InputRightElement>
        </InputGroup>
      </form>
      {error && <Alert status="error">{error}</Alert>}
      <Tabs>
        <TabList>
          <Tab>未完了</Tab>
          <Tab>完了済み</Tab>
          <Tab>すべて</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Todos status={"uncompleted"} />
          </TabPanel>
          <TabPanel>
            <Todos status={"completed"} />
          </TabPanel>
          <TabPanel>
            <Todos status={"all"} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Grid>
  );
};

type TodosProps = {
  status: "all" | "completed" | "uncompleted";
};

const Todos = ({ status }: TodosProps) => {
  const { todos } = useTodo();

  const filteredTodos = useMemo(() => {
    switch (status) {
      case "all":
        return todos;
      case "completed":
        return todos?.filter((todo) => todo.is_completed);
      case "uncompleted":
        return todos?.filter((todo) => !todo.is_completed);
    }
  }, [status, todos]);

  return (
    <VStack alignItems={"stretch"}>
      {filteredTodos?.map((todo) => (
        <TodoListItem key={todo.id} todo={todo} />
      ))}
    </VStack>
  );
};

type TodoProps = {
  todo: Todo;
};

const TodoListItem = ({ todo }: TodoProps) => {
  const { toggle, remove } = useTodo();

  return (
    <HStack>
      <Checkbox
        flex={1}
        isChecked={todo.is_completed}
        onChange={() => toggle(todo)}
      >
        {todo.value}
      </Checkbox>
      <Button size={"xs"} onClick={() => remove(todo)}>
        削除
      </Button>
    </HStack>
  );
};
