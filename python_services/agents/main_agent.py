from data_analysis_agent import create_data_analysis_agent
from research_agent import create_research_agent
from visualizing_agent import create_visualization_points
from decider_agent import deciding_agent
import pandas as pd
from planning_agent import planner
from llm_main import llm
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

            else:
                print(f"Unknown agent: {agent_name}")
        
        # Determine the final output based on what was generated
        self.final_output = self._determine_final_output(agent_list)
        return self.final_output

    def _determine_final_output(self, agent_list):
        """
        Determines what to return based on the agents that were executed.
        Priority: plan > research > data_analysis > visualization
        """
        # If planner ran, return the plan (highest priority - comprehensive output)
        if 'plan' in self.results:
            return self.results['plan']
        
        # If research ran without planner, return research
        if 'research' in self.results:
            return self.results['research']
        
        # If only data analysis ran, return that
        if 'data_analysis' in self.results:
            return self.results['data_analysis']
        
        # If only visualization ran, return visualization data
        if 'visualization' in self.results:
            return self.results['visualization']
        
        # Fallback: return all results
        return self.results

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


if __name__ == '__main__':
    try:
        df = pd.read_csv('BS1.csv')
    except FileNotFoundError:
        print("Error: BS1.csv not found. Please make sure the file is in the same directory.")
        exit()

    query = input("What is your financial goal? (e.g., 'Create a plan for a trip to Goa'): ")
    
    pipeline = FinWellAgent(df, query)
    
    # Get the final output
    final_output = pipeline.run_pipeline()
    
    print("\n" + "="*50)
    print("FINAL OUTPUT:")
    print("="*50)
    print(final_output)
    
    # Optional: Access all intermediate results if needed
    # all_results = pipeline.get_all_results()
    # print("\nAll Results:", all_results)