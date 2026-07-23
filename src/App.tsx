import AppRouter from "@/router/AppRouter";
import { AuthProvider } from "@/context/AuthContext";
import {NotificationProvider} from "@/context/NotificationContext.tsx";
import {Toaster} from "react-hot-toast";

function App() {
  return (
      <AuthProvider>
          <NotificationProvider>
              <Toaster />
              <AppRouter />
          </NotificationProvider>
      </AuthProvider>
  );
}

export default App;