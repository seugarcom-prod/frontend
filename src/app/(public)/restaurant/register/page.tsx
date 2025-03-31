'use client';

import { useIsMobile } from '@/hooks/useMobile';
import RestaurantRegisterContainer from '@/components/restaurant/register/RestaurantRegisterContainer';
import MobileRestaurantRegisterContainer from '@/components/restaurant/register/MobileRegisterRestaurantContainer';

export default function RegisterRestaurantPage() {
    const isMobile = useIsMobile();

    // Renderizar o container adequado com base no tipo de dispositivo
    return isMobile
        ? <MobileRestaurantRegisterContainer />
        : <RestaurantRegisterContainer />;
}