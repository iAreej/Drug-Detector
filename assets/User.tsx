import dayjs from 'dayjs';
import { User } from './types';
const now = dayjs();

const Users: User[] = [
  {
    id: 123,
    name:'Ali',
    CNIC: '122-33-55',
    time: now.subtract(1, 'hour').toISOString(), 
    
  },
  {
    id: 1234,
    name:'Ahmed',
    CNIC: '122-33-55',
    time: now.subtract(1, 'hour').toISOString(), 
    
  },
  {
    id: 1235,
    name:'Abdullah',
    CNIC: '122-33-55',
    time: now.subtract(1, 'hour').toISOString(), 
    
  },




 
    ]
  

export default Users;
