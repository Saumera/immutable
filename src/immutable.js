/*
 * This file bundles all of the javascript helper objects into a single function
 * that accepts the source data and exposes each function under its namespace.
 *
 * It can be used like so:
 * import immutable from "./immutable";
 *
 * const oldObj = { "key": "val" }
 * const newObj = immutable(oldObj).set("key2", "val2");
 */
import {
  createObject,
  getValIn,
  setVal,
  setValIn,
  removeVal,
  removeValIn,
  merge,
  mergeDeep,
  map,
  filter,
  toArray,
  pick,
  omit,
} from './objectHelpers';
import { toObject, groupBy } from './arrayHelpers';

const arrayMethods = {
  toObject,
  groupBy,
};
const objectMethods = {
  getIn: getValIn,
  set: setVal,
  setIn: setValIn,
  remove: removeVal,
  removeIn: removeValIn,
  merge,
  mergeDeep,
  map,
  filter,
  toArray,
  pick,
  omit,
};

const bindMethods = (source, methods) =>
  createObject(
    Object.entries(methods).map(([name, func]) => [name, func.bind(null, source)])
  );

const immutable = source => {
  const methods = Array.isArray(source) ? arrayMethods : objectMethods;
  return bindMethods(source, methods);
};

export default immutable;
