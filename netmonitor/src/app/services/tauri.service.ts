import { Injectable } from '@angular/core';
import { invoke } from '@tauri-apps/api/core';

@Injectable({
  providedIn: 'root'
})
export class TauriService {
  invoke<T>(cmd: string, args?: any): Promise<T> {
    return invoke<T>(cmd, args);
  }
}
