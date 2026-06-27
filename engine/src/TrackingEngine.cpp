#include "TrackingEngine.hpp"
#include <algorithm>

namespace nexus {

TrackingEngine::TrackingEngine() = default;

void TrackingEngine::update_vessel(Vessel vessel) {
    {
        std::unique_lock lock(vessels_mtx_);
        vessels_[vessel.id] = std::move(vessel);
    }
    rebuild_spatial_index();
}

void TrackingEngine::update_aircraft(Aircraft aircraft) {
    {
        std::unique_lock lock(aircraft_mtx_);
        aircraft_[aircraft.id] = std::move(aircraft);
    }
    rebuild_spatial_index();
}

void TrackingEngine::update_weather(WeatherSystem ws) {
    std::unique_lock lock(weather_mtx_);
    weather_systems_[ws.id] = std::move(ws);
}

void TrackingEngine::add_alert(Alert alert) {
    std::lock_guard lock(alerts_mtx_);
    alerts_.push_back(std::move(alert));
    while (alerts_.size() > kMaxAlerts) {
        alerts_.pop_front();
    }
}

json TrackingEngine::get_all_assets_json() const {
    std::shared_lock lock_v(vessels_mtx_);
    std::shared_lock lock_a(aircraft_mtx_);
    json result = json::array();
    for (const auto& [id, v] : vessels_) {
        json j = v;
        result.push_back(j);
    }
    for (const auto& [id, a] : aircraft_) {
        json j = a;
        result.push_back(j);
    }
    return result;
}

json TrackingEngine::get_status_json() const {
    return json{
        {"status", "online"},
        {"assets", total_asset_count()},
        {"alerts", alert_count()},
        {"time", utc_now_iso()}
    };
}

json TrackingEngine::get_alerts_json(size_t limit) const {
    std::lock_guard lock(alerts_mtx_);
    json result = json::array();
    size_t count = 0;
    // Iterate from newest to oldest
    for (auto it = alerts_.rbegin(); it != alerts_.rend() && count < limit; ++it, ++count) {
        json j = *it;
        result.push_back(j);
    }
    std::reverse(result.begin(), result.end()); // Return oldest to newest within the limited set
    return result;
}

json TrackingEngine::get_fleet_status_json() const {
    std::shared_lock lock_v(vessels_mtx_);
    std::shared_lock lock_a(aircraft_mtx_);
    std::shared_lock lock_w(weather_mtx_);
    
    json v_items = json::array();
    for (const auto& [id, v] : vessels_) v_items.push_back(v);
    
    json a_items = json::array();
    for (const auto& [id, a] : aircraft_) a_items.push_back(a);
    
    return json{
        {"vessels", {{"count", vessels_.size()}, {"items", v_items}}},
        {"aircraft", {{"count", aircraft_.size()}, {"items", a_items}}},
        {"weather_active", weather_systems_.size()}
    };
}

json TrackingEngine::get_weather_systems_json() const {
    std::shared_lock lock(weather_mtx_);
    json result = json::array();
    for (const auto& [id, w] : weather_systems_) {
        json j = w;
        result.push_back(j);
    }
    return result;
}

json TrackingEngine::get_snapshot_json() const {
    return json{
        {"assets", get_all_assets_json()},
        {"weather_systems", get_weather_systems_json()},
        {"alerts", get_alerts_json(kMaxAlerts)},
        {"timestamp", utc_now_iso()}
    };
}

std::optional<json> TrackingEngine::get_asset_json(const std::string& id) const {
    {
        std::shared_lock lock(vessels_mtx_);
        auto it = vessels_.find(id);
        if (it != vessels_.end()) return json(it->second);
    }
    {
        std::shared_lock lock(aircraft_mtx_);
        auto it = aircraft_.find(id);
        if (it != aircraft_.end()) return json(it->second);
    }
    return std::nullopt;
}

size_t TrackingEngine::vessel_count() const {
    std::shared_lock lock(vessels_mtx_);
    return vessels_.size();
}

size_t TrackingEngine::aircraft_count() const {
    std::shared_lock lock(aircraft_mtx_);
    return aircraft_.size();
}

size_t TrackingEngine::total_asset_count() const {
    return vessel_count() + aircraft_count();
}

size_t TrackingEngine::alert_count() const {
    std::lock_guard lock(alerts_mtx_);
    return alerts_.size();
}

void TrackingEngine::expire_stale_assets(std::chrono::seconds ttl) {
    auto now = Clock::now();
    {
        std::unique_lock lock(vessels_mtx_);
        for (auto it = vessels_.begin(); it != vessels_.end(); ) {
            if (now - it->second.internal_timestamp > ttl) {
                it = vessels_.erase(it);
            } else {
                ++it;
            }
        }
    }
    {
        std::unique_lock lock(aircraft_mtx_);
        for (auto it = aircraft_.begin(); it != aircraft_.end(); ) {
            if (now - it->second.internal_timestamp > ttl) {
                it = aircraft_.erase(it);
            } else {
                ++it;
            }
        }
    }
    {
        std::unique_lock lock(weather_mtx_);
        for (auto it = weather_systems_.begin(); it != weather_systems_.end(); ) {
            if (now - it->second.internal_timestamp > ttl) {
                it = weather_systems_.erase(it);
            } else {
                ++it;
            }
        }
    }
    rebuild_spatial_index();
}

std::vector<Alert> TrackingEngine::check_weather_intersections() {
    std::vector<Alert> new_alerts;
    std::vector<WeatherSystem> current_weather;
    {
        std::shared_lock lock(weather_mtx_);
        for (const auto& [id, ws] : weather_systems_) {
            current_weather.push_back(ws);
        }
    }

    for (const auto& ws : current_weather) {
        auto nearby = spatial_grid_.query_radius(ws.center.latitude, ws.center.longitude, ws.radius_km);
        for (const auto& entry : nearby) {
            std::optional<json> asset = get_asset_json(entry.id);
            if (asset) {
                double asset_risk = (*asset)["risk"];
                if (asset_risk > 70.0) {
                    Alert a;
                    a.id = entry.id + "_" + utc_now_iso().substr(0, 19);
                    a.asset_name = (*asset)["name"];
                    a.asset_type = (*asset)["type"];
                    a.risk = asset_risk;
                    a.message = a.asset_name + " risk " + std::to_string(static_cast<int>(asset_risk)) + "% near " + ws.type_name;
                    a.timestamp = utc_now_iso();
                    add_alert(a);
                    new_alerts.push_back(a);
                }
            }
        }
    }
    return new_alerts;
}

void TrackingEngine::rebuild_spatial_index() {
    std::vector<SpatialEntry> entries;
    {
        std::shared_lock lock_v(vessels_mtx_);
        for (const auto& [id, v] : vessels_) {
            entries.push_back({id, v.position.latitude, v.position.longitude});
        }
    }
    {
        std::shared_lock lock_a(aircraft_mtx_);
        for (const auto& [id, a] : aircraft_) {
            entries.push_back({id, a.position.latitude, a.position.longitude});
        }
    }
    spatial_grid_.rebuild(entries);
}

void TrackingEngine::set_asset_risk(const std::string& id, double risk) {
    {
        std::unique_lock lock(vessels_mtx_);
        auto it = vessels_.find(id);
        if (it != vessels_.end()) {
            it->second.risk_score = risk;
            return;
        }
    }
    {
        std::unique_lock lock(aircraft_mtx_);
        auto it = aircraft_.find(id);
        if (it != aircraft_.end()) {
            it->second.risk_score = risk;
            return;
        }
    }
}

void TrackingEngine::set_asset_status(const std::string& id, const std::string& status) {
    {
        std::unique_lock lock(vessels_mtx_);
        auto it = vessels_.find(id);
        if (it != vessels_.end()) {
            it->second.status = status;
            return;
        }
    }
    {
        std::unique_lock lock(aircraft_mtx_);
        auto it = aircraft_.find(id);
        if (it != aircraft_.end()) {
            it->second.status = status;
            return;
        }
    }
}

void TrackingEngine::force_refresh_all() {
    {
        std::unique_lock lock(vessels_mtx_);
        for (auto& [id, v] : vessels_) {
            v.risk_score = compute_risk_score(v.position.latitude, v.position.longitude, v.speed_knots, "vessel");
        }
    }
    {
        std::unique_lock lock(aircraft_mtx_);
        for (auto& [id, a] : aircraft_) {
            a.risk_score = compute_risk_score(a.position.latitude, a.position.longitude, a.velocity_kph, "flight");
        }
    }
}

} // namespace nexus
