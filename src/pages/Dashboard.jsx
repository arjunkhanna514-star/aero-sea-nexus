import React, { useState, useEffect, useRef } from 'react';

export default function Dashboard() {
    const workerRef = useRef(null);
    const [workerReady, setWorkerReady] = useState(false);
    const [maritimeResults, setMaritimeResults] = useState(null);
    const [aviationResults, setAviationResults] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Initialize Web Worker
        workerRef.current = new Worker('/nexusWorker.js');
        
        workerRef.current.onmessage = (e) => {
            const { type, data, error } = e.data;
            if (type === 'INIT_COMPLETE') {
                setWorkerReady(true);
            } else if (type === 'MARITIME_RESULTS') {
                // Convert TypedArray back to standard array for rendering
                setMaritimeResults(Array.from(data));
            } else if (type === 'AVIATION_RESULTS') {
                setAviationResults({
                    altitudes: Array.from(data.altitudes),
                    burnRates: Array.from(data.burnRates)
                });
            } else if (type === 'ERROR') {
                setError(error);
            }
        };

        return () => {
            workerRef.current.terminate();
        };
    }, []);

    const runMaritimeSim = () => {
        if (!workerReady) return;
        // Generate dummy data for 5 vessels
        const payload = {
            fuelLevels: new Float64Array([100.0, 50.0, 10.0, 80.0, 4.0]),
            cargoWeights: new Float64Array([5000.0, 12000.0, 8000.0, 2000.0, 15000.0]),
            distances: new Float64Array([1000.0, 3000.0, 500.0, 8000.0, 200.0])
        };
        workerRef.current.postMessage({ action: 'OPTIMIZE_MARITIME', payload });
    };

    const runAviationSim = () => {
        if (!workerReady) return;
        // Generate dummy data for 5 flights
        const payload = {
            distances: new Float64Array([500.0, 6000.0, 2000.0, 8000.0, 1500.0]),
            payloads: new Float64Array([10.0, 200.0, 80.0, 150.0, 40.0])
        };
        workerRef.current.postMessage({ action: 'OPTIMIZE_AVIATION', payload });
    };

    return (
        <div>
            <h1>Optimization Dashboard (Raw WASM Interface)</h1>
            <p>Worker Status: {workerReady ? "READY" : "LOADING..."}</p>
            {error && <p style={{color: 'red'}}>Error: {error}</p>}

            <div>
                <h2>Maritime Optimization</h2>
                <button onClick={runMaritimeSim} disabled={!workerReady}>Run Maritime Sim</button>
                {maritimeResults && (
                    <pre>
                        {JSON.stringify(maritimeResults, null, 2)}
                    </pre>
                )}
            </div>

            <div>
                <h2>Aviation Optimization</h2>
                <button onClick={runAviationSim} disabled={!workerReady}>Run Aviation Sim</button>
                {aviationResults && (
                    <pre>
                        {JSON.stringify(aviationResults, null, 2)}
                    </pre>
                )}
            </div>
        </div>
    );
}
