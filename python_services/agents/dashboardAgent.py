from langchain.prompts import PromptTemplate
from llm_main import llm
import pandas as pd
import json
import re

def create_dashboard_agent(df: pd.DataFrame, date_column: str = 'Date', amount_column: str = 'Amount', type_column: str = 'Type'):
    """
    Generates monthly and total credit/debit summary JSON from a bank statement dataframe.
    
    Args:
        df: DataFrame with bank transactions
        date_column: Name of the date column
        amount_column: Name of the amount column  
        type_column: Column indicating credit/debit (if exists)
    """
    
    # Validate columns exist
    if date_column not in df.columns or amount_column not in df.columns:
        return {"error": f"Required columns not found. Available: {list(df.columns)}"}
    
    # Sample data if too large (keep first/last rows + random sample)
    if len(df) > 100:
        sample_df = pd.concat([
            df.head(20),
            df.sample(min(60, len(df) - 40)),
            df.tail(20)
        ]).sort_values(date_column)
        csv_data = sample_df.to_csv(index=False)
        note = f"\n\nNote: This is a sample of {len(sample_df)} rows from {len(df)} total transactions."
    else:
        csv_data = df.to_csv(index=False)
        note = ""

    # Prompt template
    prompt = PromptTemplate.from_template("""
    You are a financial analyst. Analyze this bank statement and calculate monthly summaries.

    Dataset:
    {data}{note}

    Instructions:
    1. Parse the '{date_col}' column to extract YYYY-MM
    2. Identify credit (money in) vs debit (money out) transactions
    3. Sum amounts by month and type
    4. Calculate total credits and debits

    Return ONLY valid JSON (no markdown, no extra text):
    {{
    "monthly_summary": [
        {{"DrCr": "cr", "Month": "YYYY-MM", "amount": 1234.56}},
        {{"DrCr": "db", "Month": "YYYY-MM", "amount": 5678.90}}
    ],
    "total_summary": [
        {{"DrCr": "cr", "amount": 12345.67}},
        {{"DrCr": "db", "amount": 67890.12}}
    ]
    }}
    """)

    # Call LLM
    try:
        output = (prompt | llm).invoke({
            "data": csv_data,
            "note": note,
            "date_col": date_column
        })
        
        # Handle different output types
        if hasattr(output, 'content'):
            output_text = output.content
        else:
            output_text = str(output)
        
        # Clean output - remove markdown code blocks and extra text
        output_text = output_text.strip()
        
        # Remove markdown code blocks
        output_text = re.sub(r'```json\s*', '', output_text)
        output_text = re.sub(r'```\s*', '', output_text)
        
        # Remove "Final Answer:" prefix if present
        if "Final Answer:" in output_text:
            output_text = output_text.split("Final Answer:")[-1].strip()
        
        # Try to find JSON object
        json_match = re.search(r'\{[\s\S]*\}', output_text)
        if json_match:
            output_text = json_match.group(0)
        
        # Parse JSON
        result = json.loads(output_text)
        
        # Validate structure
        if "monthly_summary" in result and "total_summary" in result:
            return result
        else:
            return {"error": "Invalid JSON structure", "raw_output": output_text}
            
    except json.JSONDecodeError as e:
        return {"error": f"JSON parsing failed: {str(e)}", "raw_output": output_text}
    except Exception as e:
        return {"error": f"Unexpected error: {str(e)}"}