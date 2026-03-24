// Connect to the Socket.IO server
const socket = io();

// function to create checkboxes
function createCheckboxes() {
  // loop through the array and create checkboxes
  new Array(100).fill(false).forEach((_, i) => {
    // create a input
    const input = document.createElement('input');

    // set input attributes
    input.type = 'checkbox';
    input.id = `checkbox-${i}`;
    input.style.transform = 'scale(1.5)';

    // add change event listener to emit checkbox-state-update event to the server
    input.addEventListener('change', () =>
      socket.emit('checkbox-state-update', { index: i, value: input.checked })
    );

    // append the input to the checkbox list
    document
      .getElementById('socket-checkboxes-list')
      .appendChild(document.createElement('li').appendChild(input));
  });
}

// function to update the state of checkboxes
async function updateState() {
  // fetch the current state of checkboxes from the server
  const response = await fetch('/checkbox-state', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();

  // update the checkboxes based on the fetched state
  data.checkBoxState.forEach((state, i) => {
    const checkbox = document.getElementById(`checkbox-${i}`);
    if (checkbox) checkbox.checked = state;
  });

  // update the total checked checkboxes count
  document.getElementById('socket-checkboxes-checked').textContent =
    `Checked: ${data.checkBoxState.filter(Boolean).length} / ${data.checkBoxState.length}`;
}

// listen for connect event to display the socket ID
socket.on(
  'connect',
  () => (document.getElementById('socket-id').textContent = `Socket ID: ${socket.id}`)
);

// listen for checkbox-state-updated event from the server
socket.on('checkbox-state-updated', updateState);

// initialize the checkboxes
createCheckboxes();

// update checkboxes state on page load
updateState();
