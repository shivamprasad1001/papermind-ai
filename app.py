from fastapi.staticfiles import StaticFiles


from fastapi import FastAPI, UploadFile, File, BackgroundTasks
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from ingest import ingest_pdf
from chat import get_chat_response

import os
import uvicorn

app = FastAPI()

# CORS: Allow frontend on same machine
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with ["http://localhost:5500"] if you host frontend with Live Server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.mount("/static", StaticFiles(directory="frontend", html=True), name="static")

# PDF Upload Endpoint
@app.post("/upload_pdf")
async def upload_pdf(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    print(f"Received upload request for file: {file.filename}")
    if not file:
        print("No file received!")
    if file.filename.endswith(".pdf"):
        save_path = f"./uploads/{file.filename}"
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        with open(save_path, "wb") as f:
            content = await file.read()
            f.write(content)

        try:
            ingest_pdf(save_path)
            return {"status": "success", "filename": file.filename}
        except Exception as e:
            return JSONResponse(status_code=500, content={"error": str(e)})
    else:
        return JSONResponse(status_code=400, content={"error": "Only PDF files are allowed."})


# Chat Query Endpoint
@app.post("/chat/")
async def chat_api(payload: dict):
    try:
        question = payload.get("question")
        answer, sources = get_chat_response(question)
        
        return {"response": answer, "sources": sources}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@app.get("/")
async def root():
    return FileResponse("frontend/index.html")


if __name__ == "__main__":
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
