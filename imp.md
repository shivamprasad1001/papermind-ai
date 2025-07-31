# Ensure the GOOGLE_API_KEY is set
load_dotenv()
api_key=os.getenv("GOOGLE_API_KEY")

if not api_key:
    raise ValueError("Google API Key not found. Please set the GOOGLE_API_KEY environment variable.")
