#include "TrackingEngine.hpp"
#include "IngestionPipeline.hpp"

#define CROW_ENFORCE_WS_SPEC
#include "crow.h"
#include "crow/middlewares/cors.h"

#include <unordered_set>
#include <mutex>
#include <thread>
#include <iostream>

using namespace nexus;

int main() {
    auto engine = std::make_shared<TrackingEngine>();
    IngestionPipeline pipeline(engine);
    pipeline.start();

    crow::App<crow::CORSHandler> app;

    auto& cors = app.get_middleware<crow::CORSHandler>();
    cors.global()
        .headers("Content-Type", "Authorization")
        .methods("GET"_method, "POST"_method)
        .origin("*");

    std::unordered_set<crow::websocket::connection*> ws_clients;
    std::mutex ws_mtx;

    CROW_WEBSOCKET_ROUTE(app, "/ws/live-tracking")
        .onopen([&](crow::websocket::connection& conn){
            std::lock_guard<std::mutex> lock(ws_mtx);
            ws_clients.insert(&conn);
            CROW_LOG_INFO << "WS client connected. Total: " << ws_clients.size();
        })
        .onclose([&](crow::websocket::connection& conn, const std::string& reason, uint16_t){
            std::lock_guard<std::mutex> lock(ws_mtx);
            ws_clients.erase(&conn);
            CROW_LOG_INFO << "WS client disconnected: " << reason;
        })
        .onmessage([&](crow::websocket::connection&, const std::string&, bool){
            // Not processing incoming messages yet
        });

    std::jthread broadcast_thread([&](std::stop_token st) {
        while (!st.stop_requested()) {
            std::string snapshot_json = engine->get_snapshot_json().dump();
            {
                std::lock_guard<std::mutex> lock(ws_mtx);
                for (auto* client : ws_clients) {
                    client->send_text(snapshot_json);
                }
            }
            std::this_thread::sleep_for(std::chrono::milliseconds(100)); // 10Hz
        }
    });

    CROW_ROUTE(app, "/api/status")([&](){
        return crow::response(engine->get_status_json().dump());
    });

    CROW_ROUTE(app, "/api/assets")([&](){
        return crow::response(engine->get_all_assets_json().dump());
    });

    CROW_ROUTE(app, "/api/alerts")([&](){
        return crow::response(engine->get_alerts_json(20).dump());
    });

    CROW_ROUTE(app, "/api/refresh").methods("POST"_method)([&](){
        engine->force_refresh_all();
        return crow::response(json{{"refreshed", true}, {"time", utc_now_iso()}}.dump());
    });

    CROW_ROUTE(app, "/api/v1/fleet/status")([&](){
        return crow::response(engine->get_fleet_status_json().dump());
    });

    CROW_ROUTE(app, "/api/v1/weather/systems")([&](){
        return crow::response(engine->get_weather_systems_json().dump());
    });

    CROW_ROUTE(app, "/api/simulate/<string>").methods("POST"_method)([&](const std::string& asset_id){
        auto a_opt = engine->get_asset_json(asset_id);
        if (!a_opt) return crow::response(404, "not found");
        auto a = *a_opt;
        
        json routes = json::array();
        for (int i = 0; i < 5; ++i) {
            routes.push_back({
                {"id", i + 1},
                {"name", "Route Alt " + std::to_string(i + 1)},
                {"heading", std::fmod(a["heading"].get<double>() + 30.0, 360.0)},
                {"eta_hours", 24.0 + i},
                {"weather_risk", 20.0},
                {"fuel_delta", 5.0},
                {"port_congestion", 10.0},
                {"score", 80.0}
            });
        }
        
        json res = {
            {"asset", a["name"]},
            {"current_risk", a.contains("risk") ? a["risk"].get<double>() : 0.0},
            {"alternatives", routes}
        };
        return crow::response(res.dump());
    });

    CROW_ROUTE(app, "/api/message/<string>")([&](const std::string& asset_id){
        auto a_opt = engine->get_asset_json(asset_id);
        if (!a_opt) return crow::response(404, "not found");
        auto a = *a_opt;
        
        std::string msg = "OPERATIONAL ALERT\nAsset: " + a["name"].get<std::string>();
        
        json res = {
            {"asset", a["name"]},
            {"message", msg},
            {"risk", a.contains("risk") ? a["risk"].get<double>() : 0.0}
        };
        return crow::response(res.dump());
    });

    CROW_ROUTE(app, "/api/demo/<string>").methods("POST"_method)([&](const std::string& asset_id){
        auto a_opt = engine->get_asset_json(asset_id);
        if (!a_opt) return crow::response(404, "not found");
        auto a = *a_opt;
        
        engine->set_asset_risk(asset_id, 95.0);
        engine->set_asset_status(asset_id, "disrupted");
        
        Alert alert;
        alert.id = asset_id + "_demo";
        alert.asset_name = a["name"];
        alert.asset_type = a["type"];
        alert.risk = 95.0;
        alert.message = "DEMO: " + alert.asset_name + " critical disruption on " + a["route"].get<std::string>();
        alert.timestamp = utc_now_iso();
        engine->add_alert(alert);
        
        json res = {
            {"triggered", true},
            {"asset", a["name"]},
            {"risk", 95.0}
        };
        return crow::response(res.dump());
    });

    CROW_ROUTE(app, "/api/quantum/compass/<string>")([&](const std::string& asset_id){
        auto a_opt = engine->get_asset_json(asset_id);
        if (!a_opt) return crow::response(404, "not found");
        auto a = *a_opt;
        
        json res = {
            {"asset", a["name"]},
            {"bearing", a["heading"]},
            {"cardinal", "N"},
            {"stability_index", 90.0},
            {"drift_risk", 1.0},
            {"quantum_confidence", 95.0},
            {"recommended_corridors", json::array({"Corridor A: 0 deg", "Corridor B: 10 deg"})},
            {"magnetic_variation", 0.0},
            {"updated", utc_now_iso()}
        };
        return crow::response(res.dump());
    });

    CROW_ROUTE(app, "/api/weather/<double>/<double>")([&](double lat, double lon){
        json res = {
            {"lat", lat},
            {"lon", lon},
            {"avg_wave_height_m", 1.2},
            {"risk", "LOW"},
            {"source", "simulated"}
        };
        return crow::response(res.dump());
    });

    CROW_ROUTE(app, "/api/daas/insights")([&](){
        json res = {
            {"title", "Aero-Sea Nexus Data Goldmine"},
            {"trade_volume_index", 100.0},
            {"disruption_frequency", 5.0},
            {"top_risk_routes", json::array({"Trans-Pacific", "Asia-Europe"})},
            {"insurance_signal", {{"category", "ELEVATED"}, {"delta_30d", "+8.3%"}}},
            {"hedge_fund_indicator", {{"shipping_stress_index", 50.0}, {"trend", "rising"}}},
            {"port_congestion_map", {{"Shanghai", 70.0}, {"Rotterdam", 40.0}, {"LA", 50.0}}},
            {"updated", utc_now_iso()}
        };
        return crow::response(res.dump());
    });

    CROW_ROUTE(app, "/api/turbulence/<string>")([&](const std::string& flight_id){
        auto a_opt = engine->get_asset_json(flight_id);
        std::string name = flight_id;
        if (a_opt) name = (*a_opt)["name"].get<std::string>();
        
        json forecast = json::array();
        for (int i = 1; i <= 12; ++i) {
            forecast.push_back({{"hour", i}, {"level", "SMOOTH"}, {"probability", 10.0}});
        }
        
        json res = {
            {"flight", name},
            {"current_turbulence", "SMOOTH"},
            {"hourly_forecast", forecast},
            {"comfort_tip", "Fasten seatbelt."},
            {"updated", utc_now_iso()}
        };
        return crow::response(res.dump());
    });

    CROW_ROUTE(app, "/api/cargo/track/<string>")([&](const std::string& shipment_id){
        json res = {
            {"shipment_id", shipment_id},
            {"current_stage", "In Transit"},
            {"completed_stages", json::array({"Order Placed", "Warehouse Pickup", "Origin Port"})},
            {"eta", "2026-07-01"},
            {"vessel", "Pacific Star"},
            {"origin", "Shanghai"},
            {"destination", "Los Angeles"},
            {"carbon_kg", 200.0},
            {"updated", utc_now_iso()}
        };
        return crow::response(res.dump());
    });

    app.port(8080).multithreaded().run();

    broadcast_thread.request_stop();
    pipeline.stop();
    
    return 0;
}
