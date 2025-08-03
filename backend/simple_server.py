from fastapi import FastAPI
import uvicorn

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

if __name__ == "__main__":
    print("Starting simple server on port 8080...")
    uvicorn.run(app, host="0.0.0.0", port=8080) 