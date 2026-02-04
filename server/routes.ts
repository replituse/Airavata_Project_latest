import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Elements CRUD
  app.get(api.elements.list.path, async (req, res) => {
    const elements = await storage.getElements();
    res.json(elements);
  });

  app.post(api.elements.create.path, async (req, res) => {
    try {
      const input = api.elements.create.input.parse(req.body);
      const element = await storage.createElement(input);
      res.status(201).json(element);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.elements.delete.path, async (req, res) => {
    await storage.deleteElement(Number(req.params.id));
    res.status(204).send();
  });

  // Dams
  app.get(api.dams.list.path, async (req, res) => {
    const dams = await storage.getDams();
    res.json(dams);
  });

  // Simulation
  app.post(api.simulation.run.path, async (req, res) => {
    const { duration } = req.body;
    
    // Generate mock results matching WHAMO OUT format expectations
    const results = [];
    for (let t = 0; t <= duration; t += 10) {
      results.push({
        time: t,
        head: 4130.58 + Math.sin(t / 50) * 5,
        flow: 3000 - (t > 20 ? 3000 : (t / 20) * 3000) + Math.random() * 10,
      });
    }

    res.json({
      status: "success",
      results,
    });
  });

  // Seed Data
  await storage.seedAll();

  return httpServer;
}
