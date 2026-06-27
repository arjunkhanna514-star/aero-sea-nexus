// Web Worker for Aero-Sea Nexus WebAssembly Optimization Engine

// Import the Emscripten-generated JS glue code
importScripts('/nexus_core.js');

let wasmModule = null;

// The Module object is globally defined by nexus_core.js
Module.onRuntimeInitialized = () => {
    console.log("WASM Module initialized in Web Worker.");
    wasmModule = Module;
    postMessage({ type: 'INIT_COMPLETE' });
};

self.onmessage = function(e) {
    if (!wasmModule) {
        console.error("WASM Module not yet initialized.");
        postMessage({ type: 'ERROR', error: 'WASM Module not yet initialized.' });
        return;
    }

    const { action, payload } = e.data;

    try {
        if (action === 'OPTIMIZE_MARITIME') {
            const results = handleMaritime(payload);
            postMessage({ type: 'MARITIME_RESULTS', data: results });
        } else if (action === 'OPTIMIZE_AVIATION') {
            const results = handleAviation(payload);
            postMessage({ type: 'AVIATION_RESULTS', data: results });
        }
    } catch (err) {
        postMessage({ type: 'ERROR', error: err.message });
    }
};

function handleMaritime(payload) {
    const { fuelLevels, cargoWeights, distances } = payload;
    const count = fuelLevels.length;

    // Allocate memory inside WASM for the arrays (8 bytes per double)
    const bytesPerDouble = 8;
    const ptrFuel = wasmModule._malloc(count * bytesPerDouble);
    const ptrCargo = wasmModule._malloc(count * bytesPerDouble);
    const ptrDist = wasmModule._malloc(count * bytesPerDouble);
    const ptrOut = wasmModule._malloc(count * bytesPerDouble);

    // Copy data from JS typed arrays to WASM memory
    wasmModule.HEAPF64.set(fuelLevels, ptrFuel / bytesPerDouble);
    wasmModule.HEAPF64.set(cargoWeights, ptrCargo / bytesPerDouble);
    wasmModule.HEAPF64.set(distances, ptrDist / bytesPerDouble);

    // Call the C++ function: void optimize_maritime(const double* fuel, const double* cargo, const double* dist, int count, double* out)
    const optimize_maritime = wasmModule.cwrap('optimize_maritime', null, ['number', 'number', 'number', 'number', 'number']);
    optimize_maritime(ptrFuel, ptrCargo, ptrDist, count, ptrOut);

    // Read results back
    const resultView = new Float64Array(wasmModule.HEAPF64.buffer, ptrOut, count);
    const results = new Float64Array(resultView); // Create a copy to send back

    // Free WASM memory
    wasmModule._free(ptrFuel);
    wasmModule._free(ptrCargo);
    wasmModule._free(ptrDist);
    wasmModule._free(ptrOut);

    return results;
}

function handleAviation(payload) {
    const { distances, payloads } = payload;
    const count = distances.length;

    const bytesPerDouble = 8;
    const ptrDist = wasmModule._malloc(count * bytesPerDouble);
    const ptrPayload = wasmModule._malloc(count * bytesPerDouble);
    const ptrOutAltitudes = wasmModule._malloc(count * bytesPerDouble);
    const ptrOutBurnRates = wasmModule._malloc(count * bytesPerDouble);

    wasmModule.HEAPF64.set(distances, ptrDist / bytesPerDouble);
    wasmModule.HEAPF64.set(payloads, ptrPayload / bytesPerDouble);

    // Call C++ function: void optimize_aviation(const double* dist, const double* payload, int count, double* out_alt, double* out_burn)
    const optimize_aviation = wasmModule.cwrap('optimize_aviation', null, ['number', 'number', 'number', 'number', 'number']);
    optimize_aviation(ptrDist, ptrPayload, count, ptrOutAltitudes, ptrOutBurnRates);

    const altView = new Float64Array(wasmModule.HEAPF64.buffer, ptrOutAltitudes, count);
    const burnView = new Float64Array(wasmModule.HEAPF64.buffer, ptrOutBurnRates, count);
    
    const outAltitudes = new Float64Array(altView);
    const outBurnRates = new Float64Array(burnView);

    wasmModule._free(ptrDist);
    wasmModule._free(ptrPayload);
    wasmModule._free(ptrOutAltitudes);
    wasmModule._free(ptrOutBurnRates);

    return { altitudes: outAltitudes, burnRates: outBurnRates };
}
