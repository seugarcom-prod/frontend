// hooks/useRestaurantUnitId.ts
import { useRestaurantUnitStore } from '@/stores';

export function useRestaurantUnitId() {
    const currentUnitId = useRestaurantUnitStore((state) => state.currentUnitId);
    return currentUnitId;
}