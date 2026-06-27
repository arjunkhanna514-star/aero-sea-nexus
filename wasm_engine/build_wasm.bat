@echo off
REM Compilation script for Aero-Sea Nexus WebAssembly Optimization Engine

echo Compiling nexus_core.cpp to WebAssembly...

emcc nexus_core.cpp ^
    -O3 ^
    -s WASM=1 ^
    -s EXPORTED_FUNCTIONS="['_malloc', '_free', '_optimize_maritime', '_optimize_aviation']" ^
    -s EXPORTED_RUNTIME_METHODS="['ccall', 'cwrap']" ^
    -s ALLOW_MEMORY_GROWTH=1 ^
    -o ../public/nexus_core.js

if %ERRORLEVEL% equ 0 (
    echo Compilation successful! nexus_core.js and nexus_core.wasm have been placed in the public/ folder.
) else (
    echo Compilation failed. Ensure Emscripten (emcc) is installed and in your PATH.
)
