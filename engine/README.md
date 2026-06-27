# Aero-Sea Nexus C++ Engine

This is the production-grade C++20 engine replacing the Python backend for the Aero-Sea Nexus global trade orchestration platform.

## Architecture

1. **DataModels**: Concrete structs for `Vessel`, `Aircraft`, `WeatherSystem`, with nlohmann/json serialization.
2. **SpatialGrid**: O(1) grid-based spatial indexing for real-time intersection detection.
3. **TrackingEngine**: Thread-safe global registry protecting data with `std::shared_mutex`.
4. **IngestionPipeline**: Multi-threaded worker simulation generating live data for ships, planes, and weather.
5. **Server**: Crow-based HTTP & WebSocket server operating at 10Hz.

## Build Requirements

- C++20 compatible compiler (MSVC 2022, GCC 12+, Clang 15+)
- CMake 3.20+
- Git

## Build Instructions

```bash
cd engine
mkdir build
cd build
cmake ..
cmake --build . --config Release
```

## Running

```bash
# From the build directory
./aero_sea_engine
# OR on Windows
.\Release\aero_sea_engine.exe
```

## Endpoints

- **Dashboard**: `http://localhost:8080/`
- **API Status**: `http://localhost:8080/api/status`
- **Live Stream**: `ws://localhost:8080/ws/live-tracking`
