import json
from llm_main import llm  # Assuming this is your initialized LLM instance
from textwrap import dedent

# It's better practice to define the agent names as simple strings
# rather than passing the function objects into the prompt.
AGENT_DEFINITIONS = {
    "create_data_analysis_agent": "Analyzes the user's financial data to find stats, trends, and anomalies. This should almost always be the first step.",
    "create_research_agent": "Performs external research online for information not in the user's data (e.g., flight costs, product prices, investment tips).",
    "create_visualization_points": "Generates structured JSON data for charts. Use only when the user explicitly asks for a graph, chart, or visualization.",
    "planner": "Synthesizes all gathered information into a final, actionable plan or roadmap. This should usually be the last step.",
    "investment_agent": "Analyzes investment options and suggests the best investment or loan schemes based on the user's financial data and requirements."
}

def deciding_agent(query: str) -> list:
    """
    Uses an LLM to decide which agents to run in what order.
    Returns a proper Python list of agent names.
    """
    
    # Create a clean, readable list of tools for the prompt
    tools_description = "\n".join(f"- `{name}`: {desc}" for name, desc in AGENT_DEFINITIONS.items())

    prompt = dedent(f"""
        You are an expert router agent. Your job is to analyze a user's query and decide which tools (agents) need to be run in a specific sequence to answer it.

        **User Query:** "{query}"

        **Available Tools:**
        {tools_description}

        **Your Task:**
        Based on the user's query, return a JSON array of strings listing the tool names to be executed in the correct order. Your entire response must ONLY be the JSON array. Do not provide any explanation, comments, or other text.

        **Example 1:**
        User Query: "Analyze my spending and show me a chart."
        Your Response:
        ["create_data_analysis_agent", "create_visualization_points"]

        **Example 2:**
        User Query: "How much would a trip to Goa cost, and can you create a savings plan for me based on my transaction history?"
        Your Response:
        ["create_data_analysis_agent", "create_research_agent", "planner"]
    """)

    response = llm.invoke(prompt)
    
    # Extract the string content from the LLM response object
    if hasattr(response, 'content'):
        response_str = response.content
    else:
        response_str = str(response)

    # --- Key Part: Clean and Parse the JSON string into a real list ---
    try:
        # Clean up potential markdown fences and extra whitespace
        clean_str = response_str.strip().replace("```json", "").replace("```", "")
        
        # Parse the cleaned string into a Python list
        agent_list = json.loads(clean_str)
        
        # Final check to ensure it's a list
        if isinstance(agent_list, list):
            return agent_list
        else:
            print(f"Warning: LLM returned valid JSON, but it was not a list. Output: {agent_list}")
            return []

    except json.JSONDecodeError:
        print(f"Error: Failed to decode JSON from LLM output: '{response_str}'")
        # Return an empty list to prevent the main application from crashing
        return []