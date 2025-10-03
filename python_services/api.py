# python_services/api.py (Corrected Version)

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from main_agent import run_agent_pipeline
import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="FinWell Agent API", version="1.0.0")

origins = [
    "http://localhost:3000", # The origin of your React app
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Allows all methods
    allow_headers=["*"], # Allows all headers
)

class AgentQuery(BaseModel):
    query: str
    csv_filename: str

@app.get("/")
def root():
    return {"message": "FinWell Agent API is running"}

@app.post("/query")
def handle_query(q: AgentQuery):
    filepath = os.path.join(os.path.dirname(__file__), q.csv_filename)

    try:
        response = run_agent_pipeline(q.query, filepath)
        
        if response and isinstance(response, dict) and 'error' in response:
            raise HTTPException(status_code=400, detail=response['error'])

        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An internal server error occurred: {str(e)}")