import json
from textwrap import dedent
from agents.llm_main import llm

# I'm assuming 'llm' is your initialized language model object, e.g., from LangChain or a similar library.
# from llm_main import llm 

def create_visualization_points(query: str, context: dict) -> str:
    """
    Generates structured JSON data for front-end visualizations based on a query and context.
    """
    data_analysis = context.get('data_analysis', 'No analysis available.')
    data_research = context.get('data_research', 'No research available.')

    # Using dedent to remove leading whitespace makes the prompt easier to read in the code.
    prompt = dedent(f"""
        **ROLE:**
        You are an expert data visualization assistant. Your task is to convert analytical and research data into a structured JSON format suitable for a front-end charting library.

        **CONTEXT:**
        1.  **User's Query:** "{query}"
        2.  **Data Analysis Provided:** "{data_analysis}"
        3.  **Research Data Provided:** "{data_research}"

        **TASK:**
        1.  Analyze the provided CONTEXT.
        2.  Based on the data, decide the most effective type of visualization (e.g., "bar", "line", "pie", "scatter").
        3.  Generate the data points required for that visualization.
        4.  Format your entire output as a single, valid JSON object. Do NOT include any explanations, comments, or markdown formatting like ```json.

        **OUTPUT FORMAT (Strict JSON):**
        Provide your response in the following JSON structure:
        {{
          "chart_type": "string (e.g., 'bar', 'line')",
          "title": "A concise and descriptive title for the chart",
          "description": "A brief one-sentence explanation of what the chart shows",
          "data": [
            {{ "key1": "value1", "key2": "value2" }},
            {{ "key3": "value3", "key4": "value4" }}
          ]
        }}
        
        **EXAMPLE:**
        If the query was about monthly expenses, the output might look like this:
        {{
          "chart_type": "bar",
          "title": "Monthly Credits vs. Debits",
          "description": "A comparison of total credits and debits for each month.",
          "data": [
            {{ "type": "credit", "month": "2022-01", "amount": 5808.09 }},
            {{ "type": "debit", "month": "2022-01", "amount": 42984.0 }},
            {{ "type": "credit", "month": "2022-02", "amount": 58228.0 }},
            {{ "type": "debit", "month": "2022-02", "amount": 90535.0 }}
          ]
        }}
    """)

    # Assuming llm.invoke returns an object with a 'content' attribute or a raw string
    response = llm.invoke(prompt)
    
    # It's good practice to clean the output to ensure it's valid JSON
    if hasattr(response, 'content'):
        clean_response = response.content.strip().replace("```json", "").replace("```", "")
    else:
        clean_response = str(response).strip().replace("```json", "").replace("```", "")
        
    # Optional: Validate that the output is actually parsable JSON before returning
    try:
        json.loads(clean_response)
        context['visualization'] = clean_response  # Store in context for potential future use
        return clean_response
    except json.JSONDecodeError:
        # Handle the error, maybe by returning a default error JSON
        print("Error: LLM did not return valid JSON.")
        return '{ "error": "Failed to generate valid visualization data." }'