"""Smart resource allocation utilities.

Unique feature: Moonshot Slot
-----------------------------
A configurable fraction of capacity is reserved for the most underfunded
"moonshot" request so small, risky, high-upside efforts are continuously
explored instead of being starved by short-term optimization.
"""

from __future__ import annotations

from collections import defaultdict
from dataclasses import dataclass
from math import sqrt
from typing import Dict, List


@dataclass(frozen=True)
class Request:
    team: str
    amount: float
    priority: float = 1.0
    moonshot: bool = False


class SmartAllocator:
    """Allocates finite capacity with fairness and exploration behavior."""

    def __init__(self, moonshot_fraction: float = 0.1) -> None:
        if not 0 <= moonshot_fraction < 1:
            raise ValueError("moonshot_fraction must be in [0, 1)")
        self.moonshot_fraction = moonshot_fraction
        self._historical_allocations: Dict[str, float] = defaultdict(float)

    def allocate(self, requests: List[Request], total_capacity: float) -> Dict[str, float]:
        if total_capacity < 0:
            raise ValueError("total_capacity must be non-negative")
        if not requests:
            return {}

        moonshot_capacity = total_capacity * self.moonshot_fraction
        baseline_capacity = total_capacity - moonshot_capacity

        allocations = self._weighted_fair_allocate(requests, baseline_capacity)
        winner = self._pick_moonshot_winner(requests)

        if winner:
            unmet = max(0.0, winner.amount - allocations.get(winner.team, 0.0))
            bonus = min(moonshot_capacity, unmet)
            allocations[winner.team] = allocations.get(winner.team, 0.0) + bonus
            # If winner did not need all of the reserved capacity, spill it back fairly.
            spillover = moonshot_capacity - bonus
            if spillover > 0:
                spill = self._weighted_fair_allocate(requests, spillover)
                for team, amount in spill.items():
                    allocations[team] = allocations.get(team, 0.0) + amount
        else:
            spill = self._weighted_fair_allocate(requests, moonshot_capacity)
            for team, amount in spill.items():
                allocations[team] = allocations.get(team, 0.0) + amount

        # Hard safety cap: never exceed each team's requested amount.
        request_caps = {r.team: r.amount for r in requests}
        for team in list(allocations):
            allocations[team] = min(allocations[team], request_caps.get(team, allocations[team]))

        for team, amount in allocations.items():
            self._historical_allocations[team] += amount

        return allocations

    def _weighted_fair_allocate(
        self,
        requests: List[Request],
        capacity: float,
    ) -> Dict[str, float]:
        if capacity <= 0:
            return {r.team: 0.0 for r in requests}

        weights = {
            r.team: max(0.001, r.priority) * sqrt(max(0.001, r.amount))
            for r in requests
        }
        total_weight = sum(weights.values())

        raw = {r.team: capacity * (weights[r.team] / total_weight) for r in requests}
        # Never allocate above requested amount.
        return {r.team: min(raw[r.team], r.amount) for r in requests}

    def _pick_moonshot_winner(self, requests: List[Request]) -> Request | None:
        moonshots = [r for r in requests if r.moonshot]
        if not moonshots:
            return None

        # Unique heuristic: reward promising teams that were historically underserved.
        def score(req: Request) -> float:
            historical = self._historical_allocations.get(req.team, 0.0)
            return (req.priority * req.amount) / (1 + historical)

        return max(moonshots, key=score)
