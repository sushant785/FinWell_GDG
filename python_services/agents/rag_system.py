# This file should be named rag_system.py to match your import
import os
from langchain_google_genai.embeddings import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import CSVLoader, PyPDFLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate

# Make sure llm_main.py exists and llm is imported correctly
from llm_main import llm 

class BasicRAG:
    def __init__(self):
        """Initialize embeddings and LLM."""
        google_api_key = os.environ["GOOGLE_API_KEY"]

        # Create embeddings model (converts text → vectors)
        self.embeddings = GoogleGenerativeAIEmbeddings(
            model="models/embedding-001",
            google_api_key=google_api_key
        )

        # Use your LLM (like Gemini) for answering questions
        self.llm = llm
        self.vectorstore = None
        self.qa_chain = None

    def load_document(self, file_path):
        """
        --- FIXED ---
        Loads one file based on its extension (CSV, PDF, or TXT).
        """
        
        # Get the file extension
        _, file_extension = os.path.splitext(file_path)

        if file_extension.lower() == '.csv':
            loader = CSVLoader(file_path)
        elif file_extension.lower() == '.pdf':
            loader = PyPDFLoader(file_path)
        elif file_extension.lower() == '.txt':
            loader = TextLoader(file_path)
        else:
            raise ValueError(f"Unsupported file type: {file_extension}")

        documents = loader.load()
        print(f"Loaded {len(documents)} document(s) from {file_path}")
        return documents

    def split_text(self, documents):
        """Splits long documents into smaller chunks."""
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )
        chunks = splitter.split_documents(documents)
        print(f"Split into {len(chunks)} chunks")
        return chunks

    def create_vectorstore(self, chunks):
        """Converts document chunks into vector form and stores them in FAISS."""
        self.vectorstore = FAISS.from_documents(chunks, self.embeddings)
        print("Vectorstore created")

    def create_qa_chain(self):
        """Creates a question-answer chain using retrieval + LLM."""
        if not self.vectorstore:
            raise ValueError("Vectorstore not found. Run create_vectorstore() first.")
        
        retriever = self.vectorstore.as_retriever(search_kwargs={"k": 3})

        # 1. Define the prompt template
        prompt_template = """Answer the question based only on the following context:
        
        {context}
        
        Question: {question}
        """
        prompt = ChatPromptTemplate.from_template(prompt_template)
        
        # 2. Define the output parser
        output_parser = StrOutputParser()

        # 3. Create the LCEL chain
        self.qa_chain = (
            {"context": retriever, "question": RunnablePassthrough()}
            | prompt
            | self.llm
            | output_parser
        )
        
        print("LCEL QA chain ready")

    def ask(self, query):
        """Ask a question and get an answer from the RAG system."""
        if not self.qa_chain:
            raise ValueError("QA chain not created. Run create_qa_chain() first.")
        
        # Use .invoke() for LCEL chains, which passes the query directly
        result = self.qa_chain.invoke(query) 
        
        print(f"\nQuestion: {query}")
        print(f"Answer: {result}")  # 'result' is now a plain string
        return result
