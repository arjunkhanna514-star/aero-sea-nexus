#pragma once
#include "TrackingEngine.hpp"
#include <memory>
#include <thread>
#include <atomic>
#include <vector>

namespace nexus {

class IngestionPipeline {
public:
    explicit IngestionPipeline(std::shared_ptr<TrackingEngine> engine);
    ~IngestionPipeline();
    
    void start();
    void stop();
    bool is_running() const;

private:
    std::shared_ptr<TrackingEngine> engine_;
    std::atomic<bool> running_{false};
    std::vector<std::jthread> workers_;
    
    void ais_feed_worker(std::stop_token st);
    void adsb_feed_worker(std::stop_token st);
    void weather_feed_worker(std::stop_token st);
    void maintenance_worker(std::stop_token st);
};

} // namespace nexus
