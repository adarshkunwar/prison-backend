export interface Prison {
  id: string;
  name: string;
  address: string;
  capacity: number;
  currentOccupancy: number;
  createdDate: string;
  blocks: Block[];
}

export interface Block {
  id: string;
  capacity: number;
  currentOccupancy: number;
  blockName: string;
  totalCell: number;
  cells: Cell[];
}

export interface Cell {
  id: number;
  cellName: string;
  capacity: number;
  currentOccupancy: number;
  prisoners: Prisoner[];
}

export interface Prisoner {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  address: string;
  contactNumber: number;
  dateOfAdmission: string;
  dateOfRelease: string;
  crime: string;
  latestVisit: string;
  visitors: any[]; // You can replace 'any' with a specific type for visitors if available
}
