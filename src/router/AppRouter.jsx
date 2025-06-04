import { HomePage, LoginPage, DetailPage } from "../modules";
import { adminRoutes } from "./children";
import { AdminPage } from "../modules/admin";
import { ProtectedRoute } from "./components";

export const AppRouter = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/news/:slug",
    element: <DetailPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/admin",
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminPage />, 
        children: adminRoutes,
      },
    ],
  },
];
