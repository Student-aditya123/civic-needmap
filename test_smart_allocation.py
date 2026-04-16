import unittest

from smart_allocation import Request, SmartAllocator


class SmartAllocatorTests(unittest.TestCase):
    def test_moonshot_slot_prioritizes_underfunded_moonshot(self):
        allocator = SmartAllocator(moonshot_fraction=0.2)

        # Seed history so TeamA looks historically overfunded.
        allocator.allocate(
            [
                Request(team="TeamA", amount=100, priority=2, moonshot=True),
                Request(team="TeamB", amount=100, priority=2, moonshot=True),
            ],
            total_capacity=100,
        )

        allocations = allocator.allocate(
            [
                Request(team="TeamA", amount=100, priority=2, moonshot=True),
                Request(team="TeamB", amount=100, priority=2, moonshot=True),
                Request(team="TeamC", amount=100, priority=1, moonshot=False),
            ],
            total_capacity=100,
        )

        self.assertGreater(allocations["TeamB"], allocations["TeamA"])

    def test_capacity_and_request_limits_are_respected(self):
        allocator = SmartAllocator(moonshot_fraction=0.3)
        requests = [
            Request(team="Alpha", amount=10, priority=1),
            Request(team="Beta", amount=5, priority=1),
        ]
        allocations = allocator.allocate(requests, total_capacity=100)

        self.assertLessEqual(sum(allocations.values()), 15)
        self.assertLessEqual(allocations["Alpha"], 10)
        self.assertLessEqual(allocations["Beta"], 5)


if __name__ == "__main__":
    unittest.main()
