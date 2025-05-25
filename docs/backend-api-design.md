# Backend API Design for Gemini Model Integration

## Current Implementation
Currently, the frontend sends the Gemini model name and API key in the form data:

```typescript
// Add Gemini settings if provided
if (request.gemini_settings) {
  if (request.gemini_settings.apiKey) {
    formData.append('gemini_api_key', request.gemini_settings.apiKey);
  }
  if (request.gemini_settings.model) {
    formData.append('gemini_model', request.gemini_settings.model);
  }
}
```

## Backend API Changes

### 1. Request Schema
Update the FastAPI request model to include Gemini settings:

```python
from pydantic import BaseModel, Field
from typing import Optional
from fastapi import UploadFile, Form

class GeminiSettings(BaseModel):
    api_key: Optional[str] = None
    model: Optional[str] = None

class TranslateRequest(BaseModel):
    file: UploadFile
    source_lang: str
    target_lang: str
    dual: bool
    gemini_settings: Optional[GeminiSettings] = None
```

### 2. Form Data Handling
Since FastAPI handles form data differently from JSON, you'll need to accept the fields individually:

```python
@router.post("/translate", response_model=TranslateResponse)
async def translate_pdf(
    file: UploadFile,
    source_lang: str = Form(...),
    target_lang: str = Form(...),
    dual: bool = Form(...),
    gemini_api_key: Optional[str] = Form(None),
    gemini_model: Optional[str] = Form(None),
):
    # Create settings object if any Gemini parameters provided
    gemini_settings = None
    if gemini_api_key or gemini_model:
        gemini_settings = {
            "api_key": gemini_api_key,
            "model": gemini_model
        }
    
    # Pass to translation service
    result = await translation_service.translate_pdf(
        file=file,
        source_lang=source_lang,
        target_lang=target_lang,
        dual=dual,
        gemini_settings=gemini_settings
    )
    
    return result
```

### 3. Translation Service
Update the translation service to use the provided Gemini settings:

```python
async def translate_pdf(
    self,
    file: UploadFile,
    source_lang: str,
    target_lang: str,
    dual: bool,
    gemini_settings: Optional[dict] = None
) -> Dict:
    # Generate a unique task ID
    task_id = str(uuid.uuid4())
    
    # Save the file
    file_path = await self._save_file(file, task_id)
    
    # Start translation in background
    background_tasks.add_task(
        self._process_translation,
        file_path=file_path,
        source_lang=source_lang,
        target_lang=target_lang,
        dual=dual,
        task_id=task_id,
        gemini_settings=gemini_settings
    )
    
    return {
        "task_id": task_id,
        "message": "Translation started",
        "status": "processing"
    }
```

### 4. Gemini Client Configuration
Create a function to initialize the Gemini client with custom settings:

```python
def get_gemini_client(gemini_settings: Optional[dict] = None) -> genai.GenerativeModel:
    """
    Initialize a Gemini client with custom settings if provided,
    otherwise use default settings from environment variables.
    """
    if gemini_settings and gemini_settings.get("api_key"):
        # Use provided API key
        api_key = gemini_settings["api_key"]
    else:
        # Fall back to environment variable
        api_key = os.getenv("GEMINI_API_KEY")
    
    # Set up client
    genai.configure(api_key=api_key)
    
    # Determine model
    model_name = "gemini-2.5-flash-preview-05-20"  # Default model
    if gemini_settings and gemini_settings.get("model"):
        model_name = gemini_settings["model"]
    
    # Create and return model
    model = genai.GenerativeModel(model_name)
    return model
```

### 5. Translation Processing
Update the translation process to use the custom Gemini client:

```python
async def _process_translation(
    self,
    file_path: str,
    source_lang: str,
    target_lang: str,
    dual: bool,
    task_id: str,
    gemini_settings: Optional[dict] = None
):
    try:
        # Initialize Gemini client with custom settings
        gemini_model = get_gemini_client(gemini_settings)
        
        # Extract text from PDF
        # ...
        
        # Translate text using Gemini
        translated_pages = []
        for page_text in extracted_text:
            response = gemini_model.generate_content(
                f"Translate the following text from {source_lang} to {target_lang}: {page_text}"
            )
            translated_pages.append(response.text)
        
        # Create translated PDF
        # ...
        
    except Exception as e:
        # Handle errors
        # ...
```

## Available Models
The frontend has been updated to support these Gemini models:

1. `gemini-2.5-flash-preview-05-20` (default, displayed as "Gemini 2.5 Flash")
2. `gemini-2.0-flash`
3. `gemini-2.0-flash-lite`
4. `gemini-2.5-pro-preview-05-06` (displayed as "Gemini 2.5 Pro")

## Environment Variables
Make sure to have a fallback environment variable in your backend:

```
GEMINI_API_KEY=your_default_api_key
DEFAULT_GEMINI_MODEL=gemini-2.5-flash-preview-05-20
```

This ensures the system works even if users don't provide custom settings. 