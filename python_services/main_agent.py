# from agents.data_analysis_agent import create_data_analysis_agent
# from agents.research_agent import create_research_agent
# from agents.visualizing_agent import create_visualization_points
# from agents.decider_agent import deciding_agent
# import pandas as pd
# from agents.planning_agent import planner
# # from agents.llm_main import llm
# from agents.investment import investment_agent
# import json


# class FinWellAgent:
#     def __init__(self, dataframe, query):
#         self.df = dataframe
#         self.context = {}
#         self.query = query
#         self.results = {}  # Store all agent results
#         self.final_output = None  # Store the final user-facing output

#     def run_pipeline(self):
#         """
#         Executes the full pipeline and returns the appropriate output based on agents run.
#         """
#         agent_list = deciding_agent(self.query)
#         print(f"\n--- Agents to Run: {agent_list} ---")

#         for agent_name in agent_list:
#             if agent_name == "create_data_analysis_agent":
#                 print("\n--- Step 1: Data Analysis ---")
#                 analysis = create_data_analysis_agent(self.df)
#                 self.context['data_analysis'] = analysis
#                 self.results['data_analysis'] = analysis
#                 print(analysis)

#             elif agent_name == "create_research_agent":
#                 print("\n--- Step 2: Research ---")
#                 research = create_research_agent(self.query, self.context)
#                 self.context['data_research'] = research
#                 self.results['research'] = research
#                 print(research)

#             elif agent_name == "create_visualization_points":
#                 print("\n--- Step 3: Creating Visualization Points ---")
#                 visualization = create_visualization_points(self.query, self.context)
#                 self.context['visualization'] = visualization
#                 self.results['visualization'] = visualization
#                 print(visualization)

#             elif agent_name == "planner":
#                 print("\n--- Step 4: Generating Final Plan ---")
#                 plan = planner(self.query, self.context)
#                 self.context['plan'] = plan
#                 self.results['plan'] = plan
#                 print(plan)
            
#             elif agent_name == "investment_agent":
#                 print("\n--- Step 5: Investment Analysis ---")
#                 investment = investment_agent(self.query, self.context)
#                 self.context['investment'] = investment
#                 self.results['investment'] = investment
#                 print(investment)

#             else:
#                 print(f"Unknown agent: {agent_name}")
        
#         # Determine the final output based on what was generated
#         self.final_output = self._determine_final_output(agent_list)
#         return self.final_output

#     def _determine_final_output(self, agent_list):
#         """
#         Determines what to return based on the agents that were executed.
#         Priority: plan > research > data_analysis > visualization
#         """
#         # If planner ran, return the plan (highest priority - comprehensive output)
#         if 'plan' in self.results:
#             return self.results['plan']
        
#         # If research ran without planner, return research
#         if 'research' in self.results:
#             return self.results['research']
        
#         # If only data analysis ran, return that
#         if 'data_analysis' in self.results:
#             return self.results['data_analysis']
        
#         if 'investment' in self.results:
#             return self.results['investment']
        
#         # If only visualization ran, return visualization data
#         if 'visualization' in self.results:
#             return self.results['visualization']
        
#         # Fallback: return all results
#         return self.results

#     def get_all_results(self):
#         """
#         Returns all intermediate results for debugging or detailed analysis.
#         """
#         return self.results

#     def get_context(self):
#         """
#         Returns the full context for inspection.
#         """
#         return self.context


# if __name__ == '__main__':
#     try:
#         df = pd.read_csv('BS1.csv')
#     except FileNotFoundError:
#         print("Error: BS1.csv not found. Please make sure the file is in the same directory.")
#         exit()

#     query = input("What is your financial goal? (e.g., 'Create a plan for a trip to Goa'): ")
    
#     pipeline = FinWellAgent(df, query)
    
#     # Get the final output
#     final_output = pipeline.run_pipeline()
    
