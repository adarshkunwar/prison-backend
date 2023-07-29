export interface PrisonType {
  id: string;
  name: string;
  address: string;
  capacity: number;
  currentOccupancy: number;
  createdDate: string;
  description: string;
  blocks?: BlockType[];
}

export interface BlockType {
  id: string;
  capacity: number;
  currentOccupancy: number;
  blockName: string;
  totalCell: number;
  cells: CellType[];
}

export interface CellType {
  id: number;
  cellName: string;
  capacity: number;
  currentOccupancy: number;
  prisoners: PrisonerType[];
}

export interface PrisonerType {
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
  visitors: any[];
}
