// internal-imports
import { redisClient, redisPublisherClient, redisSubscriberClient } from '../core/index.js';

// external-imports
import { Server } from 'socket.io';

// create a new Socket.IO server instance
export const io = new Server();

// initialize the checkbox state in Redis if it doesn't exist
const checkboxesList = new Array(100).fill(false);
await redisClient.setnx('checkboxes-list', JSON.stringify(checkboxesList));

// type for checkbox data
type CheckboxData = {
  index: number;
  value: boolean;
};

// subscribe to Redis channel for checkbox state updates
redisSubscriberClient.subscribe('checkbox-state-updates');

// handle messages from Redis channel
redisSubscriberClient.on('message', async (channel, message) => {
  if (channel === 'checkbox-state-updates' && message) {
    // parse the message to get the checkbox data
    const data: CheckboxData = JSON.parse(message);

    // get the initial state of the checkboxes from Redis
    const checkBoxes = await redisClient.get('checkboxes-list');
    const checkBoxState: boolean[] = JSON.parse(checkBoxes!);

    // update the state of the checkbox
    checkBoxState[data.index] = data.value;

    // save the updated state back to Redis
    await redisClient.set('checkboxes-list', JSON.stringify(checkBoxState));

    // broadcast the signal to all connected clients to update their checkboxes
    io.emit('checkbox-state-updated');
  }
});

// handle new client connections
io.on('connection', socket => {
  // handle checkbox-state-update event
  socket.on('checkbox-state-update', data => {
    // publish the updated checkbox state to the Redis channel
    redisPublisherClient.publish('checkbox-state-updates', JSON.stringify(data));
  });
});
