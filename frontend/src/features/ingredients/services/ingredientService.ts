import apiClient from "../../../api/client";

export async function getIngredients(skip = 0, limit = 100) {
    const response = await apiClient.get("/ingredients/", {
        params: { skip, limit },
    });

    return response.data;
}