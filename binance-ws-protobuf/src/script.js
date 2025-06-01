import { market_data } from './generated/market_data_pb.js'; 

// Access TickerList and TickerUpdate from the imported namespace.
const TickerList = market_data.TickerList;
const TickerUpdate = market_data.TickerUpdate;


document.addEventListener('DOMContentLoaded', () => {
    const wsStatusElem = document.getElementById('ws-status');
    const ratesTableBody = document.querySelector('#rates-table tbody');

    const messageInput = document.getElementById('messageInput');
    const sendMessageBtn = document.getElementById('sendMessageBtn');
    const serverEchoElem = document.getElementById('serverEcho');
    const otherClientEchoElem = document.getElementById('otherClientsEcho');

    const WS_URL = 'ws://localhost:3001'; // Backend WebSocket URL
    let ws;

    // Stores current prices for quick lookup and update
    const currentPrices = new Map(); // Map: symbol -> { lastPrice, eventTime }

    function connectWebSocket() {
        ws = new WebSocket(WS_URL);
        ws.binaryType = 'arraybuffer';

        wsStatusElem.textContent = 'Connecting...';
        wsStatusElem.style.color = 'orange';

        ws.onopen = () => {
            wsStatusElem.textContent = 'Connected';
            wsStatusElem.style.color = 'green';
            console.log('Connected to our WebSocket API.');
            // Clear message input on successful reconnect
            messageInput.value = '';
            serverEchoElem.textContent = '';
            otherClientEchoElem.textContent = '';
        };

        ws.onmessage = (event) => {
            // Check if the received data is a binary ArrayBuffer (which Protobuf sends)
            if (event.data instanceof ArrayBuffer) {
                // Convert ArrayBuffer to Uint8Array for protobufjs     
                const buffer = new Uint8Array(event.data);
                
                try {
                    // Decode the TickerList message
                    const tickerList = TickerList.decode(buffer);
                    
                    // Update the UI
                    updateTable(tickerList.tickers);
        } catch (e) {
                    console.error('Error decoding Protobuf message:', e);
                }
            } else {
                // If it's not ArrayBuffer, assume it's a text message (e.g., echo from server)
                console.log('Received text message from server:', event.data);
                if (event.data.startsWith('Other clients say:')) {
                    otherClientEchoElem.textContent = event.data; // Display other clients' messages
                }
                else {
                    serverEchoElem.textContent = `Server echoes: "${event.data}"`;
                    serverEchoElem.style.color = 'black';
                }
            }
        };

        ws.onclose = (event) => {
            wsStatusElem.textContent = `Disconnected (Code: ${event.code}, Reason: ${event.reason || 'N/A'}). Reconnecting...`;
            wsStatusElem.style.color = 'red';
            console.warn('Disconnected from our WebSocket API. Reconnecting in 3 seconds...');
            setTimeout(connectWebSocket, 3000); // Attempt to reconnect
        };

        ws.onerror = (error) => {
            wsStatusElem.textContent = 'WebSocket Error';
            wsStatusElem.style.color = 'red';
            console.error('WebSocket Error:', error);
            ws.close(); // Close the connection to trigger onclose and reconnect
        };
    }

    const domRows = new Map(); // Map: symbol -> HTMLElement (the <tr>)

    function updateTable(tickers) {
        // 1. Process incoming ticker updates: Update/Create individual rows and cells
        tickers.forEach(ticker => {
            const newPrice = parseFloat(ticker.lastPrice).toFixed(4);
            const newEventTime = ticker.eventTime;

            // Get old data from the price cache (for comparison and consistency)
            const oldData = currentPrices.get(ticker.symbol);
            const oldPrice = oldData ? oldData.lastPrice : null; 
            const oldEventTime = oldData ? oldData.eventTime : null;

            // Always update the central `currentPrices` cache with the latest data
            currentPrices.set(ticker.symbol, {
                lastPrice: newPrice,
                eventTime: newEventTime
            });

            // Get or create the row for this specific ticker symbol
            let row = domRows.get(ticker.symbol); // Try to get the existing <tr> element
            let symbolCell, priceCell, timeCell;

            if (!row) {
                // If the row doesn't exist in our DOM tracking map, create a brand new <tr> element
                row = document.createElement('tr'); // Create a new <tr>
                row.id = `row-${ticker.symbol}`; // Assign a unique ID for easy lookup
                domRows.set(ticker.symbol, row); // Store reference to the new <tr> in our map

                // Create and append the cells (<th> or <td> depending on table structure, but <td> is common for tbody)
                symbolCell = row.insertCell(); // Creates a <td>
                symbolCell.textContent = ticker.symbol;

                priceCell = row.insertCell();
                priceCell.classList.add('price'); // Add class for styling/animation

                timeCell = row.insertCell();
                timeCell.classList.add('time'); // Add class for styling/selection
                
                // Append the new row to the table body immediately. Its position will be corrected in step 2.
                ratesTableBody.appendChild(row);

            } else {
                // If the row already exists, just get references to its cells
                symbolCell = row.cells[0]; 
                priceCell = row.cells[1];
                timeCell = row.cells[2];
            }

            // Update the price cell content and trigger flash animation if price has changed
            if (priceCell.textContent !== newPrice) { // Compare current displayed text with new formatted price
                priceCell.textContent = newPrice;
                // This sequence forces the browser to reflow, allowing the CSS animation to restart
                priceCell.classList.remove('flash'); 
                void priceCell.offsetWidth; // Trigger reflow by accessing offsetWidth
                priceCell.classList.add('flash');
            }
            
            // Update the time cell content if the event time has actually changed or if it's the first render
            const newTimeFormatted = new Date(Number(newEventTime)).toLocaleTimeString();
            if (timeCell.textContent === '' || timeCell.textContent !== newTimeFormatted) {
                timeCell.textContent = newTimeFormatted; 
            }
        });

        // 2. Re-order the rows in the DOM to ensure they are consistently sorted
        // This step avoids destroying existing elements, preserving their state (like CSS animations).
        const sortedSymbols = Array.from(currentPrices.keys()).sort(); // Get all tracked symbols, sorted alphabetically

        for (let i = 0; i < sortedSymbols.length; i++) {
            const symbol = sortedSymbols[i];
            const currentRowElement = domRows.get(symbol); // Get the actual <tr> DOM element for this symbol

            // Determine the `nextSibling` that this `currentRowElement` should precede
            // If it's the last element in the sorted list, it won't have a next sibling (so `null`)
            const desiredNextSibling = (i + 1 < sortedSymbols.length) ? domRows.get(sortedSymbols[i+1]) : null;

            // Check if the `currentRowElement` is NOT already in its correct sorted position
            // If its actual next sibling is different from its desired next sibling, it needs to be moved.
            if (currentRowElement && currentRowElement.nextSibling !== desiredNextSibling) {
                // Move the `currentRowElement` to its correct position.
                // `insertBefore` handles both inserting into the middle and appending to the end (if desiredNextSibling is null).
                ratesTableBody.insertBefore(currentRowElement, desiredNextSibling);
            }
        }
        
        // 3. Optional: Clean up rows for symbols that are no longer being tracked
        // This loop removes any rows from the DOM that correspond to symbols no longer present in `currentPrices`.
        // (This is mostly for robustness if your `desiredSymbols` list or Binance stream changes dynamically).
        Array.from(domRows.keys()).forEach(symbol => {
            if (!currentPrices.has(symbol)) { // If a symbol in `domRows` is no longer in `currentPrices`
                const rowToRemove = domRows.get(symbol);
                if (rowToRemove && rowToRemove.parentNode === ratesTableBody) {
                    ratesTableBody.removeChild(rowToRemove); // Remove the <tr> from the DOM
                    domRows.delete(symbol); // Remove it from our tracking map
                }
            }
        });
    }


    // Event listener for send message button
    if (sendMessageBtn) {
        messageInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') { // Allow sending message with Enter key
                event.preventDefault(); // Prevent form submission if inside a form
                sendMessageBtn.click(); // Trigger the button click event
            }
        });
        sendMessageBtn.addEventListener('click', () => {
            const message = messageInput.value.trim();
            if (message && ws && ws.readyState === WebSocket.OPEN) {
                ws.send(message); // Send the text message to the server
                messageInput.value = ''; // Clear input field
                serverEchoElem.textContent = `You sent: "${message}"`; // Temporary local echo
            } else if (ws && ws.readyState !== WebSocket.OPEN) {
                serverEchoElem.textContent = 'Error: WebSocket is not open.';
                serverEchoElem.style.color = 'red';
            } else {
                serverEchoElem.textContent = 'Error: Message cannot be empty.';
                serverEchoElem.style.color = 'red';
            }
        });
    }

    // Start WebSocket connection when the page loads
    connectWebSocket();
});