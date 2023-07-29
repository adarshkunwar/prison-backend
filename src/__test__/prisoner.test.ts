import { CellType, PrisonerType } from '../type';

const newData: PrisonerType = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  age: 23,
  address: 'add 1',
  contactNumber: 1234567890,
  dateOfAdmission: '2021-6-26',
  dateOfRelease: '2022-6-26',
  crime: 'Robbery',
  latestVisit: '10/12/2002',
  visitors: [],
};
const sampleData: CellType = {
  id: 98,
  cellName: 'DBC1',
  capacity: 8,
  currentOccupancy: 6,
  prisoners: [newData],
};

const check = (data: CellType, newData: PrisonerType) => {
  console.log(data.prisoners);
  if (data.currentOccupancy < data.capacity) {
    data.prisoners.push(newData);
    data.currentOccupancy += 1;
  }
  return data;
};

describe('Prisoner: ', () => {
  describe('Check Prisoner', () => {
    it('should prisoners array length increased', () => {
      expect(check(sampleData, newData).prisoners.length).toBe(2);
    });
    it('should return current Occupancy increased', () => {
      expect(check(sampleData, newData).currentOccupancy).toBe(8);
    });
    it('should return data value unchanged', () => {
      expect(check(sampleData, newData).currentOccupancy).toBe(8);
    });
  });
});
