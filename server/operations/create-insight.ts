import type { Insight } from "$models/insight.ts";
import type { HasDBClient } from "../shared.ts";

export type Input = HasDBClient & {
  id: number;
  brand: number;
  text: string;
};

export default (input: Input): number | undefined => {
  console.log(`insertingnew record id=${input.id}`);

  console.log(
    `INSERT INTO insights (id, brand, text) VALUES (${input.id}, ${input.brand}, '${input.text}')`,
  );
  const created = input.db.exec(
    "INSERT INTO insights (id, brand, text) VALUES (?, ?, ?)",
    [
      input.id,
      input.brand,
      input.text,
    ],
  );

  if (created) {
    console.log("Insight created:", created);
    return created;
  }

  console.log("Insight not found");
  return;
};
