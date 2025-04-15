import { defineEventHandler } from 'h3';
import type { User, UserForTable } from '~/types';
import usersData from '../data/users.json';

// Cast the imported JSON data to the User[] type
const users: User[] = usersData as User[];

// Helper to parse DD.MM.YYYY HH:MM:SS into a timestamp
function parseDateString(dateStr: string): number {
    try {
        const parts = dateStr.match(/(\d{2})\.(\d{2})\.(\d{4}) (\d{2}):(\d{2}):(\d{2})/);
        if (!parts) return 0;
        // Note: Month is 0-indexed in JS Date (parts[2] - 1)
        return new Date(parseInt(parts[3]), parseInt(parts[2]) - 1, parseInt(parts[1]), parseInt(parts[4]), parseInt(parts[5]), parseInt(parts[6])).getTime();
    } catch (e) {
        console.error("Error parsing date:", dateStr, e);
        return 0;
    }
}


export default defineEventHandler((): UserForTable[] => {
  // Simulate API response - return data suitable for the table
  // Exclude sensitive info like credentials and comments
  // Add a timestamp for easier filtering/sorting
  return users.map(user => ({
    id: user.credentials.username, // Use username as unique ID
    name: user.name,
    surname: user.surname,
    status: user.active, // 'active' field serves as 'status'
    date_created: user.created, // 'created' field serves as 'date_created'
    created_timestamp: parseDateString(user.created) // Add timestamp
  }));
});
