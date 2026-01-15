import sys
import json
import os
import requests

# Chart type mapping, consistent with src/utils/callTool.ts
CHART_TYPE_MAP = {
    "generate_area_chart": "area",
    "generate_bar_chart": "bar",
    "generate_boxplot_chart": "boxplot",
    "generate_column_chart": "column",
    "generate_district_map": "district-map",
    "generate_dual_axes_chart": "dual-axes",
    "generate_fishbone_diagram": "fishbone-diagram",
    "generate_flow_diagram": "flow-diagram",
    "generate_funnel_chart": "funnel",
    "generate_histogram_chart": "histogram",
    "generate_line_chart": "line",
    "generate_liquid_chart": "liquid",
    "generate_mind_map": "mind-map",
    "generate_network_graph": "network-graph",
    "generate_organization_chart": "organization-chart",
    "generate_path_map": "path-map",
    "generate_pie_chart": "pie",
    "generate_pin_map": "pin-map",
    "generate_radar_chart": "radar",
    "generate_sankey_chart": "sankey",
    "generate_scatter_chart": "scatter",
    "generate_treemap_chart": "treemap",
    "generate_venn_chart": "venn",
    "generate_violin_chart": "violin",
    "generate_word_cloud_chart": "word-cloud",
}

def get_vis_request_server():
    """Get the VIS_REQUEST_SERVER from environment variables."""
    return os.environ.get(
        "VIS_REQUEST_SERVER", "https://antv-studio.alipay.com/api/gpt-vis"
    )

def get_service_identifier():
    """Get the SERVICE_ID from environment variables."""
    return os.environ.get("SERVICE_ID")

def generate_chart_url(chart_type, options):
    """
    Generate a chart URL using the provided configuration.
    Ported from src/utils/generate.ts -> generateChartUrl
    """
    url = get_vis_request_server()
    payload = {
        "type": chart_type,
        "source": "mcp-server-chart",
        **options
    }
    
    response = requests.post(
        url,
        json=payload,
        headers={"Content-Type": "application/json"}
    )
    response.raise_for_status()
    
    data = response.json()
    if not data.get("success"):
        raise Exception(data.get("errorMessage", "Unknown error"))
    
    return data.get("resultObj")

def generate_map(tool, input_data):
    """
    Generate a map.
    Ported from src/utils/generate.ts -> generateMap
    """
    url = get_vis_request_server()
    payload = {
        "serviceId": get_service_identifier(),
        "tool": tool,
        "input": input_data,
        "source": "mcp-server-chart",
    }
    
    response = requests.post(
        url,
        json=payload,
        headers={"Content-Type": "application/json"}
    )
    response.raise_for_status()
    
    data = response.json()
    if not data.get("success"):
        raise Exception(data.get("errorMessage", "Unknown error"))
    
    return data.get("resultObj")

def main():
    if len(sys.argv) < 2:
        print("Usage: python generate.py <spec_json_or_file>")
        sys.exit(1)

    spec_arg = sys.argv[1]
    
    # Try to load as JSON string first, then as a file path
    try:
        if os.path.isfile(spec_arg):
            with open(spec_arg, 'r', encoding='utf-8') as f:
                spec = json.load(f)
        else:
            spec = json.loads(spec_arg)
    except Exception as e:
        print(f"Error parsing spec: {e}")
        sys.exit(1)

    # Handle both single spec or a list of specs (for "25 charts")
    if isinstance(spec, list):
        specs = spec
    else:
        specs = [spec]

    for item in specs:
        tool = item.get("tool")
        args = item.get("args", {})
        
        if not tool:
            # If 'tool' is not present, maybe the whole item is the args and 'type' is provided?
            # But the user mentioned "25 tools", so we expect tool names.
            print(f"Error: 'tool' field missing in spec: {item}")
            continue

        chart_type = CHART_TYPE_MAP.get(tool)
        if not chart_type:
            print(f"Error: Unknown tool '{tool}'")
            continue

        is_map_chart_tool = tool in [
            "generate_district_map",
            "generate_path_map",
            "generate_pin_map",
        ]

        try:
            if is_map_chart_tool:
                result = generate_map(tool, args)
                # For maps, extract the text content which contains the URL
                if isinstance(result, dict) and "content" in result:
                    for content_item in result["content"]:
                        if content_item.get("type") == "text":
                            print(content_item.get("text"))
                else:
                    print(json.dumps(result))
            else:
                url = generate_chart_url(chart_type, args)
                print(url)
        except Exception as e:
            print(f"Error generating chart for {tool}: {e}")

if __name__ == "__main__":
    main()
