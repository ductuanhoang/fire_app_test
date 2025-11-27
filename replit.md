# Fire Dynamics - Automated Fire Suppression Control System

## Overview

Fire Dynamics is a mobile-first fire safety monitoring and control system that manages automated fire suppression devices (turrets) across multiple locations. The application provides real-time monitoring of device status, environmental conditions, and fire detection through a React-based frontend and Express backend, with real-time updates via WebSockets and AWS IoT Core integration for device communication.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **Framework**: React 18 with TypeScript, using Vite for development and bundling
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: Zustand for global application state
- **UI Components**: Radix UI primitives with shadcn/ui components
- **Styling**: Tailwind CSS v4 with custom design tokens for a dark industrial theme
- **Real-time Updates**: WebSocket client for bidirectional communication

**Design Decisions:**
- Mobile-first responsive design with a maximum width constraint (430px) to simulate a mobile device experience on desktop
- Component library based on shadcn/ui "new-york" style variant for consistent, accessible UI patterns
- Custom fonts: Inter for body text, Rajdhani for technical/display headers
- Dark theme with industrial aesthetic using custom CSS variables for colors and spacing
- Motion animations powered by Framer Motion for enhanced user experience

**State Management Strategy:**
The application uses Zustand for centralized state management with the following key slices:
- User authentication state
- Devices, locations, and groups collections
- Notifications
- Real-time device updates from WebSocket connections

**Key Pages:**
- Login and account creation flow
- WiFi setup wizard for device onboarding
- Home dashboard with device list and filtering
- Device detail view with controls and sensor readings
- Interactive map view for device placement
- Notifications center
- Account settings

### Backend Architecture

**Technology Stack:**
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM
- **Real-time Communication**: WebSocket (ws library)
- **IoT Integration**: AWS IoT Device SDK v2 for MQTT communication

**Architecture Pattern:**
The backend follows a service-oriented architecture with clear separation of concerns:

1. **App Layer** (`server/app.ts`): Express application setup, middleware configuration, and request logging
2. **Routes Layer** (`server/routes.ts`): RESTful API endpoints and WebSocket server initialization
3. **Storage Layer** (`server/storage.ts`): Database abstraction with methods for all CRUD operations
4. **MQTT Service** (`server/mqtt-service.ts`): AWS IoT Core integration for device communication

**Development vs Production:**
- `server/index-dev.ts`: Development server with Vite middleware for HMR
- `server/index-prod.ts`: Production server serving static built assets

**API Design:**
RESTful endpoints organized by resource:
- `/api/locations` - Location management
- `/api/groups` - Device group management
- `/api/devices` - Device CRUD operations and control commands
- `/api/notifications` - Notification management
- `/ws` - WebSocket endpoint for real-time updates

**Request Flow:**
1. Client sends HTTP request to Express
2. Route handler validates input using Zod schemas (from drizzle-zod)
3. Storage layer executes database queries via Drizzle ORM
4. Response sent back to client
5. For device updates, changes are broadcast to all connected WebSocket clients

### Data Storage

**Database:**
- **Provider**: Neon PostgreSQL (serverless)
- **ORM**: Drizzle ORM with TypeScript-first schema definitions
- **Migrations**: Managed via drizzle-kit

**Schema Design:**
The database uses a hierarchical structure:

1. **Users Table**: Authentication (username/password)
2. **Locations Table**: Physical sites (name, address)
3. **Groups Table**: Device groupings within locations (references locations)
4. **Devices Table**: Fire suppression turrets with:
   - Identity: name, serial number
   - Relationships: groupId, locationId (with cascade delete)
   - Status fields: online/offline/warning/emergency/maintenance/pre-soaking
   - Operational mode: automatic/manual
   - Sensor data: battery, pressure, CO2, particulate matter, wind
   - Physical attributes: height, position (x, y coordinates)
   - AWS integration: awsThingName for IoT Core
5. **Notifications Table**: System alerts (type, title, message, read status)

**Key Design Decisions:**
- UUIDs for primary keys using PostgreSQL's `gen_random_uuid()`
- Foreign key relationships with cascade delete to maintain referential integrity
- Double precision fields for sensor readings
- Shared schema file (`shared/schema.ts`) accessible to both frontend and backend
- Zod schema validation derived from Drizzle schemas for runtime type safety

### External Dependencies

**Third-Party Services:**
1. **Neon PostgreSQL**: Serverless database hosting via `@neondatabase/serverless` with WebSocket support
2. **AWS IoT Core**: Device-to-cloud MQTT messaging using `aws-iot-device-sdk-v2` for real-time device communication
3. **Replit Platform**: Development environment with custom Vite plugins for error handling, runtime monitoring, and meta image generation

**Key Libraries:**
- **Form Handling**: React Hook Form with `@hookform/resolvers` and Zod validation
- **Data Fetching**: TanStack React Query for caching and synchronization
- **UI Framework**: Comprehensive Radix UI component set for accessible, unstyled primitives
- **Date Utilities**: date-fns for date formatting and manipulation
- **WebSocket**: Native ws library for server-side WebSocket implementation

**Development Tools:**
- Vite with React plugin and custom plugins for Replit integration
- ESBuild for production bundling
- TypeScript with strict mode enabled
- PostCSS with Tailwind CSS and Autoprefixer

**Asset Management:**
The application includes custom image assets stored in `attached_assets/` and `client/public/` directories, with a custom Vite plugin (`vite-plugin-meta-images.ts`) to dynamically update OpenGraph meta tags based on Replit deployment URLs.