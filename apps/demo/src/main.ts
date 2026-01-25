import './polyfills';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DragulaDemoModule } from './app/app.module';
import { environment } from './environments/environment';

console.log('[DEMO] Starting ng2-dragula demo application...');
console.log('[DEMO] Environment:', environment);
console.log('[DEMO] Production mode:', environment.production);

if (environment.production) {
  enableProdMode();
  console.log('[DEMO] Production mode enabled');
}

console.log('[DEMO] Bootstrapping DragulaDemoModule...');

platformBrowserDynamic().bootstrapModule(DragulaDemoModule)
  .then(() => {
    console.log('[DEMO] ✅ Bootstrap successful! App is running.');
  })
  .catch(err => {
    console.error('[DEMO] ❌ Bootstrap failed:', err);
    console.error('[DEMO] Error details:', err.message, err.stack);
  });
