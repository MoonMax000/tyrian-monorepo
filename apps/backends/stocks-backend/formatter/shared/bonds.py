
# from services.data_converters.terrapin_bonds import (
#     convert_terrapin_bonds_data,
#     )


emitents_blocks = {
    "emission": {
        "general": {
            "source": "stocks-cbonds",
            "port": 8054,
            "params": ['id'],
            "expiration_time": 60, # in seconds
            "endpoint": "/market_leaders/emissions?filters=id:<id>",
        },
    },
    "emissions-corporate": {
        "general": {
            "source": "stocks-terrapin",
            "port": 8054,
            "params": [],
            "expiration_time": 60,
            "endpoint": "/bonds/",
        },
    },
    "emissions-goverment": {
        "general": {
            "source": "stocks-terrapin",
            "port": 8054,
            "params": [],
            "expiration_time": 60,
            "endpoint": "/bonds/",
        },
    },
    # "terrapin-emission": {
    #     "general": {
    #         "source": "stocks-terrapin",
    #         "port": 8054,
    #         "params": [],
    #         "expiration_time": 300, # in seconds
    #         "endpoint": "/bonds/",
    #         "data_formatter": convert_terrapin_bonds_data,
    #     },
    # },
}
