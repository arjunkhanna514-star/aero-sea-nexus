#include <vector>
#include <cmath>
#include <algorithm>

extern "C" {

// Maritime Optimization:
// Given N vessels, we pass in their fuel_level (%), cargo_weight (tons), and distance_to_port (km).
// We return an array of optimization scores (0.0 to 100.0) where higher is better.
// The score calculates efficiency based on cargo-to-fuel ratio and distance.
void optimize_maritime(
    const double* fuel_levels,
    const double* cargo_weights,
    const double* distances,
    int count,
    double* out_scores
) {
    for (int i = 0; i < count; ++i) {
        double fuel = fuel_levels[i];
        double cargo = cargo_weights[i];
        double dist = distances[i];
        
        if (fuel <= 0.0 || dist <= 0.0) {
            out_scores[i] = 0.0;
            continue;
        }
        
        // Efficiency metric: (Cargo / Distance) * (Fuel / 100)
        // Normalized and clamped to 100
        double efficiency = (cargo / dist) * (fuel / 100.0) * 50.0;
        
        // Penalize if fuel is critically low compared to distance
        double required_fuel_baseline = dist * 0.05; // 5% fuel per 100km
        if (fuel < required_fuel_baseline) {
            efficiency *= 0.2; // 80% penalty
        }
        
        out_scores[i] = std::min(100.0, std::max(0.0, efficiency));
    }
}

// Aviation Optimization:
// Given N flights, calculate optimal cruising altitude and expected fuel burn rate.
// Inputs: distance (km), payload (tons).
// Outputs: optimal_altitude (ft), burn_rate (kg/hr).
void optimize_aviation(
    const double* distances,
    const double* payloads,
    int count,
    double* out_altitudes,
    double* out_burn_rates
) {
    for (int i = 0; i < count; ++i) {
        double dist = distances[i];
        double payload = payloads[i];
        
        // Step altitude profile: heavier payload -> lower optimal altitude
        double base_alt = 35000.0;
        if (payload > 150.0) {
            base_alt = 31000.0;
        } else if (payload < 50.0) {
            base_alt = 39000.0;
        }
        
        // Longer distance encourages slightly higher altitude for efficiency
        if (dist > 5000.0) {
            base_alt += 2000.0;
        }
        
        out_altitudes[i] = std::min(43000.0, base_alt);
        
        // Burn rate: base burn + payload penalty - altitude efficiency
        // Higher altitude -> thinner air -> less drag -> lower burn rate
        double base_burn = 5000.0; // kg/hr base
        double payload_penalty = payload * 15.0; // 15 kg/hr per ton of payload
        double alt_efficiency = (out_altitudes[i] - 30000.0) * 0.1; // saves 100 kg/hr per 1000ft above 30k
        
        out_burn_rates[i] = std::max(1000.0, base_burn + payload_penalty - alt_efficiency);
    }
}

} // extern "C"
