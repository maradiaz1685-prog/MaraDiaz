import { createCrudHandlers } from "@/lib/crud";

export const { GET, POST, PUT, DELETE } = createCrudHandlers("products.json");
