import { v4 as uuidv4 } from "uuid";
const generateTicketNumber = () => `PASS-${uuidv4().slice(0, 8).toUpperCase()}`;
export default generateTicketNumber;
