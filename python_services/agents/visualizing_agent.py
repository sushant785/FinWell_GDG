#visualizatin agent 

import pandas as pd
import json
from textwrap import dedent
from agents.llm_main import llm


def create_visualization_points(query: str, context: dict, df: pd.DataFrame) -> str:
    """
    Simple visualization - returns chart coordinates.
    
    Args:
        query: User's query
        context: Context dict with other agent results
        df: DataFrame with bank statement data
    
    Returns:
        JSON string with chart data and coordinates
    """
    print(f"\n🎨 VISUALIZATION AGENT")
    print(f"Query: {query}")
    print(f"✓ DataFrame: {df.shape[0]} rows × {df.shape[1]} columns")
    
    # Ask LLM for chart config
    prompt = f"""
Bank statement columns: {df.columns.tolist()}

Sample data:
{df.head(2).to_string()}

User query: "{query}"

Return ONLY this JSON:
{{
  "chart_type": "bar",
  "group_by": "month",
  "value_column": "Debit",
  "aggregation": "sum"
}}

Rules:
- chart_type: "bar", "line", or "pie"
- group_by: "month" (for Date column), "Description", or column name
- value_column: "Credit", "Debit", or "Balance"
- aggregation: "sum", "count", or "avg"
"""
    
    try:
        response = llm.invoke(prompt)
        content = response.content.strip().replace('json', '').replace('', '').strip()
        config = json.loads(content)
        print(f"✓ Config: {config}")
    except Exception as e:
        print(f"⚠ Using default config (LLM error: {e})")
        config = {
            "chart_type": "bar",
            "group_by": "month",
            "value_column": "Debit",
            "aggregation": "sum"
        }
    
    # Process data
    df = df.copy()
    
    # Convert Date column
    if 'Date' in df.columns:
        df['Date'] = pd.to_datetime(df['Date'], format='%d-%m-%Y', errors='coerce')
    
    group = config.get('group_by', 'month')
    value = config.get('value_column', 'Debit')
    agg = config.get('aggregation', 'sum')
    
    # Handle month grouping
    if group == 'month' and 'Date' in df.columns:
        df['month'] = df['Date'].dt.strftime('%b %Y')
        group = 'month'
    
    # Aggregate data
    try:
        if agg == 'sum':
            chart_df = df.groupby(group)[value].sum().reset_index()
        elif agg == 'count':
            chart_df = df.groupby(group)[value].count().reset_index()
        else:  # avg
            chart_df = df.groupby(group)[value].mean().reset_index()
        
        # Sort by value and limit to top 12
        chart_df = chart_df.sort_values(value, ascending=False).head(12)
        
        print(f"✓ Aggregated to {len(chart_df)} data points")
        
    except Exception as e:
        print(f"❌ Aggregation failed: {e}")
        return json.dumps({
            "error": f"Failed to aggregate data: {e}",
            "chart_type": "bar",
            "data": []
        })
    
    # Create coordinate data
    data = []
    for _, row in chart_df.iterrows():
        data.append({
            "x": str(row[group]),
            "y": round(float(row[value]), 2)
        })
    
    # Build result
    result = {
        "chart_type": config['chart_type'],
        "title": f"{value} by {group.capitalize()}",
        "x_label": group.capitalize(),
        "y_label": f"{value} (₹)",
        "data": data
    }
    
    print(f"✓ Generated {len(data)} points")
    print(f"   Sample: {data[:2]}")
    
    return json.dumps(result, indent=2)