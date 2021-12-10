const DEFAULT_GET_VAL = item => item;

/* toObject
 *
 * This is a helper function that will take a list of objects and turn it into
 * an object keyed on a key string passed to it. Very helpful for quickly
 * finding something in an array.
 *
 * e.g.
 * const things = [{
 *   id: "one",
 *   name: "Nick"
 * }, {
 *   id: "two",
 *   name: "Not Nick"
 * }, ...];
 *
 * const lookup = toObject(things, "id");
 * lookup.one.name === "Nick"
 *
 * It also allows you to specify a key to retrieve for the value as well:
 *
 * const lookup = toObject(things, "id", "name");
 * lookup.one === "Nick"
 *
 * In specific cases, the desired key or value for the lookup may not be that
 * simple to retrieve.  In that case, the function can also accept a function that
 * takes in the current item and returns the desired value:
 *
 * const things = [{
 *   employee: { id: "nicknado", name: "Nick Coronado" },
 *   roles: { canView: true, canEdit: false },
 * }, {
 *   employee: { id: "someguy", name: "Some Guy" },
 *   roles: { canView: false, canEdit: false },
 * }];
 *
 * const getId = item => item.employee.id;
 * const getCanView = item => item.roles.canView;
 *
 * const employeeCanView = toObject(things, getId, getCanView);
 * employeeCanView["nicknado"] === true
 */

export const toObject = (data, keyAccessor, valAccessor = DEFAULT_GET_VAL) => {
  const getKey =
    typeof keyAccessor === 'function' ? keyAccessor : item => (item || {})[keyAccessor];
  const getVal =
    typeof valAccessor === 'function' ? valAccessor : item => (item || {})[valAccessor];
  const results = {};
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    results[getKey(item)] = getVal(item);
  }
  return results;
};

/* groupBy
 *
 * This is a helper function that will take a list of objects and turn it into an
 * object keyed on the keyAccessor, which is either a string representing a property
 * on the object, or a function that takes the object and returns the key value. For every
 * object in the list, it is added to an array stored at its key value in the resulting
 * object. An optional third argument allows you to specify the accessor for the value to
 * be added to each group for that item in the list.  If left null, the default is the item itself.
 *
 * eg.
 * const things = [{
 *   group: 1,
 *   name: "Nick"
 * }, {
 *   group: 2,
 *   name: "Steven",
 * }, {
 *   group: 1,
 *   name: "Michael"
 * }, {
 *   group: 3,
 *   name: "Mary"
 * }];
 *
 * const groups = groupBy(things, "group", "name");
 * // will result in:
 * {
 *   1: ["Nick", "Michael"],
 *   2: ["Steven"],
 *   3: ["Mary"]
 * }
 *
 * For keys (or values) nested in the object, you can also provide a function to retrieve
 * it.
 *
 * const things = [{
 *   metadata: { teamId: "Fleet" },
 *   id: 1,
 *   name: "Kimani"
 * }, {
 *   metadata: { teamId: "Dispatch" },
 *   id: 6,
 *   name: "Steven"
 * }, {
 *   metadta: { teamId: "Fleet" },
 *   id: 14,
 *   name: "Nick"
 * }];
 *
 * const groups = groupBy(things, item => item.metadata.teamId);
 * // will result in
 * {
 *   "Fleet": [ { name: "Kimani", ... }, { name: "Nick", ... } ],
 *   "Dispatch": [ { name: "Steven", ... } ]
 * }
 */

export const groupBy = (source, keyAccessor, valAccessor = DEFAULT_GET_VAL) => {
  const getKey =
    typeof keyAccessor === 'function' ? keyAccessor : item => item[keyAccessor];
  const getVal =
    typeof valAccessor === 'function' ? valAccessor : item => item[valAccessor];

  return source.reduce(
    (obj, item) => ({
      ...obj,
      [getKey(item)]: [...(obj[getKey(item)] || []), getVal(item)],
    }),
    {}
  );
};
