import { Header } from "../components/header/header.tsx";
import { Insights } from "../components/insights/insights.tsx";
import styles from "./app.module.css";

import { ControllerProvider } from "../store/Controller.tsx";


export const App = () => {

  return (
    <main className={styles.main}>
      <ControllerProvider>
        <Header />
        <Insights />
      </ControllerProvider>
    </main>
  );
};
