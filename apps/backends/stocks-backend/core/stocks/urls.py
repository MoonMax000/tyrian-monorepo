from django.urls import path
from .views import (
    StockListView,
    StockCurrentInfoView,
    StockPricesHistoryView,
    StockIndicesView,
    StockAggregatedMarketDataView,
    NewsView,
    ArticleUploadView,
    ArticleDetailView,
)
from .parsing_api import (
    EmissionsCorporateView,
    EmissionsGovermentView,
    EmissionView,
    GetBlockDataView,
    MarketLeadersGrowthView,
    MarketLeadersGrowthFullView,
    MarketLeadersTypeView,
    MarketLosersView,
    MarketLeadersVolumeView,
    MarketLeadersVolatileView,
    QuotationChartView,
    FundamentalAnalysisView,
    RevenueNetProfitView,
    RevenueHistoryView,
    DepbtsAssetsView,
    CashFlowView,
    TradeVolumesView,
    FinancialStabilityView,
    HoldersStructureView,
    StockInfoView,
    HoldersTableView,
    ROEView,
    DividendsView,
    CryptoView,
    CryptoGainersLosersView,
    CryptoTVLRankingTView,
    ETFView,
)


urlpatterns = [
    path("", StockListView.as_view(), name="stock-list"),
    path("news/", NewsView.as_view(), name="news"),
    path(
        "<str:ticker>/prices-history/",
        StockPricesHistoryView.as_view(),
        name="stock-prices-history",
    ),
     path(
        "<str:ticker>/indices/",
        StockIndicesView.as_view(),
        name="stock-indices",
    ),
    path(
        "<str:ticker>/aggregated-market-data/",
        StockAggregatedMarketDataView.as_view(),
        name="stock-aggregated-market-data",
    ),
    path(
        "<str:ticker>/",
        StockCurrentInfoView.as_view(),
        name="stock-current-info",
    ),
]

urlpatterns += [
    path(
        "parsed/emissions/corporate/",
        EmissionsCorporateView.as_view(),
        name="get-emissions-corporate",
    ),
    path(
        "parsed/emissions/goverment/",
        EmissionsGovermentView.as_view(),
        name="get-emissions-goverment",
    ),
    path(
        "parsed/emission/<str:id>/",
        EmissionView.as_view(),
        name="get-emission",
    ),
    path(
        "parsed/<str:block_slug>/<str:country>/",
        GetBlockDataView.as_view(),
        name="get-block-data",
    ),
    path(
        "parsed/market-leaders-growth/<str:country>/",
        MarketLeadersGrowthView.as_view(),
        name="get-market-leaders-growth",
    ),
    path(
        "parsed/market-leaders-growth-full/<str:country>/",
        MarketLeadersGrowthFullView.as_view(),
        name="get-market-leaders-growth-full",
    ),
    path(
        "parsed/market-leaders-type/<str:country>/",
        MarketLeadersTypeView.as_view(),
        name="get-market-leaders-type",
    ),
    path(
        "parsed/market-losers/<str:country>/",
        MarketLosersView.as_view(),
        name="get-market-losers",
    ),
    path(
        "parsed/market-leaders-volume/<str:country>/",
        MarketLeadersVolumeView.as_view(),
        name="get-market-leaders-volume",
    ),
    path(
        "parsed/market-leaders-volatile/<str:country>/",
        MarketLeadersVolatileView.as_view(),
        name="get-market-leaders-volatile",
    ),
    path(
        "parsed/quotation-chart/<str:country>/<str:ticker>/",
        QuotationChartView.as_view(),
        name="get-quotation-chart",
    ),
    path(
        "parsed/fundamental-analysis/<str:country>/<str:ticker>/",
        FundamentalAnalysisView.as_view(),
        name="get-fundamental-analysis",
    ),
    path(
        "parsed/revenue-net-profit/<str:country>/<str:ticker>/",
        RevenueNetProfitView.as_view(),
        name="get-revenue-net-profit",
    ),
    path(
        "parsed/revenue-history/<str:country>/<str:ticker>/",
        RevenueHistoryView.as_view(),
        name="get-revenue-history",
    ),
    path(
        "parsed/depbts-assets/<str:country>/<str:ticker>/",
        DepbtsAssetsView.as_view(),
        name="get-depbts-assets",
    ),
    path(
        "parsed/cash-flow/<str:country>/<str:ticker>/",
        CashFlowView.as_view(),
        name="get-cash-flow",
    ),
    path(
        "parsed/trade-volumes/<str:country>/<str:ticker>/",
        TradeVolumesView.as_view(),
        name="get-trade-volumes",
    ),
    path(
        "parsed/financial-stability/<str:country>/<str:ticker>/",
        FinancialStabilityView.as_view(),
        name="get-financial-stability",
    ),
    path(
        "parsed/holders-structure/<str:country>/<str:ticker>/",
        HoldersStructureView.as_view(),
        name="get-holders-structure",
    ),
    path(
        "parsed/stock-info/<str:country>/<str:ticker>/",
        StockInfoView.as_view(),
        name="get-stock-info",
    ),
    path(
        "parsed/holders-table/<str:country>/<str:ticker>/",
        HoldersTableView.as_view(),
        name="get-holders-table",
    ),
    path(
        "parsed/roe/<str:country>/<str:ticker>/",
        ROEView.as_view(),
        name="get-roe",
    ),
    path(
        "parsed/dividends/<str:country>/<str:ticker>/",
        DividendsView.as_view(),
        name="get-dividends",
    ),
    path(
        "parsed/crypto/",
        CryptoView.as_view(),
        name="get-crypto",
    ),
    path(
        "parsed/crypto-gainers-losers/",
        CryptoGainersLosersView.as_view(),
        name="get-crypto-gainers-losers",
    ),
    path(
        "parsed/crypto-tvl-ranking/",
        CryptoTVLRankingTView.as_view(),
        name="get-crypto-tvl-ranking",
    ),
    # path(
    #     "parsed/financial-statements/<str:country>/<str:ticker>/",
    #     FinancialStatementsView.as_view(),
    #     name="get-financial-statements",
    # ),
]

# ETF
urlpatterns += [
    path(
        "parsed/etf/",
        ETFView.as_view(),
        name="get-etf",
    ),
]


urlpatterns += [
    path('article/upload/', ArticleUploadView.as_view(), name='upload_article'),
    path('article/<int:article_id>/', ArticleDetailView.as_view(), name='get_article'),
]
