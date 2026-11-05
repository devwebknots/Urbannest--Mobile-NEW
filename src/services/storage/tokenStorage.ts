/**
 * Token Storage Service
 * Abstraction layer for persisting and retrieving authentication tokens.
 */

class TokenStorage {
  private inMemoryAccessToken: string | null = null;
  private inMemoryRefreshToken: string | null = null;

  public async getAccessToken(): Promise<string | null> {
    return this.inMemoryAccessToken;
  }

  public async setAccessToken(token: string): Promise<void> {
    this.inMemoryAccessToken = token;
  }

  public async getRefreshToken(): Promise<string | null> {
    return this.inMemoryRefreshToken;
  }

  public async setRefreshToken(token: string): Promise<void> {
    this.inMemoryRefreshToken = token;
  }

  public async clear(): Promise<void> {
    this.inMemoryAccessToken = null;
    this.inMemoryRefreshToken = null;
  }
}

export const tokenStorage = new TokenStorage();
export default tokenStorage;
