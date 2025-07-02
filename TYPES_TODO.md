# Types Architecture TODO

## Investigation Summary

### Current State
We currently extend G2/G6 SSR types with convenience properties that recreate functionality from the removed `@antv/gpt-vis` dependency.

### The History
1. **Originally**: Used `@antv/gpt-vis` - a higher-level wrapper library around G2/G6
2. **gpt-vis provided**: Convenient chart-specific properties:
   - `axisXTitle`, `axisYTitle` (axis titles)
   - `theme` (theme selection) 
   - `title` (chart title)
   - `stack`, `group` (chart behavior)
   - `innerRadius`, `binNumber`, `series`, `categories` (chart-specific configs)
3. **During refactoring**: Removed gpt-vis dependency and vendored/reimplemented functionality
4. **SSR types**: `G2Options`/`G6Options` are low-level rendering options containing:
   - `G2Spec`/`GraphOptions` (raw chart specifications)
   - `width`, `height` (required dimensions)
   - `devicePixelRatio`, `waitForRender`, `outputType`, `imageType` (rendering configs)

### What SSR Types Don't Include
The SSR types are foundational but minimal - they **don't include** gpt-vis conveniences:
- ❌ No `theme` selection
- ❌ No `title` for charts
- ❌ No `axisXTitle`/`axisYTitle` convenience props  
- ❌ No chart-specific props like `stack`, `group`, `innerRadius`

### Current Implementation
We're essentially **recreating gpt-vis functionality** by:
- Taking simple props like `axisXTitle`
- Converting them to complex G2Spec configurations
- Passing those to SSR libraries

## Decision Point

We have two architectural paths:

### Option 1: Keep Convenience Layer (Current Approach)
**Pros:**
- Easier for users - simple props like `axisXTitle: "Sales"`
- Maintains backward compatibility
- Familiar API for existing gpt-vis users

**Cons:**
- More code to maintain (we're essentially maintaining gpt-vis functionality)
- Abstraction layer that could get out of sync with G2/G6 updates
- Duplicates functionality that existed in gpt-vis

### Option 2: Use Raw G2Spec/GraphOptions
**Pros:**
- Direct access to full G2/G6 power and flexibility
- No abstraction layer to maintain
- Always up-to-date with latest G2/G6 features
- Smaller codebase

**Cons:**
- Much more complex for users
- Breaking change for existing API
- Users need to understand G2Spec format
- Example: Instead of `axisXTitle: "Sales"`, users would need:
  ```javascript
  axis: { x: { title: "Sales" } }
  ```

## Current Status
- ✅ **Removed gpt-vis dependency** (completed)
- 🔄 **Using convenience layer** (current implementation)
- ❓ **Architecture decision pending**

## Next Steps
1. **Short term**: Implement proper extends pattern with convenience properties
2. **Long term**: Decide between convenience layer vs raw G2Spec approach
3. **Consider**: Could we contribute convenience types back to the AntV ecosystem?

## Files Affected
- `src/render/vis/types.ts` - Type definitions
- `src/render/vis/*.ts` - All chart implementations
- `src/charts/*.ts` - Chart schemas and validation

---
*Created: 2025-07-02*
*Status: Investigation complete, architecture decision pending*