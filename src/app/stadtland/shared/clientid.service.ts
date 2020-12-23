import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ClientIdService {
  constructor() {
    if (!this.clientId) {
      this.clientId = this.generateRandomId();
    }
  }

  get clientId(): string {
    return localStorage.getItem('slfClientId');
  }

  set clientId(id: string) {
    localStorage.setItem('slfClientId', id);
  }

  isMyClientId(id: string) {
    return id === this.clientId;
  }

  private generateRandomId(len = 32): string {
    const arr = new Uint8Array((len || 40) / 2);
    window.crypto.getRandomValues(arr);
    return Array.from(arr, dec => dec.toString(16).padStart(2, '0')).join('');
  }
}
