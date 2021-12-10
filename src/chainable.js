/*
 * This will allow you to chain together multiple calls. Each call will return a
 * new instance of chainable.  When all methods have been called and the data
 * is the correct state, simply call .done() to get the final data.
 *
 * e.g.
 * const newData = chainable(data)
 *   .remove('someKey')
 *   .set('key', 9834895)
 *   .merge({ someOtherKey: "someString" })
 *   .done()
 */

import immutable from './immutable';
import { createObject } from './objectHelpers';

const chainable = source => {
  const fns = createObject(
    Object.entries(immutable(source)).map(([key, fn]) => [
      key,
      (...args) => chainable(fn(...args)),
    ])
  );
  const done = () => source;

  return { ...fns, done };
};

export default chainable;
