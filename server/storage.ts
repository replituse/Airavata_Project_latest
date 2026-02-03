import { db } from "./db";
import {
  elements,
  dams,
  type Element,
  type InsertElement,
  type Dam,
  type InsertDam,
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Elements
  getElements(): Promise<Element[]>;
  createElement(element: InsertElement): Promise<Element>;
  deleteElement(id: number): Promise<void>;

  // Dams
  getDams(): Promise<Dam[]>;
  createDam(dam: InsertDam): Promise<Dam>;
  
  // Seed Helper
  seedDams(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getElements(): Promise<Element[]> {
    return await db.select().from(elements);
  }

  async createElement(insertElement: InsertElement): Promise<Element> {
    const [element] = await db
      .insert(elements)
      .values(insertElement)
      .returning();
    return element;
  }

  async deleteElement(id: number): Promise<void> {
    await db.delete(elements).where(eq(elements.id, id));
  }

  async getDams(): Promise<Dam[]> {
    return await db.select().from(dams);
  }

  async createDam(insertDam: InsertDam): Promise<Dam> {
    const [dam] = await db.insert(dams).values(insertDam).returning();
    return dam;
  }

  async seedDams(): Promise<void> {
    const existing = await this.getDams();
    if (existing.length === 0) {
      await this.createDam({ name: "Tehri Dam", lat: 30.3776, lng: 78.4764, status: "Normal", capacity: 3.2, waterLevel: 820 });
      await this.createDam({ name: "Bhakra Dam", lat: 31.4113, lng: 76.4385, status: "Alert", capacity: 7.8, waterLevel: 480 });
      await this.createDam({ name: "Sardar Sarovar", lat: 21.8294, lng: 73.7483, status: "Normal", capacity: 5.8, waterLevel: 130 });
      await this.createDam({ name: "Hirakud Dam", lat: 21.5700, lng: 83.8700, status: "Normal", capacity: 4.8, waterLevel: 185 });
      await this.createDam({ name: "Nagarjuna Sagar", lat: 16.5700, lng: 79.3100, status: "Critical", capacity: 11.5, waterLevel: 175 });
    }
  }
}

export const storage = new DatabaseStorage();
