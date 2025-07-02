# Chart Generation Testing Plan

## Overview
Manual end-to-end testing strategy to validate chart generation across all 15 chart types with comprehensive property and configuration coverage. Focus on happy path testing with some stress tests for commonly used charts.

## Expected Test Output
- **15 chart types** × **2-4 configurations each** = ~45 test cases
- **File generation confirmation** for each test case
- **Performance metrics** logged when monitoring enabled
- **Clear pass/fail status** for each test
- **Summary report** with timing and file size information

## Test Implementation Requirements
- **Node.js script** using `generateChartUrl()` function
- **Mock data generators** for each chart type with realistic datasets
- **Configuration matrix** testing different property combinations
- **Output validation** by checking successful file generation
- **Performance logging** when monitoring is enabled

## File Output Requirements
- **Output directory**: `test-charts/` (gitignored)
- **File naming**: Clear, descriptive names like:
  - `line-basic-default-600x400.png`
  - `column-grouped-academy-800x600.png`
  - `pie-donut-stress-1200x800.png`
  - `network-graph-basic-default-600x400.png`
- **Flat structure**: All files in single directory (no subdirectories)

## Dimension Testing
- **Three standard sizes** for basic tests of each chart type:
  - Small: 600×400 (default)
  - Medium: 800×600 
  - Large: 1200×800
- **Rotate through sizes** for basic test of each chart type
- **Use default size** (600×400) for variant/stress tests unless size is specifically being tested

## Chart Types & Configurations to Test

### Most Common Charts (Include Stress Tests)
**Line Chart**
- Basic: 10 data points, single series
- Grouped: 10 data points, 3 groups
- Stress: 1000+ data points, single series
- Props: `theme` (default/academy), `title`, `axisXTitle`, `axisYTitle`, `width`/`height`

**Column Chart** 
- Basic: 5 categories, single values
- Grouped: 5 categories, 3 groups
- Stacked: 5 categories, 3 groups
- Stress: 100+ categories
- Props: `group` (true/false), `stack` (true/false), `theme`, `title`, `axisXTitle`, `axisYTitle`

**Bar Chart**
- Basic: 5 categories, single values
- Grouped: 5 categories, 2 groups
- Stress: 100+ categories
- Props: `group` (true/false), `theme`, `title`, `axisXTitle`, `axisYTitle`

**Dual-Axes Chart**
- Basic: Column + line series with categories
- Complex: Multiple series combinations
- Stress: 50+ categories with multiple series
- Props: `series` (column/line combinations), `categories`, `theme`, `title`, `axisXTitle`

### All Chart Types (Basic + One Variant Each)

**Area Chart**
- Basic: 10 points, single series
- Stacked: 10 points, 3 series
- Props: `stack` (true/false), `theme`, `title`, `axisXTitle`, `axisYTitle`

**Pie Chart**
- Basic: 6 slices
- Donut: 6 slices with innerRadius
- Props: `innerRadius` (0, 0.3, 0.6), `theme`, `title`, `width`/`height`

**Scatter Chart**
- Basic: 20 points with x/y values
- Props: `theme`, `title`, `axisXTitle`, `axisYTitle`

**Radar Chart**
- Basic: 5 dimensions, 2 series
- Props: `theme`, `title`

**Histogram Chart**
- Basic: 100 random values
- Custom bins: 100 values with binNumber
- Props: `binNumber` (10, 20, 50), `theme`, `title`, `axisXTitle`, `axisYTitle`

**Treemap Chart**
- Basic: Hierarchical data, 3 levels deep
- Props: `theme`, `title`

**Word Cloud Chart**
- Basic: 30 words with frequencies
- Props: `theme`, `title`

**Network Graph**
- Basic: 8 nodes, 12 edges with labels
- Props: `theme`, `title`, `width`/`height`

**Flow Diagram**
- Basic: 6 nodes, 8 directed edges
- Props: `theme`, `title`

**Mind Map**
- Basic: 3-level hierarchy with 15+ nodes
- Props: `theme`, `title`

**Fishbone Diagram**
- Basic: Main problem with 4 categories, 3 causes each
- Props: `theme`, `title`

## Test Data Structure Requirements

### G2 Charts Data Patterns
```javascript
// Line/Area: time series
[{ time: '2023-01', value: 100, group?: 'A' }]

// Column/Bar: categorical
[{ category: 'Product A', value: 150, group?: 'Q1' }]

// Pie: category-value pairs
[{ category: 'Segment A', value: 25 }]

// Scatter: x-y coordinates
[{ x: 10, y: 20, category?: 'Type A' }]

// Radar: multi-dimensional
[{ group: 'Series A', name: 'Metric 1', value: 80 }]

// Histogram: raw values
[45, 67, 23, 89, 12, ...]

// Dual-axes: structured series
{ categories: ['Jan', 'Feb'], series: [{ type: 'column', data: [100, 120] }] }
```

### G6 Charts Data Patterns
```javascript
// Network/Flow: nodes + edges
{ nodes: [{ name: 'Node A' }], edges: [{ source: 'Node A', target: 'Node B', name?: 'connects' }] }

// Mind Map/Fishbone: hierarchical
{ name: 'Root', children: [{ name: 'Branch 1', children: [...] }] }
```

---
*This document provides complete specifications for building an end-to-end chart generation testing system with concrete requirements and examples.*