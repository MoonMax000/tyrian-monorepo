from services.data_converters import sort_crypto_data


crypto_blocks = {
    "crypto": {
        "general": {
            "source": "stocks-cmc",
            "port": 8053,
            "params": [
                'with_historical_data',
                'interval',
                'batch_size',
                'weeks_shift_period',
                'start',
                'limit',
                'sort_by',
                'cryptocurrency_type',
                'tag',
                ],
            "expiration_time": 60,
            "endpoint": "/coin-market-cap/cmc/listings/latest?start=<start>&limit=<limit>&sort=<sort_by>&cryptocurrency_type=<cryptocurrency_type>&tag=<tag>&with_historical_data=<with_historical_data>&interval=<interval>&batch_size=<batch_size>&weeks_shift_period=<weeks_shift_period>",
            "data_formatter": sort_crypto_data,
        }
    },
    "crypto_with_category": {
        "general": {
            "source": "stocks-cmc",
            "port": 8053,
            "params": ['start', 'limit', 'category_special_type'],
            "expiration_time": 60,
            "endpoint": "/coin-market-cap/cmc/categories/category-special?category_special_type=<category_special_type>&start=<start>&limit=<limit>",
            "data_formatter": sort_crypto_data,
        }
    },
    "crypto_gainers_losers": {
        "general": {
            "source": "stocks-cmc",
            "port": 8053,
            "params": [
                'sort_dir',
                'limit',
                ],
            "expiration_time": 60,
            "endpoint": "/coin-market-cap/cmc/trending/gainers-losers?sort_dir=<sort_dir>&limit=<limit>",
            "data_formatter": sort_crypto_data,
        }
    },
    "crypto_tvl_ranking": {
        "general": {
            "source": "stocks-cmc",
            "port": 8053,
            "params": [
                'limit',
                ],
            "expiration_time": 60,
            "endpoint": "/coin-market-cap/cmc/trending/tvl_ranking?limit=<limit>",
        }
    },
}
