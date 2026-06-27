#pragma once

#include <vector>
#include <unordered_map>
#include <shared_mutex>
#include <cmath>
#include <string>
#include <functional>

#ifndef M_PI
#define M_PI 3.14159265358979323846
#endif

namespace nexus {

struct SpatialEntry {
    std::string id;
    double latitude;
    double longitude;
};

class SpatialGrid {
public:
    explicit SpatialGrid(double cell_size_degrees = 1.0) : cell_size_(cell_size_degrees) {}
    
    void rebuild(const std::vector<SpatialEntry>& entries) {
        Grid new_grid;
        size_t count = 0;
        for (const auto& entry : entries) {
            new_grid[to_cell(entry.latitude, entry.longitude)].push_back(entry);
            count++;
        }
        
        std::unique_lock lock(mtx_);
        grid_ = std::move(new_grid);
        entry_count_ = count;
    }
    
    std::vector<SpatialEntry> query_radius(double lat, double lon, double radius_km) const {
        std::vector<SpatialEntry> results;
        // ~111 km per degree of latitude
        double radius_deg = radius_km / 111.0; 
        int cell_radius = static_cast<int>(std::ceil(radius_deg / cell_size_));
        
        CellKey center = to_cell(lat, lon);
        
        std::shared_lock lock(mtx_);
        for (int dx = -cell_radius; dx <= cell_radius; ++dx) {
            for (int dy = -cell_radius; dy <= cell_radius; ++dy) {
                CellKey k{center.x + dx, center.y + dy};
                auto it = grid_.find(k);
                if (it != grid_.end()) {
                    for (const auto& entry : it->second) {
                        if (haversine_km(lat, lon, entry.latitude, entry.longitude) <= radius_km) {
                            results.push_back(entry);
                        }
                    }
                }
            }
        }
        return results;
    }
    
    size_t size() const {
        std::shared_lock lock(mtx_);
        return entry_count_;
    }
    
private:
    struct CellKey {
        int x, y;
        bool operator==(const CellKey& other) const { return x == other.x && y == other.y; }
    };
    
    struct CellKeyHash {
        size_t operator()(const CellKey& k) const {
            return std::hash<int>{}(k.x) ^ (std::hash<int>{}(k.y) << 16);
        }
    };
    
    using Grid = std::unordered_map<CellKey, std::vector<SpatialEntry>, CellKeyHash>;
    
    double cell_size_;
    Grid grid_;
    size_t entry_count_ = 0;
    mutable std::shared_mutex mtx_;
    
    CellKey to_cell(double lat, double lon) const {
        return {
            static_cast<int>(std::floor(lon / cell_size_)),
            static_cast<int>(std::floor(lat / cell_size_))
        };
    }
    
    static double haversine_km(double lat1, double lon1, double lat2, double lon2) {
        constexpr double R = 6371.0;
        double l1 = lat1 * M_PI / 180.0;
        double l2 = lat2 * M_PI / 180.0;
        double dl = (lat2 - lat1) * M_PI / 180.0;
        double dlo = (lon2 - lon1) * M_PI / 180.0;
        double a = std::sin(dl/2) * std::sin(dl/2) +
                   std::cos(l1) * std::cos(l2) * std::sin(dlo/2) * std::sin(dlo/2);
        double c = 2 * std::atan2(std::sqrt(a), std::sqrt(1-a));
        return R * c;
    }
};

} // namespace nexus
