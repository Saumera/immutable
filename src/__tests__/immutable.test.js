import immutable from '../immutable';

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

describe('immutable', () => {
  it('should contain all object methods when given an object', () => {
    const methods = immutable(objectData);
    expect(!!methods.getIn).toBe(true);
    expect(!!methods.set).toBe(true);
    expect(!!methods.setIn).toBe(true);
    expect(!!methods.remove).toBe(true);
    expect(!!methods.removeIn).toBe(true);
    expect(!!methods.merge).toBe(true);
    expect(!!methods.mergeDeep).toBe(true);
    expect(!!methods.map).toBe(true);
    expect(!!methods.filter).toBe(true);
    expect(!!methods.toArray).toBe(true);
    expect(!!methods.pick).toBe(true);
    expect(!!methods.omit).toBe(true);
  });

  it('should return data when an object method is used', () => {
    const month = immutable(objectData).getIn(['1', 'birthdate', 'month']);
    expect(month).toBe(objectData[1].birthdate.month);

    const names = immutable(objectData).map(employee => {
      return immutable(employee).pick(['firstName', 'lastName']);
    });
    expect(names).toStrictEqual({
      1: { firstName: 'Nick', lastName: 'Coronado' },
      2: { firstName: 'Joe', lastName: 'Shmoe' },
      3: { firstName: 'Jane', lastName: 'Doe' },
    });
  });

  it('should contain all array methods when given an array', () => {
    const methods = immutable(arrayData);
    expect(!!methods.toObject).toBe(true);
    expect(!!methods.groupBy).toBe(true);
  });

  it('should return data when an array method is used', () => {
    const data = immutable(arrayData).toObject('id', 'name');
    const expected = arrayData.reduce(
      (o, employee) => ({
        ...o,
        [employee.id]: employee.name,
      }),
      {}
    );
    expect(data).toStrictEqual(expected);
  });
});
