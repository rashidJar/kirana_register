import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { RedisService } from 'src/common/redis/redis.service';

interface ExchangeRateResponse {
  base: string;
  rates: {
    [key: string]: number;
  };
  timestamp: number;
}

@Injectable()
export class CurrencyService {
  private readonly CACHE_KEY = 'exchange_rates';
  private readonly CACHE_TTL = 24 * 60 * 60; // 24 hours in seconds

  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {}

  async getExchangeRates(): Promise<ExchangeRateResponse> {
    try {
      // Try to get from cache first
      const cachedRates = await this.redisService.get<string>(this.CACHE_KEY);

      if (cachedRates) {
        return JSON.parse(cachedRates);
      }

      // If not in cache, fetch from API
      const rates = await this.fetchExchangeRates();

      // Store in cache with TTL
      await this.redisService.set(
        this.CACHE_KEY,
        JSON.stringify(rates),
        this.CACHE_TTL,
      );

      return rates;
    } catch (error) {
      throw error;
    }
  }

  private async fetchExchangeRates(): Promise<ExchangeRateResponse> {
    try {
      const apiUrl = this.configService.get<string>('FX_RATES_API_URL');

      const response = await axios.get<ExchangeRateResponse>(apiUrl, {
        params: {
          base: 'INR',
        },
        timeout: 5000,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new Error('Exchange rate API request timed out');
        }
        if (error.response) {
          throw new Error(
            `Exchange rate API error: ${error.response.status} - ${error.response.statusText}`,
          );
        }
      }
      throw error;
    }
  }

  async getConversionRate(
    fromCurrency: string,
    toCurrency: string = 'INR',
  ): Promise<number> {
    try {
      if (fromCurrency === toCurrency) return 1;

      const rates = await this.getExchangeRates();
      if (!rates.rates[fromCurrency]) {
        throw new Error(
          `Exchange rate not found for currency: ${fromCurrency}`,
        );
      }

      return rates.rates[fromCurrency];
    } catch (error) {
      throw error;
    }
  }
}
