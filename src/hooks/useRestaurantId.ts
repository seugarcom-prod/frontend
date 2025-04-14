// hooks/useRestaurantId.ts
import { useParams } from 'next/navigation';
import { useRestaurantStore } from '@/stores';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export function useRestaurantId() {
    const params = useParams();
    const { data: session } = useSession();
    const {
        restaurantId: storeId,
        setRestaurantId
    } = useRestaurantStore();

    const urlId = params?.restaurantId as string;

    useEffect(() => {
        if (urlId && urlId !== 'undefined') {
            setRestaurantId(urlId);
        }
    }, [urlId, setRestaurantId]);

    return {
        restaurantId: urlId || storeId || session?.user?.restaurantId,
        isLoading: !urlId && !storeId && !session?.user?.restaurantId
    };
}