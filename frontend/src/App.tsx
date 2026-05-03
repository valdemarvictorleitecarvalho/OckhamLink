import { Routes } from "./routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./global.css";

const queryClient = new QueryClient();

/**
 * The root component of the application.
 * It serves as the top-level wrapper, injecting global providers into
 * the React component tree before delegating the UI rendering to
 * the routing layer.
 *
 * @returns The fully wrapped application component tree.
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes />
    </QueryClientProvider>
  );
}

export default App;
