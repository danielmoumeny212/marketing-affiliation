import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Injectable, Inject } from "@nestjs/common";
import { Cache } from "cache-manager";


@Injectable()
export class RedisService {

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ){

  }
  
  getClient() {
    const store = this.cacheManager.store; 

    return store;
  }
}