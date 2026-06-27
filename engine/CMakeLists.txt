cmake_minimum_required(VERSION 3.20)
project(AeroSeaNexusEngine LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

if(MSVC)
    add_compile_options(/W4 /Zc:__cplusplus)
else()
    add_compile_options(-Wall -Wextra -Wpedantic)
endif()

include(FetchContent)

# --- Asio (standalone) ---
FetchContent_Declare(
    asio
    GIT_REPOSITORY https://github.com/chriskohlhoff/asio.git
    GIT_TAG asio-1-30-2
    GIT_SHALLOW TRUE
)
FetchContent_MakeAvailable(asio)

set(ASIO_INCLUDE_DIR ${asio_SOURCE_DIR}/asio/include CACHE PATH "Path to Asio include directory")

add_library(Asio INTERFACE)
target_include_directories(Asio INTERFACE ${asio_SOURCE_DIR}/asio/include)
target_compile_definitions(Asio INTERFACE ASIO_STANDALONE ASIO_NO_DEPRECATED)

# --- Crow ---
set(CROW_BUILD_EXAMPLES OFF CACHE BOOL "Build examples")
set(CROW_BUILD_TESTS OFF CACHE BOOL "Build tests")
set(CROW_INSTALL OFF CACHE BOOL "Install Crow")
set(CROW_FEATURES "ssl;compression" CACHE STRING "Crow features")
FetchContent_Declare(
    Crow
    GIT_REPOSITORY https://github.com/CrowCpp/Crow.git
    GIT_TAG v1.3.2
    GIT_SHALLOW TRUE
)
FetchContent_MakeAvailable(Crow)

# --- nlohmann/json ---
FetchContent_Declare(
    nlohmann_json
    GIT_REPOSITORY https://github.com/nlohmann/json.git
    GIT_TAG v3.11.3
    GIT_SHALLOW TRUE
)
FetchContent_MakeAvailable(nlohmann_json)

add_executable(aero_sea_engine
    src/Server.cpp
    src/TrackingEngine.cpp
    src/IngestionPipeline.cpp
)

target_include_directories(aero_sea_engine PRIVATE include)

target_link_libraries(aero_sea_engine PRIVATE
    Crow::Crow
    Asio
    nlohmann_json::nlohmann_json
)

if(WIN32)
    target_link_libraries(aero_sea_engine PRIVATE ws2_32 wsock32)
    target_compile_definitions(aero_sea_engine PRIVATE _WIN32_WINNT=0x0A00)
endif()
