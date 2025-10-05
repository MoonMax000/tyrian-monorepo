import {
  Portfolio,
  ListPortfoliosResponse,
  Asset,
  ListAssetsResponse,
  Trade,
  ListTradesResponse,
  MarketAsset,
  ListMarketAssetsResponse,
  PriceHistoryResponse,
  SyncStatusResponse,
} from "@shared/api";

const API_BASE = "/api";

export const api = {
  users: {
    async seed(): Promise<{ id: string }> {
      const res = await fetch(`${API_BASE}/users/seed`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to seed user");
      return res.json();
    },
  },
  portfolios: {
    async list(
      userId: string,
      category?: string,
    ): Promise<ListPortfoliosResponse> {
      const params = new URLSearchParams({ userId });
      if (category) params.set("category", category);
      const res = await fetch(`${API_BASE}/portfolios?${params}`);
      if (!res.ok) throw new Error("Failed to fetch portfolios");
      return res.json();
    },
    async create(data: {
      userId: string;
      name: string;
      currency: string;
      category: string;
    }): Promise<Portfolio> {
      const res = await fetch(`${API_BASE}/portfolios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create portfolio");
      return res.json();
    },
    async delete(id: string, userId: string): Promise<void> {
      const res = await fetch(`${API_BASE}/portfolios/${id}?userId=${userId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete portfolio");
    },
  },
  assets: {
    async list(
      userId: string,
      portfolioId?: string,
      category?: string,
    ): Promise<ListAssetsResponse> {
      const params = new URLSearchParams({ userId });
      if (portfolioId) params.set("portfolioId", portfolioId);
      if (category) params.set("category", category);
      const res = await fetch(`${API_BASE}/assets?${params}`);
      if (!res.ok) throw new Error("Failed to fetch assets");
      return res.json();
    },
    async create(data: {
      userId: string;
      portfolioId?: string;
      category: string;
      code: string;
      name: string;
      currency: string;
      manualPrice?: boolean;
      price?: number;
      nominalValue?: number;
      accruedInterest?: number;
      note?: string;
      tags?: string[];
    }): Promise<Asset> {
      const res = await fetch(`${API_BASE}/assets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        let message = "Failed to create asset";
        try {
          const text = await res.text();
          try {
            const parsed = JSON.parse(text);
            message =
              typeof parsed?.error === "string"
                ? parsed.error
                : text || message;
          } catch {
            message = text || message;
          }
        } catch {}
        throw new Error(message);
      }
      return res.json();
    },
    async updatePrice(
      id: string,
      price: number,
      source?: string,
    ): Promise<void> {
      const res = await fetch(`${API_BASE}/assets/${id}/price`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price, source }),
      });
      if (!res.ok) throw new Error("Failed to update asset price");
    },
    async delete(id: string, userId: string): Promise<void> {
      const res = await fetch(`${API_BASE}/assets/${id}?userId=${userId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete asset");
    },
  },
  trades: {
    async list(
      userId: string,
      params?: {
        portfolioId?: string;
        assetCode?: string;
        operation?: string;
        startDate?: string;
        endDate?: string;
      },
    ): Promise<ListTradesResponse> {
      const queryParams = new URLSearchParams({ userId });
      if (params?.portfolioId)
        queryParams.set("portfolioId", params.portfolioId);
      if (params?.assetCode) queryParams.set("assetCode", params.assetCode);
      if (params?.operation) queryParams.set("operation", params.operation);
      if (params?.startDate) queryParams.set("startDate", params.startDate);
      if (params?.endDate) queryParams.set("endDate", params.endDate);
      const res = await fetch(`${API_BASE}/trades?${queryParams}`);
      if (!res.ok) throw new Error("Failed to fetch trades");
      return res.json();
    },
    async create(data: {
      userId: string;
      portfolioId: string;
      assetType: string;
      assetCode: string;
      operation: string;
      tradeDate: string;
      price: number;
      tradeCurrency: string;
      quantity: number;
      commission?: number;
      tags?: string[];
      note?: string;
    }): Promise<Trade> {
      const res = await fetch(`${API_BASE}/trades`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        let message = "Failed to create trade";
        try {
          const text = await res.text();
          try {
            const parsed = JSON.parse(text);
            message =
              typeof parsed?.error === "string"
                ? parsed.error
                : text || message;
          } catch {
            message = text || message;
          }
        } catch {}
        throw new Error(message);
      }
      return res.json();
    },
    async update(
      id: string,
      userId: string,
      data: {
        price?: number;
        quantity?: number;
        commission?: number;
        note?: string;
      },
    ): Promise<Trade> {
      const res = await fetch(`${API_BASE}/trades/${id}?userId=${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update trade");
      return res.json();
    },
    async delete(id: string, userId: string): Promise<void> {
      const res = await fetch(`${API_BASE}/trades/${id}?userId=${userId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete trade");
    },
  },
  demoData: {
    async seed(
      userId: string,
      portfolioId: string,
    ): Promise<{ success: boolean; message: string }> {
      const res = await fetch(`${API_BASE}/demo-data/seed`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, portfolioId }),
      });
      if (!res.ok) {
        let message = "Failed to seed demo data";
        try {
          const text = await res.text();
          try {
            const parsed = JSON.parse(text);
            message =
              typeof parsed?.error === "string"
                ? parsed.error
                : text || message;
          } catch {
            message = text || message;
          }
        } catch {}
        throw new Error(message);
      }
      return res.json();
    },
  },
  marketAssets: {
    async list(params?: {
      category?: string;
      search?: string;
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
    }): Promise<ListMarketAssetsResponse> {
      const queryParams = new URLSearchParams();
      if (params?.category) queryParams.set("category", params.category);
      if (params?.search) queryParams.set("search", params.search);
      if (params?.page) queryParams.set("page", params.page.toString());
      if (params?.limit) queryParams.set("limit", params.limit.toString());
      if (params?.sortBy) queryParams.set("sortBy", params.sortBy);
      if (params?.sortOrder) queryParams.set("sortOrder", params.sortOrder);

      const res = await fetch(`${API_BASE}/market-assets?${queryParams}`);
      if (!res.ok) throw new Error("Failed to fetch market assets");
      return res.json();
    },
    async get(symbolOrId: string): Promise<MarketAsset> {
      const res = await fetch(`${API_BASE}/market-assets/${symbolOrId}`);
      if (!res.ok) throw new Error("Failed to fetch market asset");
      return res.json();
    },
    async getHistory(
      symbolOrId: string,
      days: number = 30,
    ): Promise<PriceHistoryResponse> {
      const res = await fetch(
        `${API_BASE}/market-assets/${symbolOrId}/history?days=${days}`,
      );
      if (!res.ok) throw new Error("Failed to fetch price history");
      return res.json();
    },
    async getSyncStatus(): Promise<SyncStatusResponse> {
      const res = await fetch(`${API_BASE}/market-assets/sync/status`);
      if (!res.ok) throw new Error("Failed to fetch sync status");
      return res.json();
    },
    async triggerSync(source: string): Promise<{ message: string }> {
      const res = await fetch(`${API_BASE}/market-assets/sync/trigger`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source }),
      });
      if (!res.ok) throw new Error("Failed to trigger sync");
      return res.json();
    },
  },
};
