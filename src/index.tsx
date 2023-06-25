import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Error from "./components/pages/Error";
import UserCrud from "./components/pages/UserPage";
import DespesaCrud from "./components/pages/DespesasPage";
import ObjetivoCrud from "./components/pages/ObjetivoPage";

const routes = createBrowserRouter([
  {
    path: "",
    element: <App />,
    children: [
      {
        path: "",
        element: <UserCrud />,
      },
      {
        path: "/userCrud",
        element: <UserCrud />,
      },
      {
        path: "/despesaCrud",
        element: <DespesaCrud />,
      },
      {
        path: "/objetivoCrud",
        element: <ObjetivoCrud />,
      },
    ],
  },
  {
    path: "*",
    element: <Error />,
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={routes} />
  </React.StrictMode>
);
