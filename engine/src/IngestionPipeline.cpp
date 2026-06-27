#include "IngestionPipeline.hpp"
#include <random>
#include <cmath>

namespace nexus {

IngestionPipeline::IngestionPipeline(std::shared_ptr<TrackingEngine> engine)
    : engine_(std::move(engine)) {}

IngestionPipeline::~IngestionPipeline() {
    stop();
}

void IngestionPipeline::start() {
    if (running_.exchange(true)) return;
    
    workers_.emplace_back([this](std::stop_token st) { ais_feed_worker(std::move(st)); });
    workers_.emplace_back([this](std::stop_token st) { adsb_feed_worker(std::move(st)); });
    workers_.emplace_back([this](std::stop_token st) { weather_feed_worker(std::move(st)); });
    workers_.emplace_back([this](std::stop_token st) { maintenance_worker(std::move(st)); });
}

void IngestionPipeline::stop() {
    if (!running_.exchange(false)) return;
    for (auto& w : workers_) {
        w.request_stop();
    }
    workers_.clear();
}

bool IngestionPipeline::is_running() const {
    return running_.load();
}

void IngestionPipeline::ais_feed_worker(std::stop_token st) {
    thread_local std::mt19937 rng(std::random_device{}());
    
    struct SimulatedVessel {
        Vessel v;
        double base_speed;
    };
    
    std::vector<SimulatedVessel> sim_vessels = {
        {{"V001", 123456789, "Pacific Star", {35.5, 139.7}, 90.0, 14.0, "Los Angeles", "Electronics", "underway", "Tokyo-LA", 0.0, ""}, 14.0},
        {{"V002", 234567890, "Atlantic Hawk", {51.5, -0.1}, 270.0, 18.0, "New York", "Machinery", "underway", "London-NY", 0.0, ""}, 18.0},
        {{"V003", 345678901, "Indian Breeze", {20.0, 72.8}, 180.0, 12.0, "Dubai", "Textiles", "underway", "Mumbai-Dubai", 0.0, ""}, 12.0},
        {{"V004", 456789012, "Nordic Frost", {59.9, 10.7}, 300.0, 15.0, "Reykjavik", "Crude Oil", "underway", "Oslo-Reykjavik", 0.0, ""}, 15.0},
        {{"V005", 567890123, "Dragon Pearl", {31.2, 121.5}, 180.0, 20.0, "Singapore", "Electronics", "underway", "Shanghai-Singapore", 0.0, ""}, 20.0},
        {{"V006", 678901234, "Cape Runner", {-33.9, 18.4}, 300.0, 16.0, "Santos", "Grain", "underway", "Cape Town-Santos", 0.0, ""}, 16.0},
        {{"V007", 789012345, "Med Express", {43.3, 5.4}, 90.0, 19.0, "Istanbul", "Vehicles", "underway", "Marseille-Istanbul", 0.0, ""}, 19.0},
        {{"V008", 890123456, "Gulf Trader", {30.5, 47.8}, 135.0, 13.0, "Karachi", "LNG", "underway", "Basra-Karachi", 0.0, ""}, 13.0}
    };
    
    std::uniform_real_distribution<> speed_noise(-2.0, 2.0);
    std::uniform_real_distribution<> heading_noise(-3.0, 3.0);
    std::uniform_real_distribution<> jitter(0.8, 1.2);
    
    while (!st.stop_requested()) {
        for (auto& sv : sim_vessels) {
            double h_rad = sv.v.heading_deg * M_PI / 180.0;
            sv.v.speed_knots = std::max(0.0, sv.base_speed + speed_noise(rng));
            sv.v.heading_deg = std::fmod(sv.v.heading_deg + heading_noise(rng) + 360.0, 360.0);
            
            double factor = 0.001;
            sv.v.position.latitude += std::cos(h_rad) * sv.v.speed_knots * factor * jitter(rng);
            sv.v.position.longitude += std::sin(h_rad) * sv.v.speed_knots * factor * jitter(rng);
            
            if (sv.v.position.latitude > 90.0) sv.v.position.latitude = 180.0 - sv.v.position.latitude;
            else if (sv.v.position.latitude < -90.0) sv.v.position.latitude = -180.0 - sv.v.position.latitude;
            
            if (sv.v.position.longitude > 180.0) sv.v.position.longitude -= 360.0;
            else if (sv.v.position.longitude < -180.0) sv.v.position.longitude += 360.0;
            
            sv.v.status = (sv.v.speed_knots < 2.0) ? "anchored" : "underway";
            sv.v.risk_score = compute_risk_score(sv.v.position.latitude, sv.v.position.longitude, sv.v.speed_knots, "vessel");
            sv.v.last_updated = utc_now_iso();
            sv.v.internal_timestamp = Clock::now();
            
            engine_->update_vessel(sv.v);
        }
        std::this_thread::sleep_for(std::chrono::milliseconds(500));
    }
}

void IngestionPipeline::adsb_feed_worker(std::stop_token st) {
    thread_local std::mt19937 rng(std::random_device{}());
    
    struct SimulatedAircraft {
        Aircraft a;
        double base_velocity;
    };
    
    std::vector<SimulatedAircraft> sim_aircraft = {
        {{"F001", "3900A1", "BA-777", {48.8, 2.3}, 35000.0, 300.0, 890.0, "airborne", "Paris-NYC", "Passengers", 0.0, ""}, 890.0},
        {{"F002", "8960C2", "EK-201", {25.2, 55.3}, 37000.0, 315.0, 920.0, "airborne", "Dubai-London", "Mixed", 0.0, ""}, 920.0},
        {{"F003", "76CD34", "SQ-321", {1.3, 103.8}, 39000.0, 135.0, 900.0, "airborne", "Singapore-Sydney", "Passengers", 0.0, ""}, 900.0},
        {{"F004", "A1B2C3", "UA-838", {37.6, -122.4}, 36000.0, 270.0, 880.0, "airborne", "San Francisco-Tokyo", "Mixed", 0.0, ""}, 880.0},
        {{"F005", "D4E5F6", "LH-490", {50.0, 8.5}, 38000.0, 280.0, 870.0, "airborne", "Frankfurt-Chicago", "Passengers", 0.0, ""}, 870.0}
    };
    
    std::uniform_real_distribution<> vel_noise(-20.0, 20.0);
    std::uniform_real_distribution<> heading_noise(-2.0, 2.0);
    std::uniform_real_distribution<> alt_noise(-100.0, 100.0);
    
    while (!st.stop_requested()) {
        for (auto& sa : sim_aircraft) {
            double h_rad = sa.a.heading_deg * M_PI / 180.0;
            sa.a.velocity_kph = std::max(0.0, sa.base_velocity + vel_noise(rng));
            sa.a.heading_deg = std::fmod(sa.a.heading_deg + heading_noise(rng) + 360.0, 360.0);
            sa.a.altitude_ft += alt_noise(rng);
            
            double factor = 0.01;
            sa.a.position.latitude += std::cos(h_rad) * sa.a.velocity_kph * factor;
            sa.a.position.longitude += std::sin(h_rad) * sa.a.velocity_kph * factor;
            
            if (sa.a.position.latitude > 90.0) sa.a.position.latitude = 180.0 - sa.a.position.latitude;
            else if (sa.a.position.latitude < -90.0) sa.a.position.latitude = -180.0 - sa.a.position.latitude;
            
            if (sa.a.position.longitude > 180.0) sa.a.position.longitude -= 360.0;
            else if (sa.a.position.longitude < -180.0) sa.a.position.longitude += 360.0;
            
            sa.a.risk_score = compute_risk_score(sa.a.position.latitude, sa.a.position.longitude, sa.a.velocity_kph, "flight");
            sa.a.last_updated = utc_now_iso();
            sa.a.internal_timestamp = Clock::now();
            
            engine_->update_aircraft(sa.a);
        }
        std::this_thread::sleep_for(std::chrono::milliseconds(250));
    }
}

void IngestionPipeline::weather_feed_worker(std::stop_token st) {
    thread_local std::mt19937 rng(std::random_device{}());
    
    std::vector<WeatherSystem> sim_weather = {
        {"WS001", {15.0, 135.0}, 3, 200.0, 120.0, 0.5, -0.5, "Tropical Storm Aria", "", Clock::now()},
        {"WS002", {25.0, -90.0}, 4, 350.0, 180.0, 0.2, 0.5, "Hurricane Bernard", "", Clock::now()},
        {"WS003", {15.0, 90.0}, 3, 250.0, 130.0, 0.3, -0.2, "Cyclone Chandra", "", Clock::now()},
        {"WS004", {45.0, -40.0}, 2, 150.0, 90.0, 0.4, 0.8, "Storm Delta", "", Clock::now()}
    };
    
    std::uniform_real_distribution<> radius_noise(-10.0, 10.0);
    std::uniform_real_distribution<> wind_noise(-5.0, 5.0);
    std::uniform_int_distribution<> sev_change(-1, 1);
    std::uniform_int_distribution<> sev_chance(1, 100);
    
    while (!st.stop_requested()) {
        for (auto& ws : sim_weather) {
            ws.center.latitude += ws.movement_lat;
            ws.center.longitude += ws.movement_lon;
            
            ws.radius_km = std::max(50.0, ws.radius_km + radius_noise(rng));
            ws.wind_speed_kph = std::max(40.0, ws.wind_speed_kph + wind_noise(rng));
            
            if (sev_chance(rng) > 90) {
                ws.severity = std::clamp(ws.severity + sev_change(rng), 1, 5);
            }
            
            ws.last_updated = utc_now_iso();
            ws.internal_timestamp = Clock::now();
            
            engine_->update_weather(ws);
        }
        std::this_thread::sleep_for(std::chrono::milliseconds(2000));
    }
}

void IngestionPipeline::maintenance_worker(std::stop_token st) {
    while (!st.stop_requested()) {
        engine_->expire_stale_assets(std::chrono::seconds(60));
        
        auto new_alerts = engine_->check_weather_intersections();
        
        engine_->rebuild_spatial_index();
        
        std::this_thread::sleep_for(std::chrono::milliseconds(5000));
    }
}

} // namespace nexus
