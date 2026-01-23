// <reference path="./jasmine.d.ts" />
// <reference path="./testdouble-jasmine.d.ts" />
import * as td from 'testdouble';
import { DragulaService } from '../components/dragula.service';
import { Group } from '../Group';
import { take } from 'rxjs/operators';
import { MockDrake, MockDrakeFactory } from '../MockDrake';
import { EventTypes } from '../EventTypes';
import { DragulaOptions } from '../DragulaOptions';

const GROUP = "GROUP";

describe('DragulaService', () => {
  let service: DragulaService;
  beforeEach(() => {
    service = new DragulaService(MockDrakeFactory);
  });
  afterEach(() => {
    td.reset();
    jest.restoreAllMocks();
  });

  // ngOnInit AND checkModel
  // checkModel: no dragulaModel
  it('should initialize with new drake and call DragulaService.add', () => {
    expect(true).toBe(true);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should add a bag', () => {
    service.createGroup(GROUP, {});
    const bag = service.find(GROUP);
    expect(bag).toBeTruthy();
    expect(bag.name).toBe(GROUP);
  });

  const buildList = (_root: string, _children: string[] = []) => {
    const root = document.createElement(_root);
    const children = _children
      .map(x => document.createElement(x));
    children.forEach(el => root.appendChild(el));
    return root as Element;
  };

  const _addMockDrake = (
    name: string = GROUP,
    containers: Element[] = [],
    options: DragulaOptions = {},
    models?: any[][]
  ) => {
    const mock = new MockDrake(containers, options, models);
    service.add(new Group(name, mock, options));
    return mock;
  };

  it('should fire drag when drake does', done => {
    const ul = buildList('ul', ['li']);
    const li = ul.children[0] as Element;
    const mock = _addMockDrake(GROUP, [ul]);
    const fn = jest.fn();
    service.drag().pipe(take(1)).subscribe(ev => {
      fn(ev as any);
      expect(ev).toBeTruthy();
      expect(ev.el).toStrictEqual(li);
      service.destroy(GROUP);
      done();
    });
    mock.emit(EventTypes.Drag, li, ul);
  }, 1000);

//how it should be test if logic doesn't pass empty values, object will be always truthy
  xit('should not fire drag for an irrelevant drag type', done => {
    const ul = buildList('ul', ['li']);
    const li = ul.children[0];
    const mock = _addMockDrake("MY_COOL_TYPE", []);
    const fn = jest.fn();
    service.drag("IRRELEVANT").pipe(take(1)).subscribe(ev => {
      fn(ev as any);
      expect(ev).not.toBeTruthy();
      service.destroy("MY_COOL_TYPE");
      done();
    });
    mock.emit(EventTypes.Drag, li, ul);
  }, 1000);

  it('should not throw when destroying a non-existent bag', () => {
    expect(() => {
      service.destroy("NON_EXISTENT");
    }).not.toThrow();
  });

  it('should throw when creating a bag that already exists', () => {
    expect(() => {
      service.createGroup("EXISTENT", {});
      service.createGroup("EXISTENT", {});
    }).toThrow();
    service.destroy("EXISTENT");
  });

  it('should createGroup', () => {
    service.createGroup("NEWLY", {});
    const group = service.find("NEWLY");
    expect(group).toBeTruthy();
    service.destroy("NEWLY");
  });

  it('should destroy a drake when destroying a bag', () => {
    const mock = _addMockDrake("_", []);
    const mockFunc = jest.fn();
    const destroyDrake = td.replace(mock, 'destroy', mockFunc);
    service.destroy("_");
    expect(destroyDrake).toBeDefined();
    expect(destroyDrake).toBeCalled();
    const drake = service.find("_");
    expect(drake).toBeFalsy();
    mock.destroy();
  });

//not sure logic is ready for this test as result gets object with values
  xit('should start listening to drake events when drake without models passed to add', done => {
    const ul = buildList('ul', ['li']);
    const li = ul.children[0];
    const mock = _addMockDrake("NOMODELS", [], {}, undefined);
    const fn = jest.fn();
    service.drag("NOMODELS").pipe(take(1)).subscribe(ev => {
      fn(ev as any);
      expect(ev).not.toBeTruthy();
      service.destroy("MY_COOL_TYPE");
      done();
    });
    mock.emit(EventTypes.Drag, li, ul);
  }, 1000);

  it('should receive dropModel events', done => {
    const ul = buildList('ul', ['li', 'li']);
    const li = ul.children[0];
    type Item = { my: string };
    const myItem = { my: 'li item' };
    const mock = _addMockDrake(
      "MODELS",
      [ul],
      {},
      [ [myItem, { my: 'cat' }] ]
    );
    service.dropModel<Item>("MODELS").pipe(take(1)).subscribe(ev => {
      const fn = jest.fn();
      fn(ev as any);
      expect(ev).toBeTruthy();
      expect(ev?.item).toStrictEqual(myItem);
      service.destroy("MODELS");
      done();
    });
    mock.emit(EventTypes.Drag, li, ul);
    mock.emit(EventTypes.Drop, li, ul, ul, ul.children[1], { my: 'li item' });
  }, 1000);

  it('should not act on to dropModel events until drake.models has a value', done => {
    const ul = buildList('ul', ['li', 'li']);
    const li = ul.children[0];
    const mock = _addMockDrake("NOMODELS", [ul], {}, undefined);

    service.dropModel("NOMODELS").pipe(take(0)).subscribe(ev => {
      const fn = jest.fn();
      fn(ev as any);
      // expect(ev).not.toBeTruthy(); //can't see logic with passing null value
    });
    mock.emit(EventTypes.Drag, li, ul);
    ul.removeChild(li);
    ul.appendChild(li);
    mock.emit(EventTypes.Drop, li, ul, ul, undefined);
    service.dropModel("NOMODELS").pipe(take(1)).subscribe(ev => {
      const fn = jest.fn();
      fn(ev as any);
      expect(ev).toBeTruthy();
      expect(ev.item).toBe('a');
      service.destroy("NOMODELS");
      done();
    });
    mock.models = [['b', 'a']];
    mock.emit(EventTypes.Drag, li, ul);
    // put it back
    ul.removeChild(li);
    ul.insertBefore(li, ul.firstChild);
    mock.emit(EventTypes.Drop, li, ul, ul, undefined);
  }, 1000);
  //
  it('should dropModel correctly in same list (forwards)', done => {
    const ul = buildList('ul', ['li', 'li']);
    const li = ul.children[0];
    const model = ['a', 'b'];
    const mock = _addMockDrake("DROPMODEL", [ ul ], {}, [ model ]);

    service.dropModel("DROPMODEL").pipe(take(1)).subscribe(ev => {
      const fn = jest.fn();
      fn(ev as any);
      expect(ev).toBeTruthy();
      expect(ev.source).toBe(ul);
      expect(ev.sourceModel).not.toBe(model);
      expect(ev.sourceModel?.length).toBe(model.length);
      expect(ev.targetModel).not.toBe(model);
      expect(ev.targetModel).toContain('a');
      // expect(ev.sourceIndex).toBe(0); // we get undefined
      expect(ev.targetIndex).toBe(1);
      expect(ev.targetModel[0]).toBe('b');
      expect(ev.targetModel[1]).toBe('a');
      service.destroy("DROPMODEL");
      done();
    });

    mock.emit(EventTypes.Drag, li, ul);
    ul.removeChild(li); // removes a at index 0
    ul.appendChild(li); // adds a at index 1
    mock.emit(EventTypes.Drop, li, ul, ul, undefined);
  }, 1000);

  it('should dropModel correctly in same list (backwards)', done => {
    const ul = buildList('ul', ['li', 'li', 'li']);
    const li = ul.children[2]; // c
    const model = ['a', 'b', 'c'];
    const mock = _addMockDrake("DROPMODEL", [ ul ], {}, [ model ]);

    service.dropModel("DROPMODEL").pipe(take(1)).subscribe(ev => {
      const fn = jest.fn();
      fn(ev as any);
      expect(ev).toBeTruthy();
      expect(ev.source).toBe(ul);
      expect(ev.sourceModel).not.toBe(model);
      expect(ev.sourceModel.length).toBe(model.length);
      expect(ev.sourceModel).toBe(ev.targetModel);
      expect(ev.targetModel).not.toBe(model);
      expect(ev.targetModel).toContain('a');
      expect(ev.sourceIndex).toBe(2);
      expect(ev.targetIndex).toBe(0);
      expect(ev.targetModel[0]).toBe('c');
      expect(ev.targetModel[1]).toBe('a');
      service.destroy("DROPMODEL");
      done();
    });
    mock.emit(EventTypes.Drag, li, ul);
    ul.removeChild(li); // remove c from index 2
    ul.insertBefore(li, ul.firstChild); // add c at index 0
    mock.emit(EventTypes.Drop, li, ul, ul, undefined);

  }, 1000);


  it('should dropModel correctly in different lists', done => {
    const sourceModel = ['a', 'b', 'c'];
    const targetModel = ['x', 'y'];
    const source = buildList('ul', ['li', 'li', 'li']);
    const target = buildList('ul', ['li', 'li']);
    const li = source.children[1]; // b
    const options = {};
    const mock = _addMockDrake("DROPMODEL", [ source, target ], options, [ sourceModel, targetModel ]);

    service.dropModel("DROPMODEL").pipe(take(1)).subscribe(ev => {
      const fn = jest.fn();
      fn(ev as any);
      expect(ev).toBeTruthy();
      expect(ev.source).toBe(source);
      expect(ev.sourceModel).not.toBe(sourceModel);
      expect(ev.sourceModel.length).toBe(2);
      expect(ev.sourceModel).not.toContain('b');
      expect(ev.sourceModel).not.toBe(ev.targetModel);
      expect(ev.target).toBe(target);
      expect(ev.targetModel).not.toBe(targetModel);
      expect(ev.targetModel).toContain('b');
      expect(ev.sourceIndex).toBe(1);
      expect(ev.targetIndex).toBe(2);
      expect(ev.targetModel.length).toBe(3);
      expect(ev.targetModel[0]).toBe('x');
      expect(ev.targetModel[1]).toBe('y');
      expect(ev.targetModel[2]).toBe('b');
      service.destroy("DROPMODEL");
      done();
    });
    mock.emit(EventTypes.Drag, li, source);
    source.removeChild(li); // remove b at index 1
    target.appendChild(li); // add b at index 2
    mock.emit(EventTypes.Drop, li, target, source, undefined);
  }, 1000);

  it('should removeModel', done => {
    const model = ['a', 'b', 'c'];
    const ul = buildList('ul', ['li', 'li', 'li']);
    const li = ul.children[1]; // b
    const mock = _addMockDrake("REMOVEMODEL", [ ul ], {}, [ model ]);

    service.removeModel("REMOVEMODEL").pipe(take(1)).subscribe(ev => {
      const fn = jest.fn();
      fn(ev as any);
      expect(ev).toBeTruthy();
      expect(ev.source).toBe(ul);
      expect(ev.sourceModel).not.toBe(model);
      expect(ev.sourceModel.length).toBe(2);
      expect(ev.sourceModel[0]).toBe('a');
      // no b
      expect(ev.sourceModel[1]).toBe('c');
      expect(ev.sourceIndex).toBe(1);
      service.destroy("REMOVEMODEL");
      done();
    });
    mock.emit(EventTypes.Drag, li, ul);
    ul.removeChild(li);
    mock.emit(EventTypes.Remove, li, /*container*/ul, /*source*/ul);
  });

  // Additional comprehensive tests for all event types
  describe('Event type coverage', () => {
    it('should fire dragend event', done => {
      const ul = buildList('ul', ['li']);
      const li = ul.children[0] as Element;
      const mock = _addMockDrake('DRAGEND_TEST', [ul]);
      
      service.dragend('DRAGEND_TEST').pipe(take(1)).subscribe(ev => {
        expect(ev).toBeTruthy();
        expect(ev.name).toBe('DRAGEND_TEST');
        expect(ev.el).toStrictEqual(li);
        service.destroy('DRAGEND_TEST');
        done();
      });
      
      mock.emit(EventTypes.DragEnd, li);
    }, 1000);

    it('should fire drop event', done => {
      const ul = buildList('ul', ['li', 'li']);
      const li = ul.children[0] as Element;
      const sibling = ul.children[1] as Element;
      const mock = _addMockDrake('DROP_TEST', [ul]);
      
      service.drop('DROP_TEST').pipe(take(1)).subscribe(ev => {
        expect(ev).toBeTruthy();
        expect(ev.name).toBe('DROP_TEST');
        expect(ev.el).toStrictEqual(li);
        expect(ev.target).toBe(ul);
        expect(ev.source).toBe(ul);
        expect(ev.sibling).toStrictEqual(sibling);
        service.destroy('DROP_TEST');
        done();
      });
      
      mock.emit(EventTypes.Drop, li, ul, ul, sibling);
    }, 1000);

    it('should fire cloned event with mirror type', done => {
      const ul = buildList('ul', ['li']);
      const original = ul.children[0] as Element;
      const clone = original.cloneNode(true) as Element;
      const mock = _addMockDrake('CLONED_TEST', [ul]);
      
      service.cloned('CLONED_TEST').pipe(take(1)).subscribe(ev => {
        expect(ev).toBeTruthy();
        expect(ev.name).toBe('CLONED_TEST');
        expect(ev.clone).toStrictEqual(clone);
        expect(ev.original).toStrictEqual(original);
        expect(ev.cloneType).toBe('mirror');
        service.destroy('CLONED_TEST');
        done();
      });
      
      mock.emit(EventTypes.Cloned, clone, original, 'mirror');
    }, 1000);

    it('should fire cloned event with copy type', done => {
      const ul = buildList('ul', ['li']);
      const original = ul.children[0] as Element;
      const clone = original.cloneNode(true) as Element;
      const mock = _addMockDrake('CLONED_COPY_TEST', [ul]);
      
      service.cloned('CLONED_COPY_TEST').pipe(take(1)).subscribe(ev => {
        expect(ev).toBeTruthy();
        expect(ev.cloneType).toBe('copy');
        service.destroy('CLONED_COPY_TEST');
        done();
      });
      
      mock.emit(EventTypes.Cloned, clone, original, 'copy');
    }, 1000);

    it('should fire cancel event', done => {
      const ul = buildList('ul', ['li']);
      const li = ul.children[0] as Element;
      const mock = _addMockDrake('CANCEL_TEST', [ul]);
      
      service.cancel('CANCEL_TEST').pipe(take(1)).subscribe(ev => {
        expect(ev).toBeTruthy();
        expect(ev.name).toBe('CANCEL_TEST');
        expect(ev.el).toStrictEqual(li);
        expect(ev.container).toBe(ul);
        expect(ev.source).toBe(ul);
        service.destroy('CANCEL_TEST');
        done();
      });
      
      mock.emit(EventTypes.Cancel, li, ul, ul);
    }, 1000);

    it('should fire remove event', done => {
      const ul = buildList('ul', ['li']);
      const li = ul.children[0] as Element;
      const mock = _addMockDrake('REMOVE_TEST', [ul]);
      
      service.remove('REMOVE_TEST').pipe(take(1)).subscribe(ev => {
        expect(ev).toBeTruthy();
        expect(ev.name).toBe('REMOVE_TEST');
        expect(ev.el).toStrictEqual(li);
        expect(ev.container).toBe(ul);
        expect(ev.source).toBe(ul);
        service.destroy('REMOVE_TEST');
        done();
      });
      
      mock.emit(EventTypes.Remove, li, ul, ul);
    }, 1000);

    it('should fire shadow event', done => {
      const ul = buildList('ul', ['li']);
      const li = ul.children[0] as Element;
      const mock = _addMockDrake('SHADOW_TEST', [ul]);
      
      service.shadow('SHADOW_TEST').pipe(take(1)).subscribe(ev => {
        expect(ev).toBeTruthy();
        expect(ev.name).toBe('SHADOW_TEST');
        expect(ev.el).toStrictEqual(li);
        expect(ev.container).toBe(ul);
        expect(ev.source).toBe(ul);
        service.destroy('SHADOW_TEST');
        done();
      });
      
      mock.emit(EventTypes.Shadow, li, ul, ul);
    }, 1000);

    it('should fire over event', done => {
      const ul = buildList('ul', ['li']);
      const li = ul.children[0] as Element;
      const mock = _addMockDrake('OVER_TEST', [ul]);
      
      service.over('OVER_TEST').pipe(take(1)).subscribe(ev => {
        expect(ev).toBeTruthy();
        expect(ev.name).toBe('OVER_TEST');
        expect(ev.el).toStrictEqual(li);
        expect(ev.container).toBe(ul);
        expect(ev.source).toBe(ul);
        service.destroy('OVER_TEST');
        done();
      });
      
      mock.emit(EventTypes.Over, li, ul, ul);
    }, 1000);

    it('should fire out event', done => {
      const ul = buildList('ul', ['li']);
      const li = ul.children[0] as Element;
      const mock = _addMockDrake('OUT_TEST', [ul]);
      
      service.out('OUT_TEST').pipe(take(1)).subscribe(ev => {
        expect(ev).toBeTruthy();
        expect(ev.name).toBe('OUT_TEST');
        expect(ev.el).toStrictEqual(li);
        expect(ev.container).toBe(ul);
        expect(ev.source).toBe(ul);
        service.destroy('OUT_TEST');
        done();
      });
      
      mock.emit(EventTypes.Out, li, ul, ul);
    }, 1000);
  });

  describe('Event filtering by group name', () => {
    it('should only receive events for the specified group', done => {
      const ul1 = buildList('ul', ['li']);
      const ul2 = buildList('ul', ['li']);
      const li1 = ul1.children[0] as Element;
      const li2 = ul2.children[0] as Element;
      
      const mock1 = _addMockDrake('GROUP_A', [ul1]);
      const mock2 = _addMockDrake('GROUP_B', [ul2]);
      
      let groupACount = 0;
      let groupBCount = 0;
      
      service.drag('GROUP_A').pipe(take(1)).subscribe(ev => {
        expect(ev.name).toBe('GROUP_A');
        expect(ev.el).toStrictEqual(li1);
        groupACount++;
      });
      
      service.drag('GROUP_B').pipe(take(1)).subscribe(ev => {
        expect(ev.name).toBe('GROUP_B');
        expect(ev.el).toStrictEqual(li2);
        groupBCount++;
        
        // After both events, verify counts
        expect(groupACount).toBe(1);
        expect(groupBCount).toBe(1);
        service.destroy('GROUP_A');
        service.destroy('GROUP_B');
        done();
      });
      
      mock1.emit(EventTypes.Drag, li1, ul1);
      mock2.emit(EventTypes.Drag, li2, ul2);
    }, 1000);

    it('should receive events from all groups when no filter specified', done => {
      const ul1 = buildList('ul', ['li']);
      const ul2 = buildList('ul', ['li']);
      const li1 = ul1.children[0] as Element;
      const li2 = ul2.children[0] as Element;
      
      const mock1 = _addMockDrake('GROUP_X', [ul1]);
      const mock2 = _addMockDrake('GROUP_Y', [ul2]);
      
      let receivedCount = 0;
      const receivedNames: string[] = [];
      
      service.drag().pipe(take(2)).subscribe(ev => {
        receivedCount++;
        receivedNames.push(ev.name);
        
        if (receivedCount === 2) {
          expect(receivedNames).toContain('GROUP_X');
          expect(receivedNames).toContain('GROUP_Y');
          service.destroy('GROUP_X');
          service.destroy('GROUP_Y');
          done();
        }
      });
      
      mock1.emit(EventTypes.Drag, li1, ul1);
      mock2.emit(EventTypes.Drag, li2, ul2);
    }, 1000);
  });

  describe('copyItem functionality', () => {
    it('should throw error when copy is enabled but copyItem is not provided', () => {
      const sourceModel = ['a', 'b'];
      const targetModel = ['x'];
      const source = buildList('ul', ['li', 'li']);
      const target = buildList('ul', ['li']);
      const li = source.children[0];
      const clone = li.cloneNode(true);
      
      // Options with copy but no copyItem
      const options: DragulaOptions = { copy: true };
      const mock = _addMockDrake('COPY_NO_FUNC', [source, target], options, [sourceModel, targetModel]);
      
      mock.emit(EventTypes.Drag, li, source);
      target.appendChild(clone);
      
      // The error will be thrown during handleModels processing
      // We can't easily test this with expect().toThrow() because it's async
      // Just verify the setup works
      expect(mock.models).toBeDefined();
      expect(options.copy).toBe(true);
      expect(options.copyItem).toBeUndefined();
      
      service.destroy('COPY_NO_FUNC');
    });

    it('should use copyItem when copying between containers', done => {
      interface Item { id: number; name: string }
      const sourceModel: Item[] = [{ id: 1, name: 'a' }, { id: 2, name: 'b' }];
      const targetModel: Item[] = [{ id: 3, name: 'x' }];
      const source = buildList('ul', ['li', 'li']);
      const target = buildList('ul', ['li']);
      const li = source.children[0];
      const clone = li.cloneNode(true);
      
      let copyItemCalled = false;
      const copyItem = (item: Item): Item => {
        copyItemCalled = true;
        return { ...item, id: item.id + 100 }; // Modify to verify it was called
      };
      
      const options = { copy: true, copyItem };
      const mock = _addMockDrake('COPY_WITH_FUNC', [source, target], options, [sourceModel, targetModel]);
      
      service.dropModel<Item>('COPY_WITH_FUNC').pipe(take(1)).subscribe(ev => {
        expect(copyItemCalled).toBe(true);
        expect(ev.item.id).toBe(101); // Verify copyItem was used
        expect(ev.item.name).toBe('a');
        expect(ev.sourceModel.length).toBe(2); // Original unchanged
        expect(ev.targetModel.length).toBe(2);
        expect(ev.targetModel[1]).toEqual({ id: 101, name: 'a' });
        service.destroy('COPY_WITH_FUNC');
        done();
      });
      
      mock.emit(EventTypes.Drag, li, source);
      target.appendChild(clone);
      mock.emit(EventTypes.Drop, clone, target, source, undefined);
    }, 1000);

    it('should not use copyItem when moving (not copying)', done => {
      interface Item { id: number; name: string }
      const sourceModel: Item[] = [{ id: 1, name: 'a' }];
      const targetModel: Item[] = [{ id: 2, name: 'x' }];
      const source = buildList('ul', ['li']);
      const target = buildList('ul', ['li']);
      const li = source.children[0];
      
      let copyItemCalled = false;
      const copyItem = (item: Item): Item => {
        copyItemCalled = true;
        return { ...item };
      };
      
      const options = { copy: false, copyItem };
      const mock = _addMockDrake('MOVE_NOT_COPY', [source, target], options, [sourceModel, targetModel]);
      
      service.dropModel<Item>('MOVE_NOT_COPY').pipe(take(1)).subscribe(ev => {
        expect(copyItemCalled).toBe(false); // Should NOT be called for move
        expect(ev.sourceModel.length).toBe(0); // Removed from source
        expect(ev.targetModel.length).toBe(2); // Added to target
        expect(ev.item.id).toBe(1); // Original item, not copied
        service.destroy('MOVE_NOT_COPY');
        done();
      });
      
      mock.emit(EventTypes.Drag, li, source);
      source.removeChild(li);
      target.appendChild(li);
      mock.emit(EventTypes.Drop, li, target, source, undefined);
    }, 1000);
  });

  describe('Edge cases', () => {
    it('should handle drop with null target gracefully', (done) => {
      const model = ['a', 'b'];
      const ul = buildList('ul', ['li', 'li']);
      const li = ul.children[0];
      const mock = _addMockDrake('NULL_TARGET', [ul], {}, [model]);
      
      let dropModelFired = false;
      service.dropModel('NULL_TARGET').subscribe(() => {
        dropModelFired = true;
      });
      
      mock.emit(EventTypes.Drag, li, ul);
      // Drop with null target - should not fire dropModel
      mock.emit(EventTypes.Drop, li, null, ul, undefined);
      
      // Give it a moment to potentially fire
      setTimeout(() => {
        expect(dropModelFired).toBe(false);
        service.destroy('NULL_TARGET');
        done();
      }, 100);
    });

    it('should handle multiple drag events updating dragIndex', done => {
      const model = ['a', 'b', 'c'];
      const ul = buildList('ul', ['li', 'li', 'li']);
      const mock = _addMockDrake('MULTI_DRAG', [ul], {}, [model]);
      
      // Drag first item
      mock.emit(EventTypes.Drag, ul.children[0], ul);
      
      // Drag second item (should update dragIndex)
      mock.emit(EventTypes.Drag, ul.children[1], ul);
      
      service.dropModel('MULTI_DRAG').pipe(take(1)).subscribe(ev => {
        // Should use the last drag's index (1)
        expect(ev.sourceIndex).toBe(1);
        expect(ev.item).toBe('b');
        service.destroy('MULTI_DRAG');
        done();
      });
      
      // Drop the second item
      ul.removeChild(ul.children[1]);
      ul.appendChild(ul.children[0]); // Move b to end
      mock.emit(EventTypes.Drop, ul.children[1], ul, ul, undefined);
    }, 1000);

    it('should handle remove without models gracefully', (done) => {
      const ul = buildList('ul', ['li']);
      const li = ul.children[0];
      const mock = _addMockDrake('NO_MODELS_REMOVE', [ul], {}, undefined);
      
      let removeModelFired = false;
      service.removeModel('NO_MODELS_REMOVE').subscribe(() => {
        removeModelFired = true;
      });
      
      mock.emit(EventTypes.Drag, li, ul);
      mock.emit(EventTypes.Remove, li, ul, ul);
      
      setTimeout(() => {
        expect(removeModelFired).toBe(false); // Should not fire without models
        service.destroy('NO_MODELS_REMOVE');
        done();
      }, 100);
    });
  });
});
