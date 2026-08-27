import AppRouting from "./routing/AppRouting";
import { MerchProvider } from "./contexts/MerchContext";

function App() {
  return (
    <>
      <MerchProvider>
        <AppRouting />
      </MerchProvider>
    </>
  );
}

export default App;
