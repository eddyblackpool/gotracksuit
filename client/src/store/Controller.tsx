import { createContext, useContext, useEffect, useReducer } from "react";
import type { Insight } from "../schemas/insight.ts";
type ControllerContextType = {
  state: any;
  dispatch: React.Dispatch<any>;
};


type Action =
  | { type: "loadInsights"; payload: Insight[] }
  | { type: "deleteInsight"; payload: { id: number } };

const ControllerContext = createContext<ControllerContextType | null>(null);

export const ControllerProvider = ({ children }: { children: React.ReactNode }) => {

  const [state, dispatch] = useReducer((state: Insight[], action: Action): Insight[] => {

    switch (action.type) {
      case "loadInsights":
        return [...state, ...action.payload];
      case "deleteInsight": {
        const updatedState: Insight[] = state.filter((insight: Insight) => insight.id !== action.payload.id);
        return [...updatedState];
      }
      default:
        return state;
    }
  }, []);




  useEffect(() => {

    const fetchInsights = async () => {
      await fetch(`http://localhost:8080/api/insights`).then((res) => res.json()).then((data => {
        dispatch({ type: "loadInsights", payload: data.result });
      }));
    }

    fetchInsights();
  }, []);

  return (
    <ControllerContext.Provider value={{ state, dispatch }}>
      {children}
    </ControllerContext.Provider>
  );
}

export const useController = () => {
  const context = useContext(ControllerContext);
  if (!context) {
    throw new Error("useController must be used within a ControllerProvider");
  }
  return context;
};