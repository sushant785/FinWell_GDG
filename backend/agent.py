from flask import Flask, jsonify, request
import pandas as pd
from langchain_experimental.agents.agent_toolkits import create_pandas_dataframe_agent
from langchain_google_genai import GoogleGenerativeAI

# -----------------------------
# CONFIGURATION
# -----------------------------
app = Flask(__name__)
CSV_FILE_PATH = "./uploads/bank_state.csv"   # Your bank statement CSV
API_KEY = "AIzaSyBF6kz6qws1P7wCWklq4kCTL6WKPBHUmLY"                     # Replace with your Google API key

# -----------------------------
# LOAD DATA
# -----------------------------
try:
    df = pd.read_csv(CSV_FILE_PATH)
except Exception as e:
    raise Exception(f"Failed to load CSV: {str(e)}")

# -----------------------------
# SETUP LLM + AGENT
# -----------------------------
llm = GoogleGenerativeAI(model="gemini-1.5-flash-latest", google_api_key=API_KEY)

agent = create_pandas_dataframe_agent(
    llm,
    df,
    verbose=True,
    allow_dangerous_code=True
)

# -----------------------------
# BANK STATEMENT ANALYSIS
# -----------------------------
def analyze_bank_statement(csv_file):
    df = pd.read_csv(csv_file)
    
    # Ensure proper datetime
    df['date'] = pd.to_datetime(df['date'], errors='coerce')
    df['Month'] = df['date'].dt.to_period('M').astype(str)
    df['Week'] = df['date'].dt.isocalendar().week
    
    # Normalize debit/credit
    df['DrCr'] = df['DrCr'].str.strip().str.lower()
    
    credits = df[df['DrCr'] == 'cr']
    debits = df[df['DrCr'] == 'dr']
    
    # 📊 Monthly Credit vs Debit
    monthly_summary = (
        df.groupby(['Month', 'DrCr'])['amount']
        .sum()
        .reset_index()
        .to_dict(orient="records")
    )
    
    # 🥧 Total Credit vs Debit
    total_summary = (
        df.groupby('DrCr')['amount']
        .sum()
        .reset_index()
        .to_dict(orient="records")
    )
    
    # 📈 Weekly spending trend (debits only)
    weekly_summary = (
        debits.groupby('Week')['amount']
        .sum()
        .reset_index()
        .to_dict(orient="records")
    )
    
    return {
        "monthly_summary": monthly_summary,
        "total_summary": total_summary,
        "weekly_summary": weekly_summary
    }

# -----------------------------
# ASK AGENT (LLM on CSV)
# -----------------------------
def ask_agent(prompt: str) -> str:
    """
    Send a natural language prompt to the Pandas DataFrame Agent.
    Returns descriptive analysis about the CSV.
    """
    try:
        response = agent.invoke(prompt)
        if isinstance(response, dict):
            result = response.get("output") or response.get("output_text") or str(response)
        else:
            result = str(response)

        return f"Here’s what I found: {result}"
    except Exception as e:
        return f"❌ Agent error: {str(e)}"

# -----------------------------
# ROUTES
# -----------------------------
@app.route('/analyze', methods=['GET'])
def analyze():
    result = analyze_bank_statement(CSV_FILE_PATH)
    return jsonify(result)

@app.route('/ask', methods=['POST'])
def ask():
    data = request.get_json()
    prompt = data.get("prompt", "")
    response = ask_agent(prompt)
    return jsonify({"response": response})

# -----------------------------
# MAIN
# -----------------------------
if __name__ == "__main__":
    app.run(debug=True)
