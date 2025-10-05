from shared.data_blocks_collected import data_blocks


async def get_block(block_slug: str, country_slug: str) -> dict | None:
    """Get block configuration from data_blocks."""
    block = data_blocks.get(block_slug, {}).get(country_slug)
    return block
