import { tool } from  'ai';
import { z } from 'zod';

import {getCoinPriceDataCached} from "@/lib/tools/price-api";


export const getTokenPrice = tool({
        description: "Get the price of a token using the token's ticker",
        parameters: z.object({
          token_ticker: z.string()
        }),
        execute: async ({ token_ticker }) => {
           return getCoinPriceDataCached(token_ticker);
        }
});