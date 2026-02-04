# HydroSim - Hydraulic Simulation Software

## Overview

HydroSim is a professional-grade web application for hydraulic transient analysis and dam monitoring. It functions as a WHAMO-inspired network and input file generator, providing a clean government/engineering-style interface for managing hydraulic systems. The software allows users to build hydraulic networks visually, run simulations with mock data, monitor dams on an interactive map, and generate WHAMO-compatible `.inp` input files.

**Important**: This is a prototype/visualization tool. It does NOT execute actual WHAMO.EXE, solve PDEs, or perform real water hammer calculations. All simulation results are mock data for demonstration purposes.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, bundled with Vite
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Charts**: Recharts for simulation result visualization
- **Maps**: React-Leaflet with OpenStreetMap tiles for dam location display
- **Flow Diagrams**: ReactFlow for visual hydraulic network building

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ESM modules)
- **API Pattern**: RESTful JSON API with type-safe route contracts in `shared/routes.ts`
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Build Tool**: esbuild for server bundling, Vite for client

### Data Layer
- **Database**: PostgreSQL (configured via DATABASE_URL environment variable)
- **Schema Location**: `shared/schema.ts` using Drizzle table definitions
- **Key Tables**:
  - `elements` - Hydraulic components (pipes, valves, reservoirs, surge tanks)
  - `dams` - Dam monitoring data with geolocation
  - `systemNodes` - Network connectivity nodes with elevations
  - `schedules` - Time-series flow schedules for boundary conditions

### Shared Code Structure
- `shared/schema.ts` - Database schema and Zod validation schemas
- `shared/routes.ts` - API contract definitions with input/output types
- Path aliases: `@/` for client source, `@shared/` for shared code

### Key Application Features
1. **Dashboard** - System health overview with stat cards
2. **Dam Monitoring** - Interactive Leaflet map showing dam locations and status
3. **System Builder** - ReactFlow-based visual network editor for hydraulic elements
4. **Simulation** - Run mock transient analysis with configurable duration
5. **Reports** - Document management interface (static mock data)
6. **INP Generator** - Exports WHAMO-compatible input files from element configuration

### File Generation
The `client/src/lib/inpGenerator.ts` module converts stored elements into WHAMO `.inp` file format, supporting:
- CONDUIT (pipes with length, diameter, celerity, friction)
- RESERVOIR (with elevation)
- VALVE (with loss coefficient)
- TURBINE (with power rating)
- SURGETANK (with dimensions and properties)

## External Dependencies

### Database
- **PostgreSQL** - Primary data store, connection via `DATABASE_URL` environment variable
- **Drizzle Kit** - Database migrations (`npm run db:push`)

### Frontend Libraries
- **Leaflet/React-Leaflet** - Interactive mapping (requires CSS import in global styles)
- **ReactFlow** - Node-based diagram editor for network building
- **Recharts** - Time-series chart rendering for simulation results
- **file-saver** - Client-side file downloads for `.inp` export

### UI Framework
- **Radix UI** - Accessible component primitives
- **shadcn/ui** - Pre-styled component library (configured in `components.json`)
- **Tailwind CSS** - Utility-first styling with custom theme variables

### Development Tools
- **Vite** - Development server with HMR
- **Replit Plugins** - Runtime error overlay, cartographer, dev banner (development only)