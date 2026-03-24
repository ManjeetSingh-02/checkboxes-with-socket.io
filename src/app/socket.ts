// internal-imports
import { checkBoxState } from '../core/index.js';

// external-imports
import { Server } from 'socket.io';

// create a new Socket.IO server instance
export const io = new Server();

// type for checkbox data
type CheckboxData = {
  index: number;
  value: boolean;
};

// handle new client connections
io.on('connection', socket => {
  // handle checkbox-state-update event
  socket.on('checkbox-state-update', (data: CheckboxData) => {
    // update the state of the checkbox
    checkBoxState[data.index] = data.value;

    // broadcast the signal to all connected clients to update their checkboxes
    io.emit('checkbox-state-updated');
  });
});
