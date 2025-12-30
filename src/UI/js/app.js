// JavaScript for Proton App

// Initialize Qt WebChannel
new QWebChannel(window.qt.webChannelTransport, function(objects) {
    window.bridge = objects.bridge;

    // Test logging
    if (window.bridge) {
         window.bridge.log_to_python("JavaScript Connected!");
    }

    // Contoh penggunaan dengan callback (yang sebelumnya error "1 arguments given")
    if (window.bridge.get_app_info) {
        window.bridge.get_app_info(function(returnValue) {
            // Callback ini sekarang akan diproses dengan benar oleh qwebchannel.js baru
            var infoElem = document.getElementById('app-info');
            if (infoElem) infoElem.innerText = returnValue;
        });
    }

    // Connect Signal
    if (window.bridge.counterChanged) {
        window.bridge.counterChanged.connect(function(val) {
            // Ini sekarang akan menggunakan Index Signal yang benar, bukan nama string
            document.getElementById('counter-display').innerText = 'Counter: ' + val;
        });
    }

    if (window.bridge.dataProcessed) {
        window.bridge.dataProcessed.connect(function(message) {
            var output = document.getElementById('signal-output');
            if (output) {
                output.innerHTML += '<p>Signal: ' + message + '</p>';
            }
        });
    }

    // Set initial counter
    updateCounter();
});

// Function to update counter display
function updateCounter() {
    if (window.bridge && window.bridge.counter !== undefined) {
        var display = document.getElementById('counter-display');
        if (display) {
            display.innerText = 'Counter: ' + window.bridge.counter;
        }
    }
}

// Function to test the bridge (logging)
function testBridge() {
    if (window.bridge) {
        window.bridge.log_to_python("Hello from JavaScript!");
        document.getElementById('log-output').innerText = "Log sent to Python!";
    } else {
        document.getElementById('log-output').innerText = "Bridge not available.";
    }
}

// Function to process data
function processData() {
    const input = document.getElementById('data-input');
    const data = input ? input.value : "";
    
    if (window.bridge && data) {
        window.bridge.process_data(data, function(result) {
            // Handle return value via callback (best practice for WebChannel)
             document.getElementById('process-output').innerText = result;
        });
    } else {
        document.getElementById('process-output').innerText = "Bridge not available or no data.";
    }
}

// Function to increment counter
function incrementCounter() {
    if (window.bridge) {
        window.bridge.increment_counter();
    }
}

// Function to decrement counter
function decrementCounter() {
    if (window.bridge) {
        window.bridge.decrement_counter();
    }
}

// Event listeners
document.addEventListener("DOMContentLoaded", function() {
    // Pastikan elemen ada sebelum addEventListener
    var btnTest = document.getElementById('test-button');
    if (btnTest) btnTest.addEventListener('click', testBridge);
    
    var btnProcess = document.getElementById('process-button');
    if (btnProcess) btnProcess.addEventListener('click', processData);
    
    var btnInc = document.getElementById('increment-button');
    if (btnInc) btnInc.addEventListener('click', incrementCounter);
    
    var btnDec = document.getElementById('decrement-button');
    if (btnDec) btnDec.addEventListener('click', decrementCounter);
});