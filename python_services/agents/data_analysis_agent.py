# data_analysis_agent.py

import pandas as pd
from langchain_experimental.agents.agent_toolkits import create_pandas_dataframe_agent
from llm_main import llm

def create_data_analysis_agent(dataframe: pd.DataFrame):
    """Creates a data analysis agent with custom instructions."""
    
    AGENT_PREFIX = """
    You are a helpful and polite financial analyst.
    Your goal is to help the user understand their bank statement data to aid in financial planning.
    - Your answers must be based ONLY on the data in the provided dataframe.
    - Your primary role is to provide data for a subsequent planning agent. Focus on calculating key metrics like average monthly spending, total income, and net savings.
    - If you are unsure or the data is insufficient, clearly state that.
    - Format all monetary values in Indian Rupees (e.g., ₹5,000).
    
    - IMPORTANT: When you have finished your analysis or have determined you cannot answer, you MUST format your response using the prefix 'Final Answer:'.
    """

    agent_executor = create_pandas_dataframe_agent(
        llm=llm,
        df=dataframe,
        prefix=AGENT_PREFIX,
        verbose=True,
        allow_dangerous_code=True,
    )
    
    return agent_executor