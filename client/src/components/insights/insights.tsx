import { Trash2Icon } from "lucide-react";
import { cx } from "../../lib/cx.ts";
import styles from "./insights.module.css";
import type { Insight } from "../../schemas/insight.ts";
import { useEffect } from "react";

type InsightsProps = {
  insights: Insight[];
  className?: string;
};

export const Insights = () => {
  const { insights, className }: InsightsProps = {
    insights: [],
    className: "",
  };

  const deleteInsight = async (id: number) => {
    console.log("delete insight", id);

    const deleteInsight = await fetch(`http://localhost:8080/api/insights/delete/${id}`, { method: "DELETE" }).then((res) => res.json()).then((data) => data.result);

    console.log("deleteInsight", deleteInsight);
  };

  useEffect(() => {
    console.log("insights", insights);
  }, []);

  if (insights.length === 0) return <p>no insights</p>;

  return (
    <div className={cx(className)}>
      <h1 className={styles.heading}>Insights</h1>
      <div className={styles.list}>
        {insights.length
          ? (
            insights.map(({ id, text, createdAt: date, brand: brandId }) => (
              <div className={styles.insight} key={id}>
                <div className={styles["insight-meta"]}>
                  <span>{brandId}</span>
                  <div className={styles["insight-meta-details"]}>
                    <span>{date.toString()}</span>
                    <Trash2Icon
                      className={styles["insight-delete"]}
                      onClick={() => deleteInsight(id)}
                    />
                  </div>
                </div>
                <p className={styles["insight-content"]}>{text}</p>
              </div>
            ))
          )
          : <p>We have no insight!</p>}
      </div>
    </div>
  );
};
