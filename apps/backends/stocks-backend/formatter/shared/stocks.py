from services.data_converters import *

stocks_blocks = {
    "financial-statements": {
        "ru": {
            "source": "stocks-cbonds",
            "port": 8002,
            "params": ["stock", "period",],
            "expiration_time": 600, # in seconds
        },
        "us": {
            "source": "stocks-fmp",
            "port": 8052,
            "params": ["ticker", ],
            "expiration_time": 3600, # in seconds,
            "endpoint": "/companies/<ticker>/key-metrics"
        },
    },
    "quotation-chart": {
        "us": {
            "source": "stocks-fmp",
            "port": 8052,
            "params": ["ticker", "start", "end", "period", ],
            "expiration_time": 3600, # in seconds,
            "endpoint": "/stocks/financial_statements/<ticker>?period=<period>",
            "data_formatter": convert_quotation_chart_data,
        },
    },
    "fundamental-analysis": {
        "us": {
            "source": "stocks-fmp",
            "port": 8052,
            "params": ["ticker", ],
            "expiration_time": 3600, # in seconds,
            "endpoint": "/companies/<ticker>/key-metrics",
            "data_formatter": convert_fundamental_analysis_data,
        },
    },
    "revenue-net-profit": {
        "us": {
            "source": "stocks-fmp",
            "port": 8052,
            "params": ["ticker", "period", ],
            "expiration_time": 3600, # in seconds,
            "endpoint": "/stocks/financial_statements/<ticker>?period=<period>",
            "data_formatter": convert_revenue_net_profit_data,
        },
    },
    "revenue-history": {
        "us": {
            "source": "stocks-fmp",
            "port": 8052,
            "params": ["ticker", "period", ],
            "expiration_time": 3600, # in seconds,
            "endpoint": "/stocks/financial_statements/<ticker>?period=<period>",
            "data_formatter": convert_revenue_history_data,
        },
    },    
    "depbts-assets": {
        "us": {
            "source": "stocks-fmp",
            "port": 8052,
            "params": ["ticker", "period", ],
            "expiration_time": 3600, # in seconds,
            "endpoint": "/stocks/balance_sheet_states/<ticker>?period=<period>",
            "data_formatter": convert_depbts_assets_data,
        },
    },      
    "cash-flow": {
        "us": {
            "source": "stocks-fmp",
            "port": 8052,
            "params": ["ticker", "period", ],
            "expiration_time": 3600, # in seconds,
            "endpoint": "/stocks/cashflow/<ticker>?period=<period>",
            "data_formatter": convert_cash_flow_data,
        },
    },
    "trade-volumes": {
        "us": {
            "source": "stocks-fmp",
            "port": 8052,
            "params": ["ticker", ],
            "expiration_time": 3600, # in seconds,
            "endpoint": "/companies/<ticker>/key-metrics",
            "data_formatter": convert_trade_volumes_data,
        },
    },
    "financial-stability": {
        "us": {
            "source": "stocks-fmp",
            "port": 8052,
            "params": ["ticker", "period", ],
            "expiration_time": 3600, # in seconds,
            "endpoint": "/stocks/balance_sheet_states/<ticker>?period=<period>",
            "data_formatter": convert_financial_stability_data,
        },
    },
    "holders-structure": {
        "us": {
            "source": "stocks-fmp",
            "port": 8052,
            "params": ["ticker", ],
            "expiration_time": 3600, # in seconds,
            "endpoint": "/holder/institut/<ticker>",
            "data_formatter": convert_holders_structure_data,
        },
    },
    "stock-info": {
        "us": {
            "source": "stocks-fmp",
            "port": 8052,
            "params": ["ticker", ],
            "expiration_time": 3600, # in seconds,
            "endpoint": "/stocks/<ticker>",
            "data_formatter": convert_stock_info_data,
        },
    },           
    "holders-table": {
        "us": {
            "source": "stocks-fmp",
            "port": 8052,
            "params": ["ticker", ],
            "expiration_time": 60, # in seconds,
            "endpoint": "/holder/institut/<ticker>",
            "data_formatter": convert_holders_table_data,
        },
    },
    "roe": {
        "us": {
            "source": "stocks-fmp",
            "port": 8052,
            "params": ["ticker", "period", ],
            "expiration_time": 3600, # in seconds,
            "endpoint": "/companies/<ticker>/key-metrics?period=<period>",
            "data_formatter": convert_roe_data,
        },
    },
    "dividends": {
        "us": {
            "source": "stocks-fmp",
            "port": 8052,
            "params": ["ticker", ],
            "expiration_time": 3600, # in seconds,
            "endpoint": "/stocks/dividends/<ticker>",
            "data_formatter": convert_dividends_data,
        },
    },
}
