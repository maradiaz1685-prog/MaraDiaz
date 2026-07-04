import { createCrudHandlers } from "@/lib/crud";

export const { GET, POST, PUT, DELETE } = createCrudHandlers("services.json");
