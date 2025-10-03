# main.py
import pandas as pd
import json

# Import your custom agent creation functions and the LLM instance

from llm_main import llm
from investment import investment_agent

def planner(query: str,context: dict):
        """
        Generates the final financial plan using the context from previous steps.
        """
        data_analysis = context.get('data_analysis', 'No analysis available.')
        data_research = context.get('data_research', 'No research available.')
        investment = context.get('investment', 'No investment info available.')
        # This prompt is now much more effective.
        prompt = f"""
            You are a helpful financial planning assistant.
            A user wants to achieve the following goal: "{query}"

            Important User Constraint: The user has a strict requirement to "keep at least 5k at the end of all days." All suggestions must respect this rule.

            Based on the data analysis and research below, create a personalized financial plan.

            Data Analysis Summary: "{data_analysis}"
            Research Summary: "{data_research}"
            If the user has any recommended investment plans you will get it from {investment} 
            Your Task:
            1.  First, check if the user's goal "{query}" sounds like they are asking for a financial plan or roadmap.
            2.  If they are, create a clear, actionable financial plan with specific steps.
            3.  Analyze their expenses and identify specific areas for savings (e.g., Zomato/Swiggy, food, etc.). Provide practical suggestions for reducing these costs while adhering to their 5k savings rule.
            4.  If the user's query does NOT seem to be asking for a plan (e.g., "summarize my expenses"), then simply provide a concise summary of the analysis and research instead of a full plan.
            5.  Structure the output in clean markdown. Keep the entire response under 250 words or IF USER HAS SPECIFIED ANY LENGTH , GIVE IN THAT .
            """
        
        
        final_plan = llm.invoke(prompt)
        context['plan'] = final_plan
        
        if hasattr(final_plan, 'content'):
              return final_plan.content
        return str(final_plan)

