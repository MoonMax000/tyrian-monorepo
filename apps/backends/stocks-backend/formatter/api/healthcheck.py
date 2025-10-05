from fastapi import APIRouter

router = APIRouter()

@router.get("/health", summary="Проверка состояния сервиса", 
            response_description="Статус сервиса", 
            responses={200: {"description": "Успешный ответ", 
                             "content": {"application/json": {"example": {"status": "healthy"}}}}})
async def health_check():
    return {"status": "healthy"}
