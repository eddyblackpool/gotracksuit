import type { HasDBClient } from "../shared.ts";

export default (input: HasDBClient & { id: number }): number | undefined => {
  console.log(`Deleting insight for id=${input.id}`);

  const deletedInsight = input.db.exec("DELETE FROM insights WHERE id = ?", [
    input.id,
  ]);

  if (deletedInsight) {
    console.log("Deleted insight:", deletedInsight);
    return deletedInsight;
  }

  console.log("Insight not found");
  return;
};
