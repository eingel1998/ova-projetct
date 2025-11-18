import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private config: any = null;

  async load() {
    try {
      const response = await fetch('/config.json');
      this.config = await response.json();
    } catch (err) {
      console.error('❌ Error cargando config.json:', err);
      this.config = {};
    }
  }

  get(key: string): string {
    return this.config?.[key] || '';
  }
}
