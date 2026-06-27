#pragma once

#include <nlohmann/json.hpp>
#include <string>
#include <vector>
#include <cstdint>
#include <cmath>
#include <chrono>
#include <optional>
#include <random>
#include <ctime>

#ifndef M_PI
#define M_PI 3.14159265358979323846
#endif

namespace nexus {

using json = nlohmann::json;
using Clock = std::chrono::steady_clock;
using TimePoint = Clock::time_point;

struct GeoCoord {
    double latitude = 0.0;
    double longitude = 0.0;
    
    double distance_km(const GeoCoord& other) const {
        constexpr double R = 6371.0; // Earth radius km
        double lat1 = latitude * M_PI / 180.0;
        double lat2 = other.latitude * M_PI / 180.0;
        double dlat = (other.latitude - latitude) * M_PI / 180.0;
        double dlon = (other.longitude - longitude) * M_PI / 180.0;
        double a = std::sin(dlat/2) * std::sin(dlat/2) +
                   std::cos(lat1) * std::cos(lat2) * std::sin(dlon/2) * std::sin(dlon/2);
        double c = 2 * std::atan2(std::sqrt(a), std::sqrt(1-a));
        return R * c;
    }
};

inline void to_json(json& j, const GeoCoord& c) {
    j = json{{"latitude", c.latitude}, {"longitude", c.longitude}};
}
inline void from_json(const json& j, GeoCoord& c) {
    j.at("latitude").get_to(c.latitude);
    j.at("longitude").get_to(c.longitude);
}

struct Vessel {
    std::string id;
    uint32_t mmsi = 0;
    std::string name;
    GeoCoord position;
    double heading_deg = 0.0;
    double speed_knots = 0.0;
    std::string destination;
    std::string cargo_type;
    std::string status;
    std::string route;
    double risk_score = 0.0;
    std::string last_updated;
    TimePoint internal_timestamp = Clock::now();
};

inline void to_json(json& j, const Vessel& v) {
    j = json{
        {"id", v.id},
        {"name", v.name},
        {"type", "vessel"},
        {"lat", v.position.latitude},
        {"lon", v.position.longitude},
        {"heading", v.heading_deg},
        {"speed", v.speed_knots},
        {"status", v.status},
        {"route", v.route},
        {"cargo", v.cargo_type},
        {"risk", v.risk_score},
        {"updated", v.last_updated}
    };
}

inline void from_json(const json& j, Vessel& v) {
    j.at("id").get_to(v.id);
    j.at("name").get_to(v.name);
    j.at("lat").get_to(v.position.latitude);
    j.at("lon").get_to(v.position.longitude);
    j.at("heading").get_to(v.heading_deg);
    j.at("speed").get_to(v.speed_knots);
    if(j.contains("status")) j.at("status").get_to(v.status);
    if(j.contains("route")) j.at("route").get_to(v.route);
    if(j.contains("cargo")) j.at("cargo").get_to(v.cargo_type);
    if(j.contains("risk")) j.at("risk").get_to(v.risk_score);
    if(j.contains("updated")) j.at("updated").get_to(v.last_updated);
}

struct Aircraft {
    std::string id;
    std::string icao24;
    std::string flight_number;
    GeoCoord position;
    double altitude_ft = 0.0;
    double heading_deg = 0.0;
    double velocity_kph = 0.0;
    std::string status;
    std::string route;
    std::string cargo;
    double risk_score = 0.0;
    std::string last_updated;
    TimePoint internal_timestamp = Clock::now();
};

inline void to_json(json& j, const Aircraft& a) {
    j = json{
        {"id", a.id},
        {"name", a.flight_number},
        {"type", "flight"},
        {"lat", a.position.latitude},
        {"lon", a.position.longitude},
        {"heading", a.heading_deg},
        {"speed", a.velocity_kph},
        {"status", a.status},
        {"route", a.route},
        {"cargo", a.cargo},
        {"risk", a.risk_score},
        {"updated", a.last_updated}
    };
}

inline void from_json(const json& j, Aircraft& a) {
    j.at("id").get_to(a.id);
    j.at("name").get_to(a.flight_number);
    j.at("lat").get_to(a.position.latitude);
    j.at("lon").get_to(a.position.longitude);
    j.at("heading").get_to(a.heading_deg);
    j.at("speed").get_to(a.velocity_kph);
    if(j.contains("status")) j.at("status").get_to(a.status);
    if(j.contains("route")) j.at("route").get_to(a.route);
    if(j.contains("cargo")) j.at("cargo").get_to(a.cargo);
    if(j.contains("risk")) j.at("risk").get_to(a.risk_score);
    if(j.contains("updated")) j.at("updated").get_to(a.last_updated);
}

struct WeatherSystem {
    std::string id;
    GeoCoord center;
    int severity = 1;
    double radius_km = 50.0;
    double wind_speed_kph = 0.0;
    double movement_lat = 0.0;
    double movement_lon = 0.0;
    std::string type_name;
    std::string last_updated;
    TimePoint internal_timestamp = Clock::now();
};

inline void to_json(json& j, const WeatherSystem& w) {
    j = json{
        {"id", w.id},
        {"center", w.center},
        {"severity", w.severity},
        {"radius_km", w.radius_km},
        {"wind_speed_kph", w.wind_speed_kph},
        {"movement_lat", w.movement_lat},
        {"movement_lon", w.movement_lon},
        {"type_name", w.type_name},
        {"last_updated", w.last_updated}
    };
}

struct Alert {
    std::string id;
    std::string asset_name;
    std::string asset_type;
    double risk = 0.0;
    std::string message;
    std::string timestamp;
};

inline void to_json(json& j, const Alert& a) {
    j = json{
        {"id", a.id},
        {"asset", a.asset_name},
        {"type", a.asset_type},
        {"risk", a.risk},
        {"msg", a.message},
        {"time", a.timestamp}
    };
}

struct TrackingSnapshot {
    std::vector<json> assets;
    std::vector<json> weather_systems;
    std::vector<json> alerts;
    std::string timestamp;
};

inline void to_json(json& j, const TrackingSnapshot& s) {
    j = json{
        {"assets", s.assets},
        {"weather_systems", s.weather_systems},
        {"alerts", s.alerts},
        {"timestamp", s.timestamp}
    };
}

inline std::string utc_now_iso() {
    auto now = std::chrono::system_clock::now();
    auto time_t = std::chrono::system_clock::to_time_t(now);
    std::tm tm{};
#ifdef _WIN32
    gmtime_s(&tm, &time_t);
#else
    gmtime_r(&time_t, &tm);
#endif
    char buf[64];
    std::strftime(buf, sizeof(buf), "%Y-%m-%dT%H:%M:%S", &tm);
    return std::string(buf);
}

inline double compute_risk_score(double lat, double lon, double speed, const std::string& asset_type) {
    static thread_local std::mt19937 rng(std::random_device{}());
    std::uniform_real_distribution<> base_dist(20.0, 80.0);
    double base = base_dist(rng);
    if (asset_type == "vessel" && std::abs(lat) > 45.0) base += 20.0;
    if (speed > 800.0) base += 10.0;
    return std::min(std::round(base * 10.0) / 10.0, 99.0);
}

} // namespace nexus
