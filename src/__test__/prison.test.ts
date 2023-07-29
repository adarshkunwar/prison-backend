import { PrisonType } from '../type';
const getCapacity = (object: PrisonType) => {
  return object.blocks.reduce((val, i) => {
    return val + i.capacity;
  }, 0);
};

const getCurrentOccupancy = (object: PrisonType) => {
  return object.blocks.reduce((val, i) => {
    return (
      val +
      i.cells.reduce((val, i) => {
        return val + i.currentOccupancy;
      }, 0)
    );
  }, 0);
};

// sample data
const data: PrisonType = {
  id: 'ad9fa05b-bb8b-4d43-b550-64c99fa062fa',
  name: 'prison 2',
  address: 'add 3',
  capacity: 40,
  currentOccupancy: 23,
  description: 'desc 3',
  createdDate: '2023-6-26',
  blocks: [
    {
      id: '108539fb-5610-4663-bb2f-231d1426b3bc',
      capacity: 40,
      currentOccupancy: 23,
      blockName: 'DBC',
      totalCell: 5,
      cells: [
        {
          id: 98,
          cellName: 'DBC1',
          capacity: 8,
          currentOccupancy: 1,
          prisoners: [],
        },
        {
          id: 98,
          cellName: 'DBC1',
          capacity: 8,
          currentOccupancy: 1,
          prisoners: [],
        },
      ],
    },
    {
      id: '108539fb-5610-4663-bb2f-231d1426b3bc',
      capacity: 40,
      currentOccupancy: 23,
      blockName: 'DBC',
      totalCell: 5,
      cells: [
        {
          id: 98,
          cellName: 'DBC1',
          capacity: 8,
          currentOccupancy: 1,
          prisoners: [],
        },
        {
          id: 98,
          cellName: 'DBC1',
          capacity: 8,
          currentOccupancy: 1,
          prisoners: [
            {
              id: 'd2eebc6d-fba7-4c2f-838a-0f415ef74254',
              firstName: 'John',
              lastName: 'Doe',
              age: 30,
              address: '123 Main Street',
              contactNumber: 9876543,
              dateOfAdmission: '2023-07-27T06:17:08.039Z',
              dateOfRelease: '2024-07-26',
              crime: 'Robbery',
              latestVisit: '10/12/2002',
              visitors: [],
            },
            {
              id: '6ff09e00-0b96-47f2-bca9-bf767059b9b6',
              firstName: 'John',
              lastName: 'Doe',
              age: 30,
              address: '123 Main Street',
              contactNumber: 9876543,
              dateOfAdmission: '2023-07-27T06:17:06.230Z',
              dateOfRelease: '2024-07-26',
              crime: 'Robbery',
              latestVisit: '10/12/2002',
              visitors: [],
            },
            {
              id: '52c4ff37-68ea-43d7-a515-86bb4fc10712',
              firstName: 'John',
              lastName: 'Doe',
              age: 30,
              address: '123 Main Street',
              contactNumber: 9876543,
              dateOfAdmission: '2023-07-27T06:17:09.588Z',
              dateOfRelease: '2024-07-26',
              crime: 'Robbery',
              latestVisit: '10/12/2002',
              visitors: [],
            },
          ],
        },
      ],
    },
  ],
};

describe('Prison Check', () => {
  test('check capacity', () => {
    expect(getCapacity(data)).toBe(80);
  });

  test('check currentOccupancy', () => {
    expect(getCurrentOccupancy(data)).toBe(4);
  });
});
