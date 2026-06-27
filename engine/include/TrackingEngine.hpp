#pragma once
#include "DataModels.hpp"
#include "SpatialGrid.hpp"
#include <unordered_map>
#include <shared_mutex>
#include <deque>
#include <mutex>
#include <atomic>
#include <optional>

namespace nexus {

class TrackingEngine {
public:
    TrackingEngine();
    ~TrackingEngine() = default;

    // --- Asset Updates (thread-safe) ---
    void update_vessel(Vessel vessel);
    void update_aircraft(Aircraft aircraft);
    void update_weather(WeatherSystem ws);
    void add_alert(Alert alert);

    // --- Queries (thread-safe) ---
    json get_all_assets_json() const;
    json get_status_json() const;
    json get_alerts_json(size_t limit = 20) const;
    json get_fleet_status_json() const;
    json get_weather_systems_json() const;
    json get_snapshot_json() const;
    
    std::optional<json> get_asset_json(const std::string& id) const;
    
    size_t vessel_count() const;
    size_t aircraft_count() const;
    size_t total_asset_count() const;
    size_t alert_count() const;
    
    // --- Maintenance ---
    void expire_stale_assets(std::chrono::seconds ttl);
    std::vector<Alert> check_weather_intersections();
    void rebuild_spatial_index();
    
    // --- Demo/Simulation support ---
    void set_asset_risk(const std::string& id, double risk);
    void set_asset_status(const std::string& id, const std::string& status);
    void force_refresh_all();  // recalculate risk scores for all assets

private:
    mutable std::shared_mutex vessels_mtx_;
    mutable std::shared_mutex aircraft_mtx_;
    mutable std::shared_mutex weather_mtx_;
    mutable std::mutex alerts_mtx_;
    
    std::unordered_map<std::string, Vessel> vessels_;
    std::unordered_map<std::string, Aircraft> aircraft_;
    std::unordered_map<std::string, WeatherSystem> weather_systems_;
    std::deque<Alert> alerts_;
    static constexpr size_t kMaxAlerts = 200;
    
    SpatialGrid spatial_grid_{1.0}; // 1 degree cells
};

} // namespace nexus