#     print("\n" + "="*50)
#     print("FINAL OUTPUT:")
#     print("="*50)
#     print(final_output)
    
#     # Optional: Access all intermediate results if needed
#     # all_results = pipeline.get_all_results()
#     # print("\nAll Results:", all_results)

# python_services/main_agent.py (Corrected version with all methods included)

from agents.data_analysis_agent import create_data_analysis_agent
from agents.research_agent import create_research_agent
from agents.visualizing_agent import create_visualization_points
from agents.decider_agent import deciding_agent
import pandas as pd
from agents.planning_agent import planner
from agents.investment import investment_agent
import json


class FinWellAgent:
    def __init__(self, dataframe, query):
        self.df = dataframe
        self.context = {}
        self.query = query
        self.results = {}  # Store all agent results
        self.final_output = None  # Store the final user-facing output

    def run_pipeline(self):
        """
        Executes the full pipeline and returns the appropriate output based on agents run.
        """
        agent_list = deciding_agent(self.query)
        print(f"\n--- Agents to Run: {agent_list} ---")

        for agent_name in agent_list:
            if agent_name == "create_data_analysis_agent":
                print("\n--- Step 1: Data Analysis ---")
                analysis = create_data_analysis_agent(self.df)
                self.context['data_analysis'] = analysis
                self.results['data_analysis'] = analysis
                print(analysis)

            elif agent_name == "create_research_agent":
                print("\n--- Step 2: Research ---")
                research = create_research_agent(self.query, self.context)
                self.context['data_research'] = research
                self.results['research'] = research
                print(research)

            elif agent_name == "create_visualization_points":
                print("\n--- Step 3: Creating Visualization Points ---")
                visualization = create_visualization_points(self.query, self.context)
                self.context['visualization'] = visualization
                self.results['visualization'] = visualization
                print(visualization)

            elif agent_name == "planner":
                print("\n--- Step 4: Generating Final Plan ---")
                plan = planner(self.query, self.context)
                self.context['plan'] = plan
                self.results['plan'] = plan
                print(plan)
            
            elif agent_name == "investment_agent":
                print("\n--- Step 5: Investment Analysis ---")
                investment = investment_agent(self.query, self.context)
                self.context['investment'] = investment
                self.results['investment'] = investment
                print(investment)

            else:
                print(f"Unknown agent: {agent_name}")
        
        self.final_output = self._determine_final_output()
        return self.final_output

    def _determine_final_output(self):
        """
        Determines what to return based on the agents that were executed.
        Priority: plan > research > investment > data_analysis > visualization
        """
        if 'plan' in self.results:
            return self.results['plan']
        
        if 'research' in self.results:
            return self.results['research']

        if 'investment' in self.results:
            return self.results['investment']
            
        if 'data_analysis' in self.results:
            return self.results['data_analysis']
        
        if 'visualization' in self.results:
            return self.results['visualization']
        
        return self.results

    # --- ADDED BACK ---
    def get_all_results(self):
        """
        Returns all intermediate results for debugging or detailed analysis.
        """
        return self.results

    def get_context(self):
        """
        Returns the full context for inspection.
        """
        return self.context
    # ------------------


def run_agent_pipeline(query: str, csv_filepath: str):
    """
    Loads data, runs the FinWellAgent pipeline, and returns the final output.
    """
    try:
        df = pd.read_csv(csv_filepath)
    except FileNotFoundError:
        return {"error": f"File not found: {csv_filepath}"}
    except Exception as e:
        return {"error": f"Error reading CSV file: {str(e)}"}

    pipeline = FinWellAgent(df, query)
    final_output = pipeline.run_pipeline()
    return final_output


if __name__ == '__main__':
    csv_file = 'BS1.csv'
    user_query = input(f"What is your financial goal? (using {csv_file}): ")
    
    final_output = run_agent_pipeline(user_query, csv_file)
    
    print("\n" + "="*50)
    print("FINAL OUTPUT:")
    print("="*50)
    print(final_output)