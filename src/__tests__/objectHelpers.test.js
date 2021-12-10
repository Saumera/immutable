import * as Immutable from '../objectHelpers';

const simpleTestData = {
  id: 1,
  firstName: 'Nick',
  lastName: 'Coronado',
  birthdate: {
    month: 1,
    day: 19,
    year: 1990,
  },
  isAdmin: true,
  hr_id: 'NICK',
};

const largerTestData = {
  1: Immutable.removeVal(simpleTestData, 'id'),
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

describe('Object methods', () => {
  describe('getValIn', () => {
    it('should return the value at the end of the given path', () => {
      const month = Immutable.getValIn(simpleTestData, ['birthdate', 'month']);
      expect(month).toBe(1);
    });

    it('should return undefined at an invalid key path', () => {
      const decade = Immutable.getValIn(simpleTestData, ['birthdate', 'decade']);
      expect(decade).toBe(undefined);

      const deepSearchVal = Immutable.getValIn(simpleTestData, [
        'some',
        'invalid',
        'keys',
      ]);
      expect(deepSearchVal).toBe(undefined);
    });
  });

  describe('setVal', () => {
    it('should return a new object with a new field', () => {
      const res = Immutable.setVal(simpleTestData, 'isGoodAtJob', true);
      const expected = { ...simpleTestData, isGoodAtJob: true };
      expect(res).toStrictEqual(expected);
    });

    it('should overwrite an existing field', () => {
      const res = Immutable.setVal(simpleTestData, 'isAdmin', false);
      const expected = { ...simpleTestData, isAdmin: false };
      expect(res).toStrictEqual(expected);
    });
  });

  describe('setValIn', () => {
    it('should return a new object with a new field deeply assigned', () => {
      const res = Immutable.setValIn(simpleTestData, ['birthdate', 'decade'], 199);
      const expected = {
        ...simpleTestData,
        birthdate: { ...simpleTestData.birthdate, decade: 199 },
      };
      expect(res).toStrictEqual(expected);
    });

    it('should create objects when path does not exist', () => {
      const res = Immutable.setValIn(simpleTestData, ['some', 'deep', 'field'], true);
      const expected = { ...simpleTestData, some: { deep: { field: true } } };
      expect(res).toStrictEqual(expected);
    });

    it('should overwrite existing data at path end', () => {
      const res = Immutable.setValIn(simpleTestData, ['birthdate', 'month'], 2);
      const expected = {
        ...simpleTestData,
        birthdate: { ...simpleTestData.birthdate, month: 2 },
      };
      expect(res).toStrictEqual(expected);
    });
  });

  describe('removeVal', () => {
    it('should return a new object with the given key removed', () => {
      const res = Immutable.removeVal(simpleTestData, 'isAdmin');
      // eslint-disable-next-line no-unused-vars
      const { isAdmin, ...expected } = simpleTestData;
      expect(res).toStrictEqual(expected);
    });

    it('should leave the object alone if the key is not found', () => {
      const res = Immutable.removeVal(simpleTestData, 'someDumbKey');
      expect(res).toStrictEqual(simpleTestData);
    });
  });

  describe('removeValIn', () => {
    it('should return a new object with the value at the given key path removed', () => {
      const res = Immutable.removeValIn(simpleTestData, ['birthdate', 'day']);
      // eslint-disable-next-line no-unused-vars
      const { day, ...birthdate } = simpleTestData.birthdate;
      const expected = { ...simpleTestData, birthdate };
      expect(res).toStrictEqual(expected);
    });

    it('should leave the object alone if the key path is not found', () => {
      const res = Immutable.removeValIn(simpleTestData, ['some', 'deep', 'field']);
      expect(res).toStrictEqual(simpleTestData);
    });
  });

  describe('merge', () => {
    it('should merge source object with new data', () => {
      const newData = { isGoodAtJob: true, isRemote: false };
      const res = Immutable.merge(simpleTestData, newData);
      expect(res).toStrictEqual({ ...simpleTestData, ...newData });
    });

    it('should overwrite existing fields', () => {
      const newData = { isGoodAtJob: true, isAdmin: false };
      const res = Immutable.merge(simpleTestData, newData);
      expect(res).toStrictEqual({ ...simpleTestData, ...newData });
    });
  });

  describe('mergeDeep', () => {
    it('should deeply merge source object and new data', () => {
      const newData = { birthdate: { day: 2 }, isAdmin: false, isGoodAtJob: true };
      const res = Immutable.mergeDeep(simpleTestData, newData);
      const expected = {
        ...simpleTestData,
        isAdmin: false,
        isGoodAtJob: true,
        birthdate: { ...simpleTestData.birthdate, day: 2 },
      };
      expect(res).toStrictEqual(expected);
    });
  });

  describe('map', () => {
    it('should alter each item in the object by the map callback', () => {
      const addDisplayNameAndId = (val, key) => ({
        ...val,
        displayName: `${val.firstName} ${val.lastName}`,
        id: key,
      });
      const res = Immutable.map(largerTestData, addDisplayNameAndId);
      const expected = Object.entries(largerTestData).reduce(
        (o, [key, val]) => ({
          ...o,
          [key]: addDisplayNameAndId(val, key),
        }),
        {}
      );
      expect(res).toStrictEqual(expected);
    });
  });

  describe('filter', () => {
    it('should filter out each property of the object that does not pass the given predicate function', () => {
      const res = Immutable.filter(largerTestData, val => val.isAdmin);
      const expected = Immutable.removeVal(largerTestData, 2);
      expect(res).toStrictEqual(expected);
    });

    it('should filter by key', () => {
      const res = Immutable.filter(largerTestData, (val, key) => key % 2);
      const expected = Immutable.removeVal(largerTestData, 2);
      expect(res).toStrictEqual(expected);
    });

    it('should filter by index', () => {
      const res = Immutable.filter(largerTestData, (val, key, i) => i % 2);
      const expected = { 2: largerTestData[2] };
      expect(res).toStrictEqual(expected);
    });
  });

  describe('toArray', () => {
    it('should return an array of the object values when given no args', () => {
      const res = Immutable.toArray(largerTestData);
      const expected = Object.values(largerTestData);
      expect(res).toStrictEqual(expected);
    });

    it('should return an array from the objects using a string accessor', () => {
      const res = Immutable.toArray(largerTestData, 'firstName');
      const expected = Object.values(largerTestData).map(v => v.firstName);
      expect(res).toStrictEqual(expected);
    });

    it('should return an array from the objects using a function accessor', () => {
      const getDisplayName = val => `${val.firstName} ${val.lastName}`;
      const res = Immutable.toArray(largerTestData, getDisplayName);
      const expected = Object.values(largerTestData).map(getDisplayName);
      expect(res).toStrictEqual(expected);
    });
  });

  describe('pick', () => {
    it('should return an object containing only the fields given', () => {
      const res = Immutable.pick(simpleTestData, ['firstName', 'lastName']);
      const expected = { firstName: 'Nick', lastName: 'Coronado' };
      expect(res).toStrictEqual(expected);
    });

    it('should ignore fields that are not present in the object', () => {
      const res = Immutable.pick(simpleTestData, ['some', 'other', 'fields']);
      const expected = {};
      expect(res).toStrictEqual(expected);
    });
  });

  describe('omit', () => {
    it('should return an object omitting the fields given', () => {
      const fields = ['firstName', 'lastName'];
      const fieldSet = new Set(fields);
      const res = Immutable.omit(simpleTestData, fields);
      const expected = Object.entries(simpleTestData).reduce((o, [key, val]) => {
        return fieldSet.has(key) ? o : { ...o, [key]: val };
      }, {});
      expect(res).toStrictEqual(expected);
    });

    it('should ignore fields that are not present in the object', () => {
      const res = Immutable.omit(simpleTestData, ['some', 'other', 'fields']);
      expect(res).toStrictEqual(simpleTestData);
    });
  });
});
