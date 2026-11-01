import apiClient from "../../../api/client";
import type { Ingredient } from "../types";

export type IngredientPayload = {
    name: string;
    category: string;
    unit: string;
    current_stock: number;
    minimum_stock: number;
    cost_per_unit: number;
    supplier: string;
};

export async function getIngredients(
    skip = 0,
    limit = 100,
): Promise<Ingredient[]> {
    const response = await apiClient.get<Ingredient[]>("/ingredients/", {
        params: { skip, limit },
    });

    return response.data;
}

export async function createIngredient(ingredient: IngredientPayload) {
    const response = await apiClient.post("/ingredients/", ingredient);

    return response.data;
}

export async function updateIngredient(
    ingredientId: number,
    ingredient: IngredientPayload,
) {
    const response = await apiClient.put(`/ingredients/${ingredientId}`, ingredient);

    return response.data;
}

export async function deleteIngredient(ingredientId: number) {
    const response = await apiClient.delete(`/ingredients/${ingredientId}`);

    return response.data;
}
