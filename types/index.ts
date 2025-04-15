export interface UserCredentials {
    username: string;
    passphrase?: string; // Keep passphrase internal to server
  }
  
  export interface User {
    id: string; // Use username as ID for simplicity
    name: string;
    surname: string;
    credentials: UserCredentials;
    active: boolean; // Represents 'status'
    created: string; // Represents 'date_created'
    _comment?: string; // Optional comment
  }
  
  // Type for data displayed in the table (excluding sensitive info)
  export interface UserForTable {
    id: string;
    name: string;
    surname: string;
    status: boolean; // Renamed from 'active'
    date_created: string; // Renamed from 'created'
    created_timestamp: number; // For easier date sorting/filtering
  }
  