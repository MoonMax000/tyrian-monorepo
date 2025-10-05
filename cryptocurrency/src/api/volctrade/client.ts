import axios from "axios";
import https from "https";

export const api = axios.create({
    baseURL: 'https://cmc.k8s.volctrade.com/coin-market-cap',
    withCredentials: true,
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});
