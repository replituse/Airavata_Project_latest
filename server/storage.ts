import { db } from "./db";
import {
  elements,
  dams,
  systemNodes,
  schedules,
  type Element,
  type InsertElement,
  type Dam,
  type InsertDam,
  type SystemNode,
  type InsertSystemNode,
  type Schedule,
  type InsertSchedule,
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Elements
  getElements(): Promise<Element[]>;
  createElement(element: InsertElement): Promise<Element>;
  deleteElement(id: number): Promise<void>;

  // Nodes
  getNodes(): Promise<SystemNode[]>;
  createNode(node: InsertSystemNode): Promise<SystemNode>;

  // Schedules
  getSchedules(): Promise<Schedule[]>;
  createSchedule(schedule: InsertSchedule): Promise<Schedule>;

  // Dams
  getDams(): Promise<Dam[]>;
  createDam(dam: InsertDam): Promise<Dam>;
  
  // Seed Helper
  seedAll(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getElements(): Promise<Element[]> {
    return await db.select().from(elements);
  }

  async createElement(insertElement: InsertElement): Promise<Element> {
    const [element] = await db.insert(elements).values(insertElement).returning();
    return element;
  }

  async deleteElement(id: number): Promise<void> {
    await db.delete(elements).where(eq(elements.id, id));
  }

  async getNodes(): Promise<SystemNode[]> {
    return await db.select().from(systemNodes);
  }

  async createNode(insertNode: InsertSystemNode): Promise<SystemNode> {
    const [node] = await db.insert(systemNodes).values(insertNode).returning();
    return node;
  }

  async getSchedules(): Promise<Schedule[]> {
    return await db.select().from(schedules);
  }

  async createSchedule(insertSchedule: InsertSchedule): Promise<Schedule> {
    const [schedule] = await db.insert(schedules).values(insertSchedule).returning();
    return schedule;
  }

  async getDams(): Promise<Dam[]> {
    return await db.select().from(dams);
  }

  async createDam(insertDam: InsertDam): Promise<Dam> {
    const [dam] = await db.insert(dams).values(insertDam).returning();
    return dam;
  }

  async seedAll(): Promise<void> {
    const existingDams = await this.getDams();
    if (existingDams.length === 0) {
      await this.createDam({ name: "Tehri Dam", lat: 30.3776, lng: 78.4764, status: "Normal", capacity: 3.2, waterLevel: 820 });
      await this.createDam({ name: "Bhakra Dam", lat: 31.4113, lng: 76.4385, status: "Alert", capacity: 7.8, waterLevel: 480 });
      await this.createDam({ name: "Sardar Sarovar", lat: 21.8294, lng: 73.7483, status: "Normal", capacity: 5.8, waterLevel: 130 });
    }

    const existingElements = await this.getElements();
    if (existingElements.length === 0) {
      // Seed nodes
      await this.createNode({ nodeId: 1, elevation: 4022.31 });
      await this.createNode({ nodeId: 2, elevation: 3947.44 });

      // Seed reservoir
      await this.createElement({
        type: "RESERVOIR",
        name: "HW",
        nodeA: 1,
        properties: { elevation: 4130.58 }
      });

      // Seed conduit
      await this.createElement({
        type: "CONDUIT",
        name: "C1",
        nodeA: 1,
        nodeB: 2,
        properties: { length: 13405.51, diameter: 34.45, celerity: 2852.51, friction: 0.008, numSeg: 5, cPlus: 0.1, cMinus: 0.1 }
      });
    }
  }
}

export const storage = new DatabaseStorage();
