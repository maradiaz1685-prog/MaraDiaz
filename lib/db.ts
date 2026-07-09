import { supabaseAdmin } from "./supabaseAdmin";
import { toCamelCase } from "./case";
import type { Settings, DaySchedule, Employee, Service, Course, Product, Registration } from "./types";

async function selectAll<T>(table: string): Promise<T[]> {
  const { data, error } = await supabaseAdmin.from(table).select("*");
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => toCamelCase(row)) as T[];
}

export const getServices = () => selectAll<Service>("services");
export const getCourses = () => selectAll<Course>("courses");
export const getProducts = () => selectAll<Product>("products");
export const getEmployees = () => selectAll<Employee>("employees");

export async function getSettings(): Promise<Settings> {
  const { data, error } = await supabaseAdmin.from("settings").select("*").eq("id", 1).single();
  if (error) throw new Error(error.message);
  return toCamelCase(data) as Settings;
}

export async function getSchedule(): Promise<DaySchedule[]> {
  const { data, error } = await supabaseAdmin.from("schedule").select("*").order("sort_order");
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => toCamelCase(row)) as DaySchedule[];
}

export async function getRegistrationByCode(code: string): Promise<Registration | null> {
  const { data, error } = await supabaseAdmin.from("registrations").select("*").eq("access_code", code).single();
  if (error || !data) return null;
  return toCamelCase(data) as unknown as Registration;
}
