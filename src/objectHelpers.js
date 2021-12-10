/*
 * This file contains helper functions for cloning and changing javascript
 * objects immutably.
 *
 * From this file, you can import the methods you need directly, say if you want
 * to set a value on an object and clone that into a new object, you could do
 * import { setVal } from "./immutable";
 *
 * const newObj = setVal(oldObj, "key", "value");
 */

// A helper method for determining if a value is either an Object or an Array
const isObjectLike = val => val && typeof val === 'object';

// An optimized helper method for turning an array of [key, val] pairs into an
// object.
export const createObject = keyValPairs => {
  const results = {};
  for (let i = 0; i < keyValPairs.length; i++) {
    const [key, val] = keyValPairs[i];
    results[key] = val;
  }
  return results;
};

/* getValIn
 * This method takes a list of keys, and will retrieve a value that is deeply
 * nested in an object by traversing using each key in the list.
 */
export const getValIn = (source, keyList) => {
  const [key, ...remaining] = keyList;

  return remaining.length
    ? getValIn((source || {})[key], remaining)
    : (source || {})[key];
};

export const setVal = (source, key, value) => ({ ...(source || {}), [key]: value });

/* setValIn
 * This method works similarly to getValIn wherein it traverses through an
 * object using a list of keys, but will return a new object with an updated
 * value at the location specified by the keyList
 */
export const setValIn = (source, keyList, value) => {
  const [key, ...remaining] = keyList;

  if (!remaining.length) {
    return setVal(source, key, value);
  }

  return {
    ...source,
    [key]: setValIn(source[key] || {}, remaining, value),
  };
};

export const removeVal = (source, key) => {
  const pairs = Object.entries(source).filter(([k]) => k !== String(key));
  return createObject(pairs);
};

/* removeValIn
 * Works like getValIn, but instead of returning the value it finds,
 * it will return a new object with that property removed
 */
export const removeValIn = (source, keyList) => {
  const [key, ...remaining] = keyList;

  if (!source[key]) return source;
  if (!remaining.length) return removeVal(source, key);

  const rest = removeVal(source, key);
  return {
    ...rest,
    [key]: removeValIn(source[key] || {}, remaining),
  };
};

/* merge
 * This method will perform a shallow merge on two objects and return the
 * resulting merged data.
 */
export const merge = (source, data) => ({ ...(source || {}), ...data });

/* mergeDeep
 * Similar to merge, except that it will recursively traverse through both
 * objects and merge them deeply, making sure to preserve values in the source
 * object that have not been altered.
 */
export const mergeDeep = (source, data) => {
  return Object.entries(data).reduce((obj, [key, val]) => {
    const newData = isObjectLike(val) ? mergeDeep(obj[key] || {}, val) : val;
    return setVal(obj, key, newData);
  }, source);
};

/*
 * map
 * This method will perform a given operation on each key value pair in the object and
 * return a new copy of the object after the transformation is made to each value.
 *
 * The callback function takes in its arguments in the following order:
 * value, key, index, entireObject
 *
 * e.g.
 * const employees = {
 *   1: { firstName: "Nick", lastName: "Coronado" },
 *   2: { firstName: "Steven", lastName: "Milov" },
 * }
 * const data = immutable(employees).map(val => {
 *   return immutable(val).set("displayName", `${val.firstName} ${val.lastName}`);
 * })
 */
export const map = (source, cb) => {
  const results = {};
  Object.keys(source).forEach((key, i) => {
    results[key] = cb(source[key], key, i, source);
  });
  return results;
};

/*
 * filter
 * This method will perform a check on each key value pair in the object, and if
 * the pair does not pass the given predicate check, it will be removed from
 * the object.
 *
 * e.g.
 * const employees = {
 *   1: { name: "Nick", isAdmin: true },
 *   2: { name: "Steven", isAdmin: false }
 * }
 *
 * const admin = immutable(employees).filter(val => val.isAdmin);
 */
export const filter = (source, cb) => {
  const result = {};
  Object.keys(source).forEach((key, i) => {
    if (cb(source[key], key, i, source)) {
      result[key] = source[key];
    }
  });
  return result;
};

/*
 * toArray
 * This method will convert the source object to an array.
 *
 * It accepts an accessor (optional) that can be:
 * - a callback function that takes the value, the key, and the index
 *   of an individual object element, along with the whole object (in that order) and
 *   returns the corresponding array element for the given object element.
 * - or a string representing a field in the object element.
 *
 * e.g.
 * const employees = {
 *   1: { name: "Steven", isAdmin: false }
 *   2: { name: "Nick", isAdmin: true },
 * }
 *
 * const employeeList = immutable(employees).toArray()
 * // [ { name: "Steven", isAdmin: false }, { name: "Nick", isAdmin: true } ];
 *
 * const employeeNames = immutable(employees).toArray("name");
 * // [ "Steven", "Nick" ]
 *
 * const employeesWithIds = immutable(employees).toArray((val, key) => ({ ...val, id: key }))
 * // [ { name: "Steven", isAdmin: false, id: 1 }, { name: "Nick", isAdmin: true, id: 2 } ];
 */
const DEFAULT_ARRAY_ELEM = val => val;
export const toArray = (source, accessor = DEFAULT_ARRAY_ELEM) => {
  const getVal = typeof accessor === 'function' ? accessor : val => val[accessor];
  return Object.keys(source).map((key, i) => getVal(source[key], key, i, source));
};

/*
 * pick
 * This method will take an object and return a smaller object with a subset of its keys.
 *
 * It accepts an array of fields to include.
 *
 * e.g.
 * const largeObject = {
 *   firstName: "Nick",
 *   lastName: "Coronado",
 *   id: 1,
 *   birthdate: "Wouldn't you like to know",
 *   sign: "Capricorn",
 *   isAdmin: true,
 *   isGoodAtJob: undefined,
 *   hr_id: "NICK",
 *   nickname: "nicknado",
 * }
 *
 * const employee = immutable(largeObject).pick(["firstName", "lastName"]);
 * // { firstName: "Nick", lastName: "Coronado" }
 */
export const pick = (source, fields) => {
  const results = {};
  for (let i = 0; i < fields.length; i++) {
    if (source.hasOwnProperty(fields[i])) {
      results[fields[i]] = source[fields[i]];
    }
  }
  return results;
};

/*
 * omit
 * This method will take an object and return a smaller object with a selected set of keys
 * removed.
 *
 * It accepts an array of fields to remove.
 *
 * e.g.
 * const largeObject = {
 *   firstName: "Nick",
 *   lastName: "Coronado",
 *   id: 1,
 *   birthdate: "Wouldn't you like to know",
 *   sign: "Capricorn",
 *   isAdmin: true,
 *   isGoodAtJob: undefined,
 *   hr_id: "NICK",
 *   nickname: "nicknado",
 * }
 *
 * const employee = immutable(largeObject).omit(["birthdate", "sign", "isGoodAtJob"]);
 * // { firstName: "Nick", lastName: "Coronado", id: 1, isAdmin: true, hr_id: "NICK", nickname: "nicknado" }
 */
export const omit = (source, fields) => {
  const fieldSet = new Set(Array.isArray(fields) ? fields : [fields]);
  return filter(source, (_val, key) => !fieldSet.has(key));
};
