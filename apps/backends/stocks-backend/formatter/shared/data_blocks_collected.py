from .bonds import emitents_blocks
from .market_leaders import market_leaders_blocks
from .stocks import stocks_blocks
from .crypto import crypto_blocks
from .etf import etf_blocks


data_blocks = {
    **market_leaders_blocks,
    **stocks_blocks,
    **crypto_blocks,
    **emitents_blocks,
    **etf_blocks,
}
