from agents.llm_main import llm
from agents.data_analysis_agent import create_data_analysis_agent
import pandas as pd

def investment_analysis(dataframe):
    """Creates an investment analysis agent using the data analysis agent."""
    bank_analysis = create_data_analysis_agent(dataframe)
    return bank_analysis

def investment_agent(query, context):
    """Returns the investment analysis agent from the context."""
    icici_df = pd.read_csv('icici_one.csv')
    bank_analysis = investment_analysis(icici_df)
    
    data_analysis = context.get('data_analysis', 'No analysis available.')
    data_research = context.get('data_research', 'No research available.')
    
    prompt = f"""
        You are a helpful financial investment assistant.

        User Query: {query}

        User's Bank Statement Analysis: {data_analysis}

        Product Research Information: {data_research}

        ICICI Bank Schemes and Policies: {bank_analysis}

        Your task is to find the best investment/loan schemes according to the user's requirements.
        Provide a detailed recommendation with reasoning.
    """
    
    llm_response = llm.invoke(prompt)
    if hasattr(llm_response, 'content'):
        return llm_response.content
    return str(llm_response)

