import React, { createContext, useContext, useEffect, useReducer, useState } from "react";
import type { Insight } from "../schemas/insight.ts";

type ControllerContextType = {
  state: any;
  dispatch: React.Dispatch<any>;
};

const ControllerContext = createContext<ControllerContextType | null>(null);

const currentState = {
  insights: [
    { brandId: 1, date: new Date(), text: "Test insight" },
    { brandId: 2, date: new Date(), text: "Test insight" },
    { brandId: 3, date: new Date(), text: "Test insight" },
    { brandId: 4, date: new Date(), text: "Test insight" },
  ],
}

export const ControllerProvider = ({ children }: { children: React.ReactNode }) => {
  const [insights, setInsights] = useState<Insight[]>([]);

  const [state, dispatch] = useReducer((state: any, action: any) => {
    switch (action.type) {
      case "insertInsight":
        return { ...state, insights: action.payload };
      default:
        return state;
    }
  }, [currentState]);

  useEffect(() => {

    console.log("current state", state);

    const fetchInsights = async () => {
      await fetch(`http://localhost:8080/api/insights`).then((res) => res.json()).then((data => {
        setInsights(data.result);
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