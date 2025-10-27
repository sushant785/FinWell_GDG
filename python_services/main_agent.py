from agents.data_analysis_agent import create_data_analysis_agent
from agents.research_agent import create_research_agent
from agents.visualizing_agent import create_visualization_points
from agents.decider_agent import deciding_agent
from agents.planning_agent import planner
from agents.investment import investment_agent

import pandas as pd
import json
import traceback


class FinWellAgent:
    def __init__(self, dataframe, query):
        """
        Orchestrates all financial intelligence agents.
        """
        self.df = dataframe
        self.query = query
        self.context = {}
        self.results = {}
        self.final_output = None
        self.errors = {}

    # ---------------------------------------------------------------
    # PIPELINE EXECUTION
    # ---------------------------------------------------------------
    def run_pipeline(self):
        """
        Runs agents as per the Decider's instructions.
        Returns a JSON-ready dict with main output + visualization.
        """
        try:
            agent_list = deciding_agent(self.query)
            print(f"\n{'='*60}")
            print(f"🎯 Agents to Run: {agent_list}")
            print(f"{'='*60}\n")

            if not agent_list:
                print("⚠ No agents selected for this query.")
                return {
                    "response": "No agents were selected to process your query.",
                    "visualization": None
                }

            for agent_name in agent_list:
                try:
                    # ------------------ AGENT 1: DATA ANALYSIS ------------------
                    if agent_name == "create_data_analysis_agent":
                        print("\n--- Step 1: Data Analysis ---")
                        analysis = create_data_analysis_agent(self.df)
                        self.context["data_analysis"] = analysis
                        self.results["data_analysis"] = analysis
                        print(f"✓ Data Analysis Complete")

                    # ------------------ AGENT 2: RESEARCH ------------------
                    elif agent_name == "create_research_agent":
                        print("\n--- Step 2: Research ---")
                        research = create_research_agent(self.query, self.context)
                        self.context["data_research"] = research
                        self.results["research"] = research
                        print(f"✓ Research Complete")

                    # ------------------ AGENT 3: VISUALIZATION ------------------
                    elif agent_name == "create_visualization_points":
                        print("\n--- Step 3: Creating Visualization Points ---")
                        visualization = create_visualization_points(self.query, self.context, self.df)
                        self.context["visualization"] = visualization
                        self.results["visualization"] = visualization
                        print(f"✓ Visualization Points Generated")

                    # ------------------ AGENT 4: PLANNING ------------------
                    elif agent_name == "planner":
                        print("\n--- Step 4: Generating Plan ---")
                        plan = planner(self.query, self.context)
                        self.context["plan"] = plan
                        self.results["plan"] = plan
                        print(f"✓ Plan Generated")

                    # ------------------ AGENT 5: INVESTMENT ------------------
                    elif agent_name == "investment_agent":
                        print("\n--- Step 5: Investment Analysis ---")
                        investment = investment_agent(self.query, self.context)
                        self.context["investment"] = investment
                        self.results["investment"] = investment
                        print(f"✓ Investment Analysis Complete")

                    else:
                        print(f"⚠ Unknown agent: {agent_name}")
                        self.errors[agent_name] = "Unknown agent"

                except Exception as e:
                    error_msg = f"Error in {agent_name}: {str(e)}"
                    print(f"❌ {error_msg}")
                    print(f"   Stack trace: {traceback.format_exc()}")
                    self.errors[agent_name] = error_msg
                    continue

            # Determine final structured result
            self.final_output = self._determine_final_output()

            # Append errors if any
            if self.errors:
                self.final_output["errors"] = self.errors

            return self.final_output

        except Exception as e:
            error_msg = f"Critical pipeline error: {str(e)}"
            print(f"❌ {error_msg}\n{traceback.format_exc()}")
            return {
                "response": f"An error occurred while processing your request: {str(e)}",
                "visualization": None,
                "errors": {"critical": str(e)}
            }

    # ---------------------------------------------------------------
    # FINAL OUTPUT DETERMINATION
    # ---------------------------------------------------------------
    def _determine_final_output(self):
        """
        Determines which agent’s result to return.
        Priority: plan > investment > research > data_analysis
        """
        visualization = self.results.get("visualization", None)

        if "plan" in self.results:
            main_response = self.results["plan"]
        elif "investment" in self.results:
            main_response = self.results["investment"]
        elif "research" in self.results:
            main_response = self.results["research"]
        elif "data_analysis" in self.results:
            main_response = self.results["data_analysis"]
        else:
            main_response = "No valid output generated."

        return {
            "response": main_response,
            "visualization": (
                json.loads(visualization)
                if isinstance(visualization, str)
                else visualization
            ),
        }

    # ---------------------------------------------------------------
    # UTILITY GETTERS
    # ---------------------------------------------------------------
    def get_all_results(self):
        return self.results

    def get_context(self):
        return self.context

    def get_errors(self):
        return self.errors


# ---------------------------------------------------------------
# EXTERNAL FUNCTION FOR BACKEND CALLS
# ---------------------------------------------------------------
def run_agent_pipeline(query: str, csv_filepath: str):
    """
    Loads CSV and runs the FinWellAgent pipeline.
    Designed for API/backend use (not CLI).
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
