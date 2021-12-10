# Immutable #

A library of some javascript object helper functions.

## Purpose ##

There are two main reasons to use this library.

The first reason is to fully realize the potential of keeping your data immutable. Immutable data is data that, once created, does not change.
This leads to much simpler logic to reason through, and makes it much easier to memoize, detect changes, and test your data.
This library has no specific implementation details tying it to a framework so it can be used anywhere, but it pairs particularly well with the
functional and immutable design principles of both React and Redux, especially inside of reducers, whose sole purposes are to take in data, manipulate it, and return a new copy.

The second reason is that once you have decided to keep your data immutable, you may find that working with JavaScript data types, specifically Objects, to be
challenging and inconvenient, as much of the Object API's methods are mutable by nature. This library makes it much simpler to manipulate data and get a new copy.

This library is loosely (ok a little more than loosely) based on [ImmutableJS](https://immutable-js.github.io/immutable-js/docs/#/) but with one big key difference: it operates on and returns raw data.
ImmutableJS creates its own data types that extend the native JS object and array types with additional functionality that make it easier to manipulate them immutably.
Doing so has a couple advantages, namely that you can override native functionality like comparators and that you can chain commands together, since each subsequent call returns a new object with the same functionality,
but it however does mean that once converted, they can no longer be used as native javascript. It does provide
a `toJS` method, but this has significant performance costs.

So this library does not have its own data types, thus allowing you to immediately consume the data it returns.

## Getting started ##

Install `immutable` using npm

```bash
npm install @mavenmachines/immutable
```

Then require it in any module, and use it in its native form:
```javascript
import immutable from "@mavenmachines/immutable";

const data = { a: 1, b: 2, c: 3 };
const newData = immutable(data).set('b', 50);
```

Or use a more powerful version called `chainable` that can be used to chain multiple calls together. Simply call `.done()` at the end of the chain to return raw JS data.:
```javascript
import { chainable } from "@mavenmachines/immutable"

const data = { a: 1, b: 2, c: 3 };
const newData = chainable(data)
  .set('b', 50)
  .remove('a')
  .done();
```

It also contains one more helper function that can convert an array of data into a lookup object:
```javascript
import { makeLookup } from "@mavenmachines/immutable";

const things = [{
  id: "one",
  name: "Nick",
}, {
  id: "two",
  name: "Not Nick",
}];

const lookup = makeLookup(things, "id");
/*
{
  one: { id: "one", name: "Nick" },
  two: { id: "two", name: "Not Nick" }
}
*/
```

## Methods ##

The default `immutable` (and by extension `chainable`) interface will accept either an Array or an Object as its data source. Each of these
types have their own set of methods that they can use to manipulate their data.

### Object Methods ###

The following methods are available when `immutable` is given an Object.

#### getIn ####

Accepts an array of key values that it will use to deeply traverse a nested object and return the value
found at the final key. It will return undefined if the key list at any point is not found in the object.
```javascript
const data = { a: { b: { c: { d: 2 } } } };
const value = immutable(data).getIn(['a', 'b', 'c', 'd']);
// 2 
```

#### set ####

Accepts a key (string) and a value (any type). Will return a new object with the newly set value at the key.
```javascript
const data = { a: 1, b: 2, c: 3 }
const updated = immutable(data).set('d', 4);
// { a: 1, b: 2, c: 3, d: 4 }
```

#### setIn ####

Works similarly to `set` except that it accepts an array as its first argument representing a key path,
which it will use to deeply traverse an object and set the value at the final key in the list. If any of the nested keys
don't exist, it will create a new object at that position.
```javascript
const data = { a: { b: { c: { d: 1 }, } } }
const updated = immutable(data).setIn(['a', 'b', 'c', 'd'], 4);
// { a: { b: { c: { d: 4 } } } }
```

#### remove ####

Will return a copy of the object without the value found at the key it is given. If no value is found, 
no changes will be made and the copy of the object will have the same data.

```javascript
const data = { a: 1, b: 2, c: 3, d: 4 };
const updated = immutable(data).remove('d');
// { a: 1, b: 2, c: 3 }
```

#### removeIn ####

Works the same as `remove`, but accepts a list of keys it will use to traverse a deeply nested object. If
any of the keys are not found in any of the nested objects, no changes will be made and the copy of the
final object will have the same data.

```javascript
const data = { a: { b: { c: { d: 2, e: 4 } } } };
const updated = immutable(data).removeIn(['a', 'b', 'c', 'e']);
// { a: { b: { c: { d: 2 } } } }
```

#### merge ####

Will merge a given object into the source, overwriting any new values and leaving existing values not found in
the incoming object as is. This is a shallow operation, so if the old data has a nested object, the entire 
object will be overwritten if the new object has a value at that key. For a more advanced merging strategy, see
`mergeDeep`.

```javascript
const data = { a: 1, b: 2, c: 4 };
const newData = { c: 3, d: 4 };
const updated = immutable(data).merge(newData);
// { a: 1, b: 2, c: 3, d: 4 }
```

#### mergeDeep ####

Will merge two objects together, but will recursively merge nested objects and preserve existing values that
are not overwritten.

```javascript
const data = {
  a: {
    b: 4,
    d: 3,
    e: { f: 5 }
  },
  c: 6,
}
const newData = {
  a: {
    b: 6,
    e: { g: 12 }
  },
  j: 8,
}
const updated = immutable(data).mergeDeep(newData);
/*
{
  a: {
    b: 6,
    d: 3,
    e: { f: 5, g: 12 }
  },
  c: 6,
  j: 8
}
*/
```

#### map ####

Will perform a given operation on each value in the object and will return a new copy of the object after the transformation is made to each value.

The callback function takes in its arguments in the following order:
value, key, index, entireObject

```javascript
const employees = {
  1: { firstName: "Nick", lastName: "Coronado" },
  2: { firstName: "Joe", lastName: "Shmoe" }
}

// by value
const data = immutable(employees).map(employee => {
  return immutable(employee).set("displayName", `${employee.firstName} ${employee.lastName}`);
})
/*
{
  1: { firstName: "Nick", lastName: "Coronado", displayName: "Nick Coronado" },
  2: { firstName: "Joe", lastName: "Shmoe", displayName: "Joe Shmoe" },
}
*/

// or by key/index
const data = immutable(employees).map((emp, id, index) => ({ ...emp, id, index }));
/*
{
  1: { firstName: "Nick", lastName: "Coronado", id: 1, index: 0 },
  2: { firstName: "Joe", lastName: "Shmoe", id: 2, index: 1 },
}
*/
```

#### filter ####

Will perform a check on each value in the object, and run each against a given predicate function. If the value does not pass the predicate, it will be removed from the resulting object.

The callback function takes in its arguments in the following order:
value, key, index, entireObject

```javascript
const employees = {
  1: { name: "Nick Coroando", isAdmin: true },
  2: { name: "Joe Shmoe", isAdmin: false },
  3: { name: "Jane Doe", isAdmin: false },
}

// by value
const data = immutable(employees).filter(employee => employee.isAdmin);
// { 1: { name: "Nick Coronado", isAdmin: true } }

// or by key/index
const data = immutable(employees).filter((emp, id, index) => id > 2 && index % 2);
// { 3: { name: "Jane Doe", isAdmin: false } }
```

#### toArray ####

Will convert the source object to an array.

It accepts an accessor (optional) that can be:

* a callback function that takes the value, key, index, entireObject arguments for each value in the object, and returns a corresponding array element.
* a string representing a field found in the object element.

```javascript
const employees = {
  1: { name: "Jane Doe", isAdmin: false },
  2: { name: "Nick Coronado", isAdmin: true }
}

const employeesList = immutable(employees).toArray();
// [ { name: "Jane Doe", isAdmin: false }, { name: "Nick Coronado", isAdmin: true } ]

const employeeNames = immutable(employees).toArray("name");
// [ "Jane Doe", "Nick Coronado" ]

const employeesWithIds = immutable(employees).toArray((employee, id) => {
  return immutable(employee).set("id", id);
})
/*
[
  { name: "Jane Doe", isAdmin: false, id: 1 },
  { name: "Nick Coronado", isAdmin: true, id: 2 }
]
*/
```

#### pick ####

Will take an object and return a smaller object with a given subset of its keys.

```javascript
const largeObject = {
  firstName: "Nick",
  lastName: "Coronado",
  id: 1,
  birthdate: "Wouldn't you like to know",
  sign: "Capricorn",
  isAdmin: true,
  isGoodAtJob: undefined,
  hr_id: "NICK",
  nickname: "nicknado",
}

const employee = immutable(largeObject).pick(["firstName", "lastName"]);
// { firstName: "Nick", lastName: "Coronado" }
```

#### omit ####

Will take an object and return a smaller object with a given set of keys removed.

```javascript
const largeObject = {
  firstName: "Nick",
  lastName: "Coronado",
  id: 1,
  birthdate: "Wouldn't you like to know",
  sign: "Capricorn",
  isAdmin: true,
  isGoodAtJob: undefined,
  hr_id: "NICK",
  nickname: "nicknado",
}

const employee = immutable(largeObject).omit(["birthdate", "sign", "isGoodAtJob", "nickname"]);
// { firstName: "Nick", lastName: "Coronado", id: 1, isAdmin: true, hr_id: "NICK" }
```

### Array Methods ###

The following methods are available when `immutable` is given an Array.

#### toObject ####

Will convert an Array into an Object. It accepts two arguments:

* The first is an accessor for the key. This can be either a string, which will be used as a key on each item in the array to retrieve the desired key for that entry in the Object, or it can be a function that receives an item in the array and returns the desired key.
* The second is an accessor for the value. This argument is optional, and by default the value for a given entry in the Object will be the array item itself. Similar to the key accessor, this can be either a string representing a key, or a function which takes in an item and returns the desired value.

** Example 1: A byId lookup object.**
```javascript
const data = [{
  id: "one",
  name: "Nick",
}, {
  id: "two",
  name: "Not Nick",
}];
const lookup = immutable(data).toObject("id");
/*
{
  one: { id: "one", name: "Nick" },
  two: { id : "two", name: "Not Nick" }
}
*/
```

** Example 2: A nameById lookup object.**
```javascript
const data = [{
  id: "one",
  name: "Nick",
}, {
  id: "two",
  name: "Not Nick",
}];
const lookup = immutable(data).toObject("id", "name");
/*
{
  one: "Nick",
  two: "Not Nick"
}
*/
```

** Example 3: An existence lookup object.**
```javascript
const data = [ 'a', 'b', 'c', 'd' ];
const getKey = item => item;
congs getVal = item => true
const lookup = immutable(data).toObject(getKey, getVal);
/*
{
  a: true,
  b: true,
  c: true,
  d: true
}
*/
const hasD = lookup['d'];
// true
```

** Example 4: A nested lookup.**
```javascript
const data = [{
  id: "one",
  a: { b: { c: { name: "Nick" } }
}, {
  id: "two",
  a: { b: { c: { name: "Not Nick" } }
}];
const getVal = item => immutable(item).getIn(['a', 'b', 'c', 'name']);
const lookup = immutable(data).toObject('id', getVal);
/*
{
  one: "Nick",
  two: "Not Nick"
}
*/
```

#### groupBy ####

Will convert an Array into an Object of Arrays where each value in the array belongs to a group. It accepts two arguments:

* The first is an accessor for the group name. This can be either a string, which will be used as a key on each item in the array to retrieve the group name in the Object, or it can be a function that accepts an item from the array and calculates the groupName.
* The second is an accessor for the value. This argument is optional, and by default the value for a given entry will be the array item itself. Similar to the key accessor, this can be either a string representing a key, or a function which takes in an item and returns the desired value.

Consider the following example data:
```javascript
const exampleData = [
  {
    id: 1,
    name: 'Joe Shmoe',
    employeeData: { groupId: 33, alias: 'Butterfingers' },
    status: 'active',
  },
  {
    id: 2,
    name: 'Jane Doe',
    employeeData: { groupId: 40, alias: 'The Governess' },
    status: 'active',
  },
  {
    id: 3,
    name: 'Fred Marks',
    employeeData: { groupId: 33, alias: 'Sir Criesalot' },
    status: 'active',
  },
  {
    id: 4,
    name: 'Nick Coronado',
    employeeData: { groupId: 33, alias: 'Tornado' },
    status: 'active',
  },
  {
    id: 5,
    name: 'Firstname Lastname',
    employeeData: { groupId: 33, alias: 'The Nameless' },
    status: 'inactive',
  },
];
```

Using `groupBy`, we can create groups in a number of different ways.

** Example 1: group by status **

```javascript
const employeesByStatus = immutable(exampleData).groupBy("status")
/*
{
  active: [
    {
      id: 1,
      name: 'Joe Shmoe',
      employeeData: { groupId: 33, alias: 'Butterfingers' },
      status: 'active',
    }, {
      id: 2,
      name: 'Jane Doe',
      employeeData: { groupId: 40, alias: 'The Governess' },
      status: 'active',
    }, {
      id: 3,
      name: 'Fred Marks',
      employeeData: { groupId: 33, alias: 'Sir Criesalot' },
      status: 'active',
    }, {
      id: 4,
      name: 'Nick Coronado',
      employeeData: { groupId: 33, alias: 'Tornado' },
      status: 'active',
    }
  ],
  inactive: [
    {
      id: 5,
      name: 'Firstname Lastname',
      employeeData: { groupId: 33, alias: 'The Nameless' },
      status: 'inactive',
    }
  ]
}
*/
```

This creates two groups, `active` and `inactive` containing the list of employees that match each status.

** Example 2: group by groupId **

```javascript
const employeesByGroup = immutable(exampleData).groupBy(employee => employee.employeeData.groupId);
/*
{
  33: [
    {
      id: 1,
      name: 'Joe Shmoe',
      employeeData: { groupId: 33, alias: 'Butterfingers' },
      status: 'active',
    }, {
      id: 3,
      name: 'Fred Marks',
      employeeData: { groupId: 33, alias: 'Sir Criesalot' },
      status: 'active',
    }, {
      id: 4,
      name: 'Nick Coronado',
      employeeData: { groupId: 33, alias: 'Tornado' },
      status: 'active',
    }, {
      id: 5,
      name: 'Firstname Lastname',
      employeeData: { groupId: 33, alias: 'The Nameless' },
      status: 'inactive',
    }
  ],
  40: [
    {
      id: 2,
      name: 'Jane Doe',
      employeeData: { groupId: 40, alias: 'The Governess' },
      status: 'active',
    }
  ]
}
*/
```

This creates a group for each `groupId`, each group containing the list of employees in that group.

** Example 3: group employeeIds by status **

```javascript
const idsByStatus = immutable(exampleData).groupBy("status", "id");
/*
{
  active: [1, 2, 3, 4],
  inactive: [5]
}
*/
```

This creates two groups, `active` and `inactive`, and for each member of the list, it looks up the id of the employee.

** Example 4: group aliases by groupId **

```javascript
const aliasesByStatus = immutable(exmapleData).groupBy(
  employee => employee.employeeData.groupId, // the group name (i.e. key)
  employee => employee.employeeData.alias // the value to go in the list
)
/*
{
  33: [
    'Butterfingers',
    'Sir Criesalot',
    'Tornado',
    'The Nameless'
  ],
  40: ['The Governess']
}
*/
```
