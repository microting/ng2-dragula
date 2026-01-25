import { Component, OnInit, OnDestroy } from "@angular/core";
import { DragulaService } from "ng2-dragula";
import { Subscription } from "rxjs";

@Component({
  selector: 'ex-00-canary',
  template: `
<div class='parent canary-test'>
  <h2>🐤 Canary Test - Drag & Drop Diagnostic</h2>
  
  <div class="debug-info">
    <h3>Debug Information:</h3>
    <ul>
      <li>DragulaService loaded: <strong>{{ dragulaServiceLoaded ? '✅ YES' : '❌ NO' }}</strong></li>
      <li>Component initialized: <strong>{{ componentInitialized ? '✅ YES' : '❌ NO' }}</strong></li>
      <li>Drag group created: <strong>{{ dragGroupCreated ? '✅ YES' : '❌ NO' }}</strong></li>
      <li>Drag events subscribed: <strong>{{ eventsSubscribed ? '✅ YES' : '❌ NO' }}</strong></li>
      <li>Last event: <strong>{{ lastEvent || 'None yet' }}</strong></li>
      <li>Event count: <strong>{{ eventCount }}</strong></li>
    </ul>
  </div>

  <div class="canary-instructions">
    <p><strong>Instructions:</strong> Try dragging items below. If drag & drop works, you should see events logged above.</p>
  </div>

  <div class='wrapper'>
    <div class='container canary-container' dragula="CANARY">
      <div class="canary-item">🔴 Item 1 - Drag me!</div>
      <div class="canary-item">🟢 Item 2 - Drag me!</div>
      <div class="canary-item">🔵 Item 3 - Drag me!</div>
    </div>
    <div class='container canary-container' dragula="CANARY">
      <div class="canary-item">🟡 Item 4 - Drag me!</div>
      <div class="canary-item">🟣 Item 5 - Drag me!</div>
    </div>
  </div>

  <div class="event-log">
    <h3>Event Log:</h3>
    <div class="log-entries">
      <div *ngFor="let log of eventLog" class="log-entry">{{ log }}</div>
      <div *ngIf="eventLog.length === 0" class="no-events">No events yet - try dragging items above</div>
    </div>
  </div>
</div>
  `,
  styles: [`
    .canary-test {
      border: 3px solid #ff6b6b;
      padding: 20px;
      margin: 20px 0;
      background: #fff5f5;
    }
    .canary-test h2 {
      color: #c92a2a;
      margin-top: 0;
    }
    .debug-info {
      background: white;
      padding: 15px;
      border-radius: 5px;
      margin: 15px 0;
      border: 2px solid #e9ecef;
    }
    .debug-info ul {
      margin: 10px 0;
      padding-left: 20px;
    }
    .debug-info li {
      margin: 8px 0;
      font-family: monospace;
    }
    .canary-instructions {
      background: #fff3cd;
      padding: 15px;
      border-radius: 5px;
      border: 2px solid #ffc107;
      margin: 15px 0;
    }
    .canary-container {
      background: #e3f2fd;
      border: 2px solid #2196f3;
      padding: 15px;
      min-height: 150px;
    }
    .canary-item {
      background: white;
      padding: 12px;
      margin: 8px 0;
      border: 2px solid #1976d2;
      cursor: move;
      border-radius: 5px;
      font-size: 16px;
      font-weight: bold;
    }
    .canary-item:hover {
      background: #f5f5f5;
      transform: scale(1.02);
      transition: all 0.2s;
    }
    .event-log {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 5px;
      margin-top: 15px;
      border: 2px solid #dee2e6;
    }
    .log-entries {
      max-height: 200px;
      overflow-y: auto;
      background: white;
      padding: 10px;
      border-radius: 3px;
    }
    .log-entry {
      padding: 5px;
      border-bottom: 1px solid #e9ecef;
      font-family: monospace;
      font-size: 12px;
    }
    .no-events {
      color: #868e96;
      font-style: italic;
      text-align: center;
      padding: 20px;
    }
  `]
})
export class CanaryComponent implements OnInit, OnDestroy {
  dragulaServiceLoaded = false;
  componentInitialized = false;
  dragGroupCreated = false;
  eventsSubscribed = false;
  lastEvent = '';
  eventCount = 0;
  eventLog: string[] = [];
  
  private subs = new Subscription();

  constructor(private dragulaService: DragulaService) {
    this.dragulaServiceLoaded = !!dragulaService;
    this.log('Constructor: DragulaService injection ' + (this.dragulaServiceLoaded ? 'SUCCESS' : 'FAILED'));
  }

  ngOnInit() {
    this.componentInitialized = true;
    this.log('ngOnInit: Component initialized');

    try {
      // Create the drag group
      this.dragulaService.createGroup('CANARY', {});
      this.dragGroupCreated = true;
      this.log('Drag group "CANARY" created successfully');
    } catch (e: any) {
      this.log('ERROR creating drag group: ' + e.message);
      this.dragGroupCreated = false;
    }

    try {
      // Subscribe to all dragula events
      const events = ['drag', 'dragend', 'drop', 'cancel', 'remove', 'shadow', 'over', 'out', 'cloned', 'drop-model', 'remove-model'];
      
      events.forEach(eventName => {
        const eventObservable = (this.dragulaService as any)[eventName];
        if (eventObservable) {
          this.subs.add(
            eventObservable('CANARY').subscribe((args: any) => {
              this.handleEvent(eventName, args);
            })
          );
        }
      });

      this.eventsSubscribed = true;
      this.log('Successfully subscribed to all drag events');
    } catch (e: any) {
      this.log('ERROR subscribing to events: ' + e.message);
      this.eventsSubscribed = false;
    }
  }

  ngOnDestroy() {
    this.log('Component destroying, cleaning up subscriptions');
    this.subs.unsubscribe();
    try {
      this.dragulaService.destroy('CANARY');
      this.log('Drag group "CANARY" destroyed');
    } catch (e) {
      // Group might not exist
    }
  }

  private handleEvent(eventName: string, args: any) {
    this.eventCount++;
    this.lastEvent = `${eventName} (${new Date().toLocaleTimeString()})`;
    this.log(`EVENT: ${eventName}`);
    console.log(`[Canary] ${eventName} event:`, args);
  }

  private log(message: string) {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${message}`;
    this.eventLog.unshift(logEntry);
    if (this.eventLog.length > 50) {
      this.eventLog.pop();
    }
    console.log('[Canary]', message);
  }
}
