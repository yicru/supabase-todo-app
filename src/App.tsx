import { Box, Container } from "@chakra-ui/react";
import { TodoList } from "./features/todo/components/TodoList";

const App = () => {
  return (
    <Box bg={"gray.50"}>
      <Container
        py={6}
        size={"xs"}
        sx={{
          "&": {
            height: "100dvh",
          },
          background: "white",
          display: "grid",
          gridTemplateColumns: "100%",
          gridTemplateRows: "1fr",
          height: "100vh",
        }}
      >
        <Box sx={{ overflow: "scroll" }}>
          <TodoList />
        </Box>
      </Container>
    </Box>
  );
};

export default App;
