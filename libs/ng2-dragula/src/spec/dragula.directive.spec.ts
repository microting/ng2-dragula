// <reference path="./jasmine.d.ts" />
// <reference path="./testdouble-jasmine.d.ts" />

import * as td from 'testdouble';
import { TestBed, waitForAsync, ComponentFixture } from '@angular/core/testing';
import { DragulaDirective } from '../components/dragula.directive';
import { DragulaService } from '../components/dragula.service';
import { DrakeWithModels } from '../DrakeWithModels';
import { Group } from '../Group';
import { DrakeFactory } from '../DrakeFactory';
import { EventTypes } from '../EventTypes';
import { MockDrakeFactory } from '../MockDrake';
import { TestHostComponent, TwoWay, Asynchronous } from './test-host.component';
import { Subject } from 'rxjs';
import { StaticService } from './StaticService';

const GROUP = "GROUP";

type SimpleDrake = Partial<DrakeWithModels>;

function setTimeoutPromise(milliseconds: number): Promise<void> {
  return new Promise((resolve) => { 
    setTimeout(resolve, milliseconds);
  });
}

describe('DragulaDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let service: StaticService;

  beforeEach(() => {
    service = new StaticService();
    TestBed.configureTestingModule({
      declarations: [ DragulaDirective, TestHostComponent, TwoWay, Asynchronous ],
      providers: [
        { provide: DrakeFactory, useValue: MockDrakeFactory },
        { provide: DragulaService, useValue: service }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    component.group = GROUP;
  });

  afterEach(() => {
    fixture.destroy();
    jest.restoreAllMocks();
    service.clear();
  });

  const mockMultipleDrakes = (...pairs: [Partial<DrakeWithModels>, string][]) => {
    let find = jest.fn();
    pairs.forEach(([drake, name]) => {
      const group = new Group(name, drake as any as DrakeWithModels, {});
      find = find.mockImplementation((name) => group);
    });
    td.replace(service, 'find', find);
    return find;
  };
  const mockDrake = (drake: Partial<DrakeWithModels>, name = GROUP) => {
    return mockMultipleDrakes([drake, name]);
  };

  const simpleDrake = (containers: Element[] = [], models: any = []) => {
    return { containers, models } as SimpleDrake;
  };

  const expectFindsInSequence = (find: any, seq: any[]) => {
    const calls = find.mock.calls;
    expect(find).toHaveBeenCalledTimes(seq.length);
    seq.forEach((val, index) => {
      expect(calls[index][0]).toBe(val);
    });
  };

  // ngOnInit AND checkModel
  it('should initialize with new drake and call DragulaService.createGroup', () => {
    component.group = GROUP;
    component.model = [];
    fixture.detectChanges();

    const group = service.find(GROUP);
    expect(group).toBeTruthy();
    expect(group.drake.models).toBeTruthy();
  });

  // checkModel: no dragulaModel
  it('should not setup with drake.models when dragulaModel == null', () => {
    component.group = GROUP;
    component.model = [];
    fixture.detectChanges();
    const group = service.find(GROUP);
    expect(group.drake.models).toStrictEqual([[]]);
  });

  // ngOnInit
  // checkModel: dragulaModel, drake, push to drake.models
  it('should initialize and add to existing drake', () => {
    const theirs = [ { someVar: 'theirs' } ];
    const mine = [ { someVar: 'mine' } ];
    const drake = simpleDrake([document.createElement('div')], theirs);
    mockDrake(drake);

    component.model = mine;
    fixture.detectChanges();
    expect(drake?.containers?.length).toBe(2);
    expect(drake.models?.length).toBe(2);
  });

  // ngOnChanges
  // there is no way to mock direct array mutation of a drake's models
  // it('should do nothing for no model changes', () => {
  // });

  // ngOnChanges
  it('should update the model value on existing drake.models', () => {
    const myModel = [ 'something' ];
    const newModel = [ 'something new' ];
    let drake = simpleDrake([document.createElement('div')], [myModel]);
    mockDrake(drake);

    component.model = myModel;
    fixture.detectChanges();
    drake = simpleDrake([document.createElement('div')], [newModel]);
    mockDrake(drake);
    component.model = newModel;
    fixture.detectChanges();

    expect(drake.models?.[0]).toEqual(newModel);
  });

  // ngOnChanges
  it('should update the model value on an existing drake, with no models', () => {
    const drake = simpleDrake();
    const find = mockDrake(drake);
    fixture.detectChanges();
    const myModel = ["something"];
    const newModel = ['something new'];

    component.model = myModel;
    fixture.detectChanges();
    component.model = newModel;
    fixture.detectChanges();
    expect(drake.models?.[0]).toEqual(newModel);
  });

  // ngOnChanges
  it('should add a container and a model on init, take 2', () => {
    const theirModel = [ "someone else's model" ];
    const myModel = [ "something" ];
    // create an existing drake with models
    const drake = simpleDrake([document.createElement('div')], theirModel);
    mockDrake(drake);

    component.model = myModel;
    fixture.detectChanges();
    expect(drake?.containers?.length).toBe(2);
    expect(drake.containers).toContain(component.host?.nativeElement);
    expect(drake.models).toContain(myModel);
  });

  // ngOnChanges
  it('should do nothing if there is no bag name', () => {
    // if DragulaDirective is initialized, it tries to find the bag
    const find = jest.fn(()=> GROUP);
    component.group = '';
    component.model = [];
    fixture.detectChanges();
    expect(find).toHaveBeenCalledTimes(0);
  });

  // ngOnChanges
  it('should cleanly move to another drake when bag name changes', () => {
    const CAT = "CAT", DOG = "DOG";
    const catDrake = simpleDrake();
    const dogDrake = simpleDrake();
    const find = mockMultipleDrakes([catDrake, CAT], [dogDrake, DOG]);

    component.group = CAT;
    component.model = [ { animal: 'generic four-legged creature' } ];
    fixture.detectChanges();
    component.group = DOG;
    fixture.detectChanges();
    // setup CAT, teardown CAT, setup DOG
    expectFindsInSequence(find, [CAT, CAT, DOG]);

    // clean move to another drake
    expect(catDrake.models?.length).toBe(0);
    expect(catDrake.containers?.length).toBe(0);
    expect(dogDrake.models?.length).toBe(1);
    expect(dogDrake.models).toContain(component.model);
    expect(dogDrake.containers?.length).toBe(1);
    expect(dogDrake.containers).toContain(component.host?.nativeElement);
  });

  // ngOnChanges
  it('should clean up when un-setting bag name', () => {
    const drake = simpleDrake();
    const find = mockDrake(drake);
    component.group = GROUP;
    component.model = [];
    fixture.detectChanges();
    component.group = '';
    fixture.detectChanges();

    // setup, then teardown
    expectFindsInSequence(find, [ GROUP, GROUP ]);

    expect(drake.models?.length).toBe(0);
    expect(drake.containers?.length).toBe(0);
  });

  const testUnsettingModel = (drake: SimpleDrake) => {
    const find = mockDrake(drake);
    const firstModel = [{ first: 'model' }];
    const nextModel = [{ next: 'model' }];

    component.group = GROUP;
    component.model = firstModel;
    fixture.detectChanges();
    component.model = [];
    fixture.detectChanges();

    // setup, then teardown
    expectFindsInSequence(find, [ GROUP ]);

    expect(drake.models).not.toContain(firstModel);
    expect(drake.containers).toContain(component.host?.nativeElement);

    component.model = nextModel;
    fixture.detectChanges();

    expect(drake.models).not.toContain(firstModel);
    expect(drake.models).toContain(nextModel);

  };

  // ngOnChanges
  it('should clean up when un-setting the model, with no other members', () => {
    const drake = simpleDrake();
    testUnsettingModel(drake);
  });

  // ngOnChanges
  it('should clean up when un-setting the model, with other active models in the drake', () => {
    const existingContainer = document.createElement('div');
    const existingModel = [{ existing: 'model' }];
    const drake = simpleDrake([existingContainer], [existingModel]);
    testUnsettingModel(drake);
    expect(drake.containers).toContain(existingContainer);
    expect(drake.models).toContain(existingModel);
  });

  // set up fake event subscription so we can fire events manually
  const mockServiceEvent = (eventName: EventTypes) => {
    const fn = jest.fn().mockImplementation(()=> evts);
    const evts = new Subject();
    fn(GROUP as any);
    td.replace(service, 'dropModel', fn);
    return evts;
  };

  it('should fire dragulaModelChange on dropModel', () => {
    const dropModel = mockServiceEvent(EventTypes.DropModel);
    // @ts-ignore
    const modelChange = jest.spyOn(component, 'modelChange');
    const item = { a: 'dragged' };
    const myModel = [{ a: 'static' }];
    const theirModel = [item];
    component.group = GROUP;
    component.model = myModel;
    fixture.detectChanges();

    const source = document.createElement('ul');
    const target = component.host?.nativeElement;
    const myNewModel = myModel.slice(0);
    myNewModel.push(item);
    const theirNewModel: any[] = [];
    dropModel.next({
      name: GROUP,
      source,
      target,
      sourceModel: theirNewModel,
      targetModel: myNewModel
    });
    expect(modelChange).toBeCalled();
  });

  it('should fire dragulaModelChange on removeModel', () => {
    const removeModel = mockServiceEvent(EventTypes.RemoveModel);
    // @ts-ignore
    const modelChange = jest.spyOn(component, 'modelChange');
    const item = { a: 'to be removed' };
    const myModel = [item];
    component.group = GROUP;
    component.model = myModel;
    fixture.detectChanges();

    const source = component.host?.nativeElement;
    const myNewModel: any[] = [];
    removeModel.next({
      name: GROUP,
      item,
      source,
      sourceModel: myNewModel
    });

    expect(modelChange).toBeCalled();
  });

  const testModelChange = async <T extends TestHostComponent | TwoWay | Asynchronous>(
    componentClass: { new(...args: any[]): T},
    saveToComponent = true,
  ) => {
    const fixture = TestBed.createComponent(componentClass);
    const component = fixture.componentInstance;
    const removeModel = mockServiceEvent(EventTypes.RemoveModel);
    const same = { a: 'same' };
    const same2 = { same2: '2' };
    const item = { a: 'to be removed' };
    const myModel = [same, item, same2];
    component.group = GROUP;
    component.model = myModel;
    await setTimeoutPromise(1000);
    fixture.detectChanges();

    const bag = service.find(GROUP);
    expect(bag).toBeTruthy();
    expect(bag.drake.models).toBeTruthy();
    expect(bag.drake.models && bag.drake.models[0]).toBe(myModel);

    const source = component.host?.nativeElement;
    const myNewModel: any[] = [same, same2];
    if (bag.drake.models) {
      bag.drake.models[0] = myNewModel; // simulate the drake.on(remove) handler
    }
    removeModel.next({
      name: GROUP,
      item,
      source,
      sourceModel: myNewModel
    });

    if (saveToComponent) {
      expect(component.model).toBe(
        myNewModel
      );
    }

    // now test whether the new array causes a teardown/setup cycle
    // @ts-ignore
    const setup = jest.spyOn(component.directive || {}, 'setup');
    // @ts-ignore
    const teardown = jest.spyOn(component.directive || {}, 'teardown');

    // before change detection
    expect(component.directive?.dragulaModel).not.toBe(myNewModel);

    // now propagate dragulaModelChange to the directive
    fixture.detectChanges();

    // after change detection
    if (saveToComponent) {
      expect(component.model).toBe(myNewModel);
    }
    expect(component.directive?.dragulaModel).toBe(myNewModel);
    // the directive shouldn't trigger a teardown/re-up
    expect(teardown).toHaveBeenCalledTimes(0);
    expect(setup).toHaveBeenCalledTimes(0);
    expect(bag.drake.models?.[0]).toBe(myNewModel);

  };

  describe('(dragulaModelChange)', () => {
    it('should work with (event) binding', () => {
      testModelChange(TestHostComponent);
    });
    it('should work with two-way binding', () => {
      testModelChange(TwoWay);
    });
    it('should work with an async pipe', waitForAsync(async () => {
      await testModelChange(Asynchronous, false);
    }));
  });

  describe('Additional directive coverage', () => {
    it('should properly cleanup subscriptions on ngOnDestroy', () => {
      component.group = GROUP;
      component.model = [];
      fixture.detectChanges();

      const directive = component.directive;
      expect(directive).toBeTruthy();
      
      // Mock the subscription to verify unsubscribe is called
      const unsubscribeSpy = jest.fn();
      if (directive) {
        // @ts-ignore - accessing private property for testing
        directive.subs = { unsubscribe: unsubscribeSpy };
      }

      // Trigger ngOnDestroy
      fixture.destroy();
      
      expect(unsubscribeSpy).toHaveBeenCalled();
    });

    it('should handle multiple containers with same group name', () => {
      // Create two components with the same group
      const fixture1 = TestBed.createComponent(TestHostComponent);
      const component1 = fixture1.componentInstance;
      component1.group = GROUP;
      component1.model = ['a', 'b'];
      
      const fixture2 = TestBed.createComponent(TestHostComponent);
      const component2 = fixture2.componentInstance;
      component2.group = GROUP;
      component2.model = ['x', 'y'];
      
      fixture1.detectChanges();
      fixture2.detectChanges();

      const group = service.find(GROUP);
      expect(group).toBeTruthy();
      expect(group.drake.containers.length).toBe(2);
      expect(group.drake.models?.length).toBe(2);
      expect(group.drake.models).toContain(component1.model);
      expect(group.drake.models).toContain(component2.model);

      fixture1.destroy();
      fixture2.destroy();
    });

    it('should update container element correctly after multiple changes', () => {
      const drake = simpleDrake();
      mockDrake(drake);
      
      component.group = GROUP;
      component.model = ['test'];
      fixture.detectChanges();
      
      const firstContainer = component.host?.nativeElement;
      expect(drake.containers).toContain(firstContainer);
      expect(drake.containers?.length).toBe(1);
      
      // Change model but keep same group
      component.model = ['updated'];
      fixture.detectChanges();
      
      // Container should still be the same
      expect(drake.containers).toContain(firstContainer);
      expect(drake.containers?.length).toBe(1);
    });

    it('should handle rapid group name changes', () => {
      const CAT = 'CAT', DOG = 'DOG', BIRD = 'BIRD';
      const catDrake = simpleDrake();
      const dogDrake = simpleDrake();
      const birdDrake = simpleDrake();
      
      const find = jest.fn();
      find.mockImplementation((name: string) => {
        if (name === CAT) return new Group(CAT, catDrake as any, {});
        if (name === DOG) return new Group(DOG, dogDrake as any, {});
        if (name === BIRD) return new Group(BIRD, birdDrake as any, {});
        return null;
      });
      td.replace(service, 'find', find);
      
      component.model = ['item'];
      
      // Rapid changes
      component.group = CAT;
      fixture.detectChanges();
      
      component.group = DOG;
      fixture.detectChanges();
      
      component.group = BIRD;
      fixture.detectChanges();
      
      // Only BIRD should have the container and model
      expect(catDrake.containers?.length).toBe(0);
      expect(dogDrake.containers?.length).toBe(0);
      expect(birdDrake.containers?.length).toBe(1);
      expect(birdDrake.models?.length).toBe(1);
    });

    it('should handle undefined dragula input gracefully', () => {
      component.group = undefined as any;
      component.model = ['test'];
      
      expect(() => {
        fixture.detectChanges();
      }).not.toThrow();
      
      // No group should be created
      const group = service.find(undefined as any);
      expect(group).toBeFalsy();
    });

    it('should handle empty string dragula input', () => {
      component.group = '';
      component.model = ['test'];
      fixture.detectChanges();
      
      // No group should be created
      const group = service.find('');
      expect(group).toBeFalsy();
    });

    it('should subscribe to both dropModel and removeModel events', () => {
      const dropModelSpy = jest.fn().mockReturnValue(new Subject());
      const removeModelSpy = jest.fn().mockReturnValue(new Subject());
      
      td.replace(service, 'dropModel', dropModelSpy);
      td.replace(service, 'removeModel', removeModelSpy);
      
      component.group = GROUP;
      component.model = ['test'];
      fixture.detectChanges();
      
      expect(dropModelSpy).toHaveBeenCalledWith(GROUP);
      expect(removeModelSpy).toHaveBeenCalledWith(GROUP);
    });

    it('should emit dragulaModelChange when source element matches', () => {
      const dropModel = mockServiceEvent(EventTypes.DropModel);
      const modelChangeSpy = jest.spyOn(component, 'modelChange');
      
      component.group = GROUP;
      component.model = ['a', 'b'];
      fixture.detectChanges();
      
      const source = component.host?.nativeElement;
      const target = document.createElement('ul');
      const newModel = ['a'];
      
      dropModel.next({
        name: GROUP,
        source,
        target,
        sourceModel: newModel,
        targetModel: ['b']
      });
      
      expect(modelChangeSpy).toHaveBeenCalledWith(newModel);
    });

    it('should emit dragulaModelChange when target element matches', () => {
      const dropModel = mockServiceEvent(EventTypes.DropModel);
      const modelChangeSpy = jest.spyOn(component, 'modelChange');
      
      component.group = GROUP;
      component.model = ['x'];
      fixture.detectChanges();
      
      const source = document.createElement('ul');
      const target = component.host?.nativeElement;
      const newModel = ['x', 'y'];
      
      dropModel.next({
        name: GROUP,
        source,
        target,
        sourceModel: ['y'],
        targetModel: newModel
      });
      
      expect(modelChangeSpy).toHaveBeenCalledWith(newModel);
    });

    it('should not emit dragulaModelChange when neither source nor target matches', () => {
      const dropModel = mockServiceEvent(EventTypes.DropModel);
      const modelChangeSpy = jest.spyOn(component, 'modelChange');
      
      component.group = GROUP;
      component.model = ['test'];
      fixture.detectChanges();
      
      const source = document.createElement('ul');
      const target = document.createElement('ul');
      
      dropModel.next({
        name: GROUP,
        source,
        target,
        sourceModel: ['a'],
        targetModel: ['b']
      });
      
      expect(modelChangeSpy).not.toHaveBeenCalled();
    });

    it('should create group with empty options if group does not exist', () => {
      const createGroupSpy = jest.spyOn(service, 'createGroup');
      
      component.group = 'NEW_GROUP';
      component.model = [];
      fixture.detectChanges();
      
      expect(createGroupSpy).toHaveBeenCalledWith('NEW_GROUP', {});
      service.destroy('NEW_GROUP');
    });

    it('should not create duplicate group if it already exists', () => {
      const existingDrake = simpleDrake();
      const existingGroup = new Group(GROUP, existingDrake as any, {});
      td.replace(service, 'find', jest.fn().mockReturnValue(existingGroup));
      const createGroupSpy = jest.spyOn(service, 'createGroup');
      
      component.group = GROUP;
      component.model = [];
      fixture.detectChanges();
      
      expect(createGroupSpy).not.toHaveBeenCalled();
    });

    it('should handle model change from array to null', () => {
      const drake = simpleDrake();
      mockDrake(drake);
      
      component.group = GROUP;
      component.model = ['a', 'b'];
      fixture.detectChanges();
      
      expect(drake.models).toContain(component.model);
      
      component.model = undefined;
      fixture.detectChanges();
      
      // Model should be removed from drake
      expect(drake.models).not.toContain(['a', 'b']);
    });

    it('should properly remove model from drake on teardown', () => {
      const existingModel = ['existing'];
      const myModel = ['mine'];
      const drake = simpleDrake([document.createElement('div')], [existingModel]);
      const find = jest.fn().mockImplementation((name: string) => {
        if (name === GROUP) return new Group(GROUP, drake as any, {});
        return null;
      });
      td.replace(service, 'find', find);
      
      component.group = GROUP;
      component.model = myModel;
      fixture.detectChanges();
      
      expect(drake.models?.length).toBe(2);
      expect(drake.models).toContain(myModel);
      
      // Trigger teardown by setting empty group
      component.group = '';
      fixture.detectChanges();
      
      expect(drake.models?.length).toBe(1);
      expect(drake.models).not.toContain(myModel);
      expect(drake.models).toContain(existingModel);
    });

    it('should handle container removal from drake on teardown', () => {
      const existingContainer = document.createElement('div');
      const drake = simpleDrake([existingContainer]);
      mockDrake(drake);
      
      component.group = GROUP;
      component.model = [];
      fixture.detectChanges();
      
      const myContainer = component.host?.nativeElement;
      expect(drake.containers?.length).toBe(2);
      expect(drake.containers).toContain(myContainer);
      
      // Trigger teardown
      component.group = '';
      fixture.detectChanges();
      
      expect(drake.containers?.length).toBe(1);
      expect(drake.containers).not.toContain(myContainer);
      expect(drake.containers).toContain(existingContainer);
    });
  });
});
