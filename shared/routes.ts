import { z } from 'zod';
import { insertElementSchema, elements, dams } from './schema';

// ============================================
// SHARED ERROR SCHEMAS
// ============================================
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

// ============================================
// API CONTRACT
// ============================================
export const api = {
  elements: {
    list: {
      method: 'GET' as const,
      path: '/api/elements',
      responses: {
        200: z.array(z.custom<typeof elements.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/elements',
      input: insertElementSchema,
      responses: {
        201: z.custom<typeof elements.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/elements/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  dams: {
    list: {
      method: 'GET' as const,
      path: '/api/dams',
      responses: {
        200: z.array(z.custom<typeof dams.$inferSelect>()),
      },
    },
  },
  simulation: {
    run: {
      method: 'POST' as const,
      path: '/api/simulation/run',
      input: z.object({
        duration: z.number().default(20),
      }),
      responses: {
        200: z.object({
          status: z.string(),
          results: z.array(z.object({
            time: z.number(),
            head: z.number(),
            flow: z.number(),
          })),
        }),
      },
    },
  },
};

// ============================================
// HELPER FUNCTIONS
// ============================================
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

// ============================================
// TYPE EXPORTS
// ============================================
export type ElementInput = z.infer<typeof api.elements.create.input>;
export type ElementResponse = z.infer<typeof api.elements.create.responses[201]>;
