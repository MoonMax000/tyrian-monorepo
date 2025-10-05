from services.data_converters.market_leaders_dc import (
    convert_market_leaders_growth_data,
    convert_market_losers_data,
    convert_market_leaders_volume_data,
    convert_market_leaders_volatile_data,
)


market_leaders_blocks = {
    "market-leaders-volume": {
        "ru": {
            "source": "cbonds",
            "port": 8002,
            "params": [],
            "expiration_time": 60, # in seconds
            "endpoint": "/api/v1/market_leaders/base_info_stocks",
        },
        "us": {
            "source": "stocks-fmp",
            "port": 8052,
            "params": [],
            "expiration_time": 60, # in seconds
            "endpoint": "/api/v1/market_leaders/base_info_stocks",
        },
    },
    "market-leaders-growth": {
        "us": {
            "source": "stocks-fmp",
            "port": 8052,
            "params": [],
            "expiration_time": 3600, # in seconds
            "endpoint": "/api/v1/market_leaders/growth_leaders",
            "data_formatter": convert_market_leaders_growth_data,
        },
    },
    "market-leaders-growth-full": {
        "us": {
            "source": "stocks-fmp",
            "port": 8052,
            "params": ["sector"],
            "expiration_time": 60, # in seconds
            "endpoint": "/stocks/company-screener?sector=<sector>",
        },
    },
    "market-leaders-type": {
        "us": {
            "source": "stocks-fmp",
            "port": 8052,
            "params": ["sector", "type"],
            "expiration_time": 60, # in seconds
            "endpoint": "/stocks/company-screener?sector=<sector>",
        },
    },
    "market-leaders-volatile": {
        "us": {
            "source": "stocks-fmp",
            "port": 8052,
            "params": [],
            "expiration_time": 3600, # in seconds
            "endpoint": "/api/v1/market_leaders/leaders_volatility",
            "data_formatter": convert_market_leaders_volatile_data,
        },
    },
    "market-losers": {
        "us": {
            "source": "stocks-fmp",
            "port": 8052,
            "params": [],
            "expiration_time": 3600, # in seconds
            "endpoint": "/api/v1/market_leaders/decline_leaders",
            "data_formatter": convert_market_losers_data,
        },
    },
    "market-leaders-volume": {
        "us": {
            "source": "stocks-fmp",
            "port": 8052,
            "params": [],
            "expiration_time": 3600, # in seconds
            "endpoint": "/api/v1/market_leaders/leaders_volume",
            "data_formatter": convert_market_leaders_volume_data,
        },
    },
}
