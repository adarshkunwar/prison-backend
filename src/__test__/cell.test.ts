import { BlockType, CellType } from '../type';
// import cell from '../../src/Routes/Cell.routes';
// import request = require('supertest');

const sampledata: BlockType = {
  id: '108539fb-5610-4663-bb2f-231d1426b3bc',
  capacity: 40,
  currentOccupancy: 40, // Equal to blockCapacity
  blockName: 'DBC',
  totalCell: 5,
  cells: [
    // Add more cells here if needed to meet the blockCapacity (40)
  ],
};

const sampledata3: BlockType = {
  id: '108539fb-5610-4663-bb2f-231d1426b3bc',
  capacity: 40,
  currentOccupancy: 30, // Total occupancy (23+7) equals block capacity (40)
  blockName: 'DBC',
  totalCell: 5,
  cells: [
    // Add more cells here if needed to meet the blockCapacity (40)
  ],
};

const sampledata5: BlockType = {
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
      currentOccupancy: 6, // Enough capacity available for more prisoners
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
      ],
    },
    // Add more cells here if needed to meet the blockCapacity (40)
  ],
};

const newData: CellType = {
  id: 98,
  cellName: 'DBC1',
  capacity: 11, // Less than block capacity
  currentOccupancy: 4, // Adjust occupancy accordingly
  prisoners: [],
};

const getCurrentOccupancy = (object: BlockType) => {
  return object.currentOccupancy;
};

const getCapacity = (object: BlockType) => {
  return object.capacity;
};

const checkBlock = (object: BlockType, newData) => {
  const capacity = getCapacity(object);
  const currentOccupancy = getCurrentOccupancy(object);
  const availableCapacityBlock = capacity - currentOccupancy;
  if (newData.capacity > availableCapacityBlock) return false;
  else return true;
};

describe('CELL:  check the block if', () => {
  it('has occupancy equaling blockCapacity', () => {
    expect(checkBlock(sampledata, newData)).toBe(false);
  });
  it('has cell capacity + block occupancy equaling block capacity', () => {
    expect(checkBlock(sampledata3, newData)).toBe(false);
  });
  it('has availablitity', () => {
    expect(checkBlock(sampledata5, newData)).toBe(true);
  });
});

// describe('CELL: checking api', () => {
//   describe('GET /cell', () => {
//     it('should return all cells', async () => {
//       await request(cell)
//         .get('/cell')
//         .then((res) => {
//           expect(res.status).toBe(200);
//           expect(res.body.length).toBe(5);
//         });
//     });
//   });
// });
