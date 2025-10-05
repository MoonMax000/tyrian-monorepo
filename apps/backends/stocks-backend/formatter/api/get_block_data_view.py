from fastapi import HTTPException, Depends, Request
from fastapi.responses import JSONResponse


from shared import data_blocks
from services.handlers import handlers

from routers.router import router
from logger import logger


def get_query_params(request: Request) -> dict:
    return dict(request.query_params)


@router.get("/get-block/{block_slug}/{country_slug}/", 
    summary="Get block data",
    description="Retrieve block data based on the provided block and country slugs.",
    responses={
        200: {"description": "Successful response"},
        404: {"description": "Block not found"},
        400: {"description": "Missing required parameters"},
        500: {"description": "Unexpected error"},
    })
async def get_block_view(
    block_slug: str,
    country_slug: str,
    params: dict = Depends(get_query_params),
):
    logger.debug(f"Request for block: {block_slug}, country: {country_slug}, params: {params}")
    
    block = data_blocks.get(block_slug, {}).get(country_slug)
    if not block:
        logger.warning(f"Block not found: {block_slug}")
        raise HTTPException(
            status_code=404,
            detail=f"Block {block_slug} not found",
        )
    # Проверить наличие источника и порта
    source = block.get("source")
    port = block.get("port")
    if not all([source, port]):
        logger.warning(f"Source or port not found for block: {block_slug}")
        raise HTTPException(
            status_code=404,
            detail="Source or port not found for block {block_slug}",
        )

    # Проверить наличие необходимых параметров
    required_params = block.get("params")
    if required_params:
        for param in required_params:
            if param not in params.keys():
                logger.error(f"Missing required parameter {param} for block {block_slug}")
                raise HTTPException(
                    status_code=400,
                    detail=f"Missing required parameter {param} for block {block_slug}",
                )
            
    # Получить данные из источника
    handler_class = handlers[block_slug][country_slug]
    # Если handler - это функция, вызываем её для получения класса
    if callable(handler_class) and not isinstance(handler_class, type):
        handler_class = handler_class()
    
    try:
        parser = handler_class(
            block_slug=block_slug,
            country_slug=country_slug,
            params=params,
        )
        data = await parser.get_block_data()
        
        return JSONResponse(
            content=data,
            status_code=200
        )
    except ValueError as e:
        logger.error(f"Error getting data from source: {e}")
        raise HTTPException(
            status_code=404,
            detail=f"Error getting data from source: {e}"
        )
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=500,
            detail=f"Unexpected error getting data from source: {e}"
        )
