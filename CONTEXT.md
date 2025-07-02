# 🧭 Context Guide for AI Agents

## Key Architecture Patterns
- **Chart Types**: 15 chart types split between G2 (basic charts) and G6 (graph visualizations)
- **Type System**: `G2ChartOptions` extends `@antv/g2-ssr.Options`, `G6ChartOptions` extends `@antv/g6-ssr.Options`
- **Validation**: All schemas use Zod with custom refinements for complex data (nodes/edges, tree structures)
- **Rendering**: `src/render/index.ts` dispatches to chart-specific functions, returns `Chart | Graph` union type
- **Tool Mapping**: `CHART_TYPE_MAP` in `src/utils/callTool.ts` maps MCP tool names to chart types

## Chart Generation Flow & Data Pipeline
- **Complete Flow**: MCP tool call → validation → render options → SSR → buffer → temp file → file:// URL
- **File Generation**: `generateChartUrl()` creates temp files in `tmpdir()` with UUID naming
- **Cleanup Pattern**: Charts call `.destroy()` in finally blocks to prevent memory leaks

## AntV Library Ecosystem
- **G2 vs G6**: `@antv/g2-ssr` for basic charts, `@antv/g6-ssr` for graph visualizations
- **Type Relationship**: G2Spec and GraphOptions relate to underlying G2/G6 libraries
- **Canvas Dependency**: `canvas` package enables server-side rendering without browser

## Zod Schema Architecture
- **Schema Conversion**: `zodToJsonSchema()` converts Zod schemas to MCP tool input schemas
- **Complex Validation**: `.refine()` pattern for nodes/edges uniqueness, tree structure validation
- **Base Composition**: Shared schemas like `ThemeSchema`, `WidthSchema` composed across chart types

## Chart Configuration Patterns
- **G2 Properties**: `stack`, `group`, `innerRadius`, `binNumber` for chart-specific behavior
- **G6 Properties**: node/edge data structures, layout algorithms for graph visualizations
- **Theme System**: `THEME_MAP` for G2 charts, `G6THEME_MAP` for G6 charts

## Build System & Module Resolution
- **ES Modules**: `tsc-alias` adds `.js` extensions for ES module compatibility
- **Module Type**: `package.json` has `type: "module"` affecting import/export behavior
- **Directory Mapping**: `build/` structure mirrors `src/` after TypeScript compilation

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
- **Linting Exclusions**: Biome ignores vendored files (`src/render/utils.ts`, `src/render/constant.ts`)
- **Git Hooks**: Husky + lint-staged runs on commit, bypass with `--no-verify`
- **Debugging**: `npm run start` uses MCP inspector for interactive tool testing

## Critical Files & Locations
- **Chart Definitions**: `src/charts/*.ts` - Each exports `{ schema, tool }` with Zod validation
- **Render Pipeline**: `src/render/vis/*.ts` - Chart-specific rendering functions using SSR packages
- **Type Definitions**: `src/render/vis/types.ts` - Base types and union definitions
- **Validation Logic**: `src/utils/validator.ts` - Zod schemas for complex data structures
- **Entry Points**: `src/index.ts` (CLI), `src/server.ts` (MCP server), `src/sdk.ts` (programmatic)
- **Vendored Code**: `src/render/utils.ts` and `src/render/constant.ts` copied from GPT-Vis (many `any` types)