import { createCrudHandlers } from "@/lib/crud";

export const { GET, POST, PUT, DELETE } = createCrudHandlers("employees.json");
