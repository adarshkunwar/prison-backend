import { BlockType } from '../type';

const getCurrentOccupancy = (object: BlockType) => {
  return object.cells.reduce((val, i) => {
    return val + i.currentOccupancy;
  }, 0);
};

const getCells = (object: BlockType) => {
  return object.cells.length;
};

// sample data
const data: BlockType = {
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
      currentOccupancy: 7,
      prisoners: [],
    },
    {
      id: 98,
      cellName: 'DBC1',
      capacity: 8,
      currentOccupancy: 7,
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
};

describe('Block', () => {
  test('getCurrentOccupancy', () => {
    expect(getCurrentOccupancy(data)).toBe(14);
  });

  test('getCells', () => {
    expect(getCells(data)).toBe(2);
  });
});
