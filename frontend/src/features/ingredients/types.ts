export type Ingredient = {
  id: number;
  name: string;
  category: string | null;
  unit: string;
  current_stock: number;
  minimum_stock: number;
  cost_per_unit: number | string;
  supplier: string | null;
  created_at: string;
  updated_at: string;
};
