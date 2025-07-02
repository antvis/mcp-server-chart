# 🧭 Context Guide for AI Agents

## Key Architecture Patterns
- **Chart Types**: 15 chart types split between G2 (basic charts) and G6 (graph visualizations)
- **Type System**: `G2ChartOptions` extends `@antv/g2-ssr.Options`, `G6ChartOptions` extends `@antv/g6-ssr.Options`
- **Validation**: All schemas use Zod with custom refinements for complex data (nodes/edges, tree structures)
- **Rendering**: `src/render/index.ts` dispatches to chart-specific functions, returns `Chart | Graph` union type
- **Tool Mapping**: `CHART_TYPE_MAP` in `src/utils/callTool.ts` maps MCP tool names to chart types

## Chart Generation Flow & Data Pipeline
- **Complete Flow**: MCP tool call → validation → render options → SSR → buffer → temp file → file:// URL
- **Tool Registration**: `server.setRequestHandler(ListToolsRequestSchema)` exposes all chart tools to MCP clients
- **Validation Pipeline**: `callTool()` → `CHART_TYPE_MAP` lookup → Zod schema validation → `generateChartUrl()`
- **Render Dispatch**: `render()` function uses chart type to select appropriate vis function from `VIS` object
- **File Generation**: `generateChartUrl()` creates temp files in `tmpdir()` with UUID naming (`chart-${randomUUID()}.png`)
- **Buffer Creation**: SSR packages return Chart/Graph objects with `.toBuffer()` method for PNG generation
- **Cleanup Pattern**: Charts call `.destroy()` in finally blocks to prevent canvas context memory leaks
- **Error Propagation**: Render errors → generate errors → MCP errors with proper error codes

## AntV Library Ecosystem
- **G2 vs G6**: `@antv/g2-ssr` for basic charts (line, column, pie, etc.), `@antv/g6-ssr` for graph visualizations (networks, trees)
- **Type Relationship**: G2Spec and GraphOptions are the core config types that extend to our G2ChartOptions/G6ChartOptions
- **Canvas Dependency**: `canvas` package provides Node.js Canvas API for server-side rendering without browser
- **SSR Architecture**: Both packages return objects with `.toBuffer()`, `.exportToFile()`, `.destroy()` methods
- **Chart vs Graph Returns**: G2 returns `Chart` objects, G6 returns `Graph` objects (Graph has additional `.toDataURL()`)
- **Theme Integration**: G2 uses `THEME_MAP` with theme objects, G6 uses `G6THEME_MAP` with color palette transforms
- **Rendering Engines**: G2 uses grammar of graphics approach, G6 uses force-directed and hierarchical layouts

## Zod Schema Architecture
- **Schema Conversion**: `zodToJsonSchema()` converts Zod schemas to MCP tool input schemas for tool registration
- **Base Schema Pattern**: Common schemas (`ThemeSchema`, `WidthSchema`, `HeightSchema`) composed across chart types
- **Complex Validation**: `.refine()` pattern for nodes/edges uniqueness, tree structure validation with custom error messages
- **Chart-Specific Extensions**: Each chart extends base with specific properties (e.g., `stack`, `group`, `innerRadius`)
- **Validation Flow**: `z.object(schema).safeParse(args)` → success/error → McpError with detailed messages
- **Custom Validators**: `nodeEdgeDataSchema` and `treeDataSchema` in `validator.ts` for complex graph data validation
- **Legacy Compatibility**: Wrapper functions maintain backward compatibility while using new Zod schemas underneath

## Chart Configuration Patterns
- **G2 Chart Properties**: `stack` (boolean), `group` (boolean), `innerRadius` (number), `binNumber` (number)
- **G6 Graph Properties**: `data` with `nodes` array and `edges` array, layout algorithms, theme color palettes
- **Common Properties**: `width`, `height`, `theme`, `title`, `axisXTitle`, `axisYTitle` across all chart types
- **Type Extension Pattern**: `G2ChartOptions` and `G6ChartOptions` extend SSR package types with custom properties
- **Data Structure Validation**: Graph charts require specific node/edge formats with uniqueness constraints
- **Theme System**: `default` and `academy` themes with different color schemes and styling approaches
- **Dual-Axes Special Case**: Uses `series` array and `categories` array for complex multi-axis chart configurations

## Build System & Module Resolution
- **ES Module Setup**: `package.json` has `type: "module"` requiring `.js` extensions in imports for Node.js compatibility
- **TypeScript Compilation**: `tsc` compiles to `build/` directory, then `tsc-alias` adds `.js` extensions to relative imports
- **Path Resolution**: `moduleResolution: "node"` with `rootDir: "./src"` and `outDir: "./build"` mapping
- **Declaration Files**: `declaration: true` generates `.d.ts` files for TypeScript consumers of the package
- **Directory Structure**: `src/` mirrors `build/` after compilation (charts/, render/, utils/, services/)
- **Import Patterns**: Internal imports use relative paths, external packages use bare specifiers
- **Build Pipeline**: `prebuild` cleans → `tsc` compiles → `tsc-alias` fixes extensions → ready for execution

## Error Handling Hierarchy
- **MCP Errors**: Uses `McpError` with `ErrorCode.MethodNotFound`, `ErrorCode.InvalidParams`
- **Validation Errors**: Zod validation errors transformed to MCP errors with detailed messages
- **Error Propagation**: render → generate → callTool → MCP response chain

## Testing Strategy & Patterns
- **Test Data**: `__tests__/constant.ts` provides data with intentional validation errors
- **Schema Testing**: `charts.spec.ts` compares generated schemas against expected JSON
- **Validation Testing**: Some tests expect failures (duplicate nodes, invalid edges)

## Memory Management & Resources
- **Cleanup Required**: Chart instances must call `.destroy()` to clean up canvas contexts
- **Temp Files**: OS handles temp directory cleanup, no manual file removal needed
- **No Pooling**: Currently no connection pooling or instance reuse implemented

## Development Workflow & Tooling
- **Linting Setup**: Biome handles formatting, linting, and import organization with `.biomejs` configuration
- **Excluded Files**: Biome ignores vendored G6 utilities (`src/render/utils.ts`, `src/render/constant.ts`) due to complex `any` types
- **Git Hooks**: Husky + lint-staged runs `biome check --write` on staged files before commit
- **Hook Bypass**: Use `git commit --no-verify` to skip linting when working with vendored code
- **Development Scripts**: `npm run lint` (check), `npm run lint:fix` (fix), `npm run format` (format only)
- **MCP Inspector**: `npm run start` launches MCP inspector for interactive tool testing and debugging
- **Testing Strategy**: `npm test` runs Vitest with schema validation tests and unit tests
- **Build Verification**: TypeScript compilation with `npx tsc --noEmit` for type checking without output

## Critical Files & Locations
- **Chart Definitions**: `src/charts/*.ts` - Each exports `{ schema, tool }` with Zod validation
- **Render Pipeline**: `src/render/vis/*.ts` - Chart-specific rendering functions using SSR packages
- **Type Definitions**: `src/render/vis/types.ts` - Base types and union definitions
- **Validation Logic**: `src/utils/validator.ts` - Zod schemas for complex data structures
- **Entry Points**: `src/index.ts` (CLI), `src/server.ts` (MCP server), `src/sdk.ts` (programmatic)
- **Vendored Code**: `src/render/utils.ts` and `src/render/constant.ts` copied from GPT-Vis (many `any` types)