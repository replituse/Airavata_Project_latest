import { pgTable, text, serial, doublePrecision, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

// Hydraulic Elements (Pipe, Valve, Reservoir, etc.)
export const elements = pgTable("elements", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // PIPE, VALVE, RESERVOIR, TURBINE, SURGETANK
  name: text("name").notNull(), // The user-defined ID (e.g., "C1", "HW")
  properties: jsonb("properties").$type<{
    length?: number;
    diameter?: number;
    elevation?: number;
    loss?: number;
    power?: number;
    elTop?: number;
    elBottom?: number;
    celerity?: number;
    friction?: number;
  }>().notNull(),
});

// Dams for Map View
export const dams = pgTable("dams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  lat: doublePrecision("lat").notNull(),
  lng: doublePrecision("lng").notNull(),
  status: text("status").notNull(), // Normal, Alert, Critical
  capacity: doublePrecision("capacity").notNull(), // TMC
  waterLevel: doublePrecision("water_level").notNull(), // Current level
});

// === SCHEMAS ===

export const insertElementSchema = createInsertSchema(elements).omit({ id: true });
export const insertDamSchema = createInsertSchema(dams).omit({ id: true });

// === EXPLICIT API TYPES ===

export type Element = typeof elements.$inferSelect;
export type InsertElement = z.infer<typeof insertElementSchema>;

export type Dam = typeof dams.$inferSelect;
export type InsertDam = z.infer<typeof insertDamSchema>;

export type CreateElementRequest = InsertElement;
export type UpdateElementRequest = Partial<InsertElement>;

// Mock Simulation Types
export interface SimulationResult {
  time: number;
  head: number;
  flow: number;
}

export interface SimulationResponse {
  status: "success" | "failed";
  results: SimulationResult[];
  message: string;
}
