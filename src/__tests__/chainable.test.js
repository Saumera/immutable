import chainable from '../chainable';

const objectData = {
  1: {
    firstName: 'Nick',
    lastName: 'Coronado',
    birthdate: {
      month: 1,
      day: 19,
      year: 1990,
    },
    isAdmin: true,
    hr_id: 'NICK',
  },
  2: {
    firstName: 'Joe',
    lastName: 'Shmoe',
    birthdate: {
      month: 4,
      day: 20,
      year: 1969,
    },
    isAdmin: false,
    hr_id: 'JSHMO',
  },
  3: {
    firstName: 'Jane',
    lastName: 'Doe',
    birthdate: {
      month: 12,
      day: 25,
      year: 1908,
    },
    isAdmin: true,
    hr_id: 'WHO',
  },
};

const arrayData = [
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

describe('chainable', () => {
  it('should return the same data when .done() is called', () => {
    const objectMethods = chainable(objectData);
    expect(!!objectMethods.done).toBe(true);
    expect(objectMethods.done()).toStrictEqual(objectData);

    const arrayMethods = chainable(arrayData);
    expect(!!arrayMethods.done).toBe(true);
    expect(arrayMethods.done()).toStrictEqual(arrayData);
  });

  it('should return another instance of chainable after a method is called', () => {
    const results = chainable(objectData).setIn(['1', 'isAdmin'], false);
    expect(!!results.done).toBe(true);
    expect(!!results.setIn).toBe(true);
  });

  it('should return an instance of chainable with array methods after converted to array', () => {
    const results = chainable(objectData).toArray();
    expect(!!results.done).toBe(true);
    expect(!!results.toObject).toBe(true);
    expect(!!results.groupBy).toBe(true);
    expect(!!results.setIn).toBe(false);
  });

  it('should return an instance of chainable with obj methods after converted to obj', () => {
    const results = chainable(arrayData).toObject('id');
    expect(!!results.done).toBe(true);
    expect(!!results.setIn).toBe(true);
    expect(!!results.toObject).toBe(false);
  });

  it('should return data after multiple methods and .done for object data', () => {
    const results = chainable(objectData)
      .map((employee, id) => ({ ...employee, id }))
      .toArray()
      .toObject('hr_id')
      .filter(employee => employee.isAdmin)
      .done();

    const expected = Object.entries(objectData)
      .filter(([id, employee]) => employee.isAdmin)
      .map(([id, employee]) => ({ ...employee, id }))
      .reduce(
        (o, employee) => ({
          ...o,
          [employee.hr_id]: employee,
        }),
        {}
      );
    expect(results).toStrictEqual(expected);
  });
});
