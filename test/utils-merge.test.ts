import { utilsMerge } from '../src/utils-merge';

describe('utilsMerge', () => {
  it('merges plain objects', () => {
    const a = { x: 1, y: { z: 2 } };
    const b = { y: { w: 3 }, k: 4 };
    const result = utilsMerge(a, b);
    expect(result).toEqual({ x: 1, y: { z: 2, w: 3 }, k: 4 });
  });

  it('merges class instances and preserves prototype', () => {
    class A {
      a = 1;
      obj = { foo: 'bar' };
      getA() { return this.a; }
    }
    class B {
      b = 2;
      obj = { baz: 'qux' };
      getB() { return this.b; }
    }
    const a = new A();
    const b = new B();
    const merged = utilsMerge(a, b);
    expect(merged.a).toBe(1);
    expect(merged.b).toBe(2);
    expect(merged.obj).toEqual({ foo: 'bar', baz: 'qux' });
    expect(typeof merged.getA).toBe('function');
    expect(typeof merged.getB).toBe('function');
    expect(Object.getPrototypeOf(merged)).toBe(Object.getPrototypeOf(a));
  });

  it('returns shallow merge for non-object', () => {
    expect(utilsMerge(1 as any, { a: 2 })).toEqual({ a: 2 });
    expect(utilsMerge({ a: 1 }, null as any)).toEqual({ a: 1 });
  });
});
