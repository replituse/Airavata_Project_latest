import { pgTable, text, serial, doublePrecision, jsonb, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

// Nodes for System Connectivity
export const systemNodes = pgTable("system_nodes", {
  id: serial("id").primaryKey(),
  nodeId: integer("node_id").notNull(),
  elevation: doublePrecision("elevation").notNull(),
});

// Hydraulic Elements (Pipe, Valve, Reservoir, etc.)
export const elements = pgTable("elements", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // CONDUIT, RESERVOIR, SURGETANK, FLOWBC, JUNCTION
  name: text("name").notNull(), // The ID (e.g., "C1", "HW")
  nodeA: integer("node_a"),
  nodeB: integer("node_b"),
  isDummy: boolean("is_dummy").default(false),
  properties: jsonb("properties").$type<{
    length?: number;
    diameter?: number;
    celerity?: number;
    friction?: number;
    elevation?: number;
    numSeg?: number;
    cPlus?: number;
    cMinus?: number;
    elTop?: number;
    elBottom?: number;
    qSchedule?: number;
  }>().notNull(),
});

// Schedules for FLOWBC
export const schedules = pgTable("schedules", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // QSCHEDULE 1
  data: jsonb("data").$type<{
    time: number;
    flow: number;
  }[]>().notNull(),
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
export const insertNodeSchema = createInsertSchema(systemNodes).omit({ id: true });
export const insertScheduleSchema = createInsertSchema(schedules).omit({ id: true });

// === EXPLICIT API TYPES ===

export type Element = typeof elements.$inferSelect;
export type InsertElement = z.infer<typeof insertElementSchema>;

export type Dam = typeof dams.$inferSelect;
export type InsertDam = z.infer<typeof insertDamSchema>;

export type SystemNode = typeof systemNodes.$inferSelect;
export type InsertSystemNode = z.infer<typeof insertNodeSchema>;

export type Schedule = typeof schedules.$inferSelect;
export type InsertSchedule = z.infer<typeof insertScheduleSchema>;

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
