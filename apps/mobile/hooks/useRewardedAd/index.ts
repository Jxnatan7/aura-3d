import { useEffect, useState, useCallback, useMemo } from "react";
import { Platform, Alert } from "react-native";
import {
  RewardedAd,
  RewardedAdEventType,
  AdEventType,
  TestIds,
} from "react-native-google-mobile-ads";

const adUnitId = __DEV__ ? TestIds.REWARDED : "SEU_ID_REAL_DO_ADMOB_AQUI";

export const useRewardedAd = () => {
  const [loaded, setLoaded] = useState(false);
  const isWeb = Platform.OS === "web";
  const rewarded = useMemo(() => {
    if (isWeb) return null;

    return RewardedAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: true,
    });
  }, [isWeb]);

  useEffect(() => {
    if (isWeb || !rewarded) {
      setLoaded(true);
      return;
    }

    const unsubscribeLoaded = rewarded.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        console.log("AdMob: Anúncio carregado!");
        setLoaded(true);
      },
    );

    const unsubscribeError = rewarded.addAdEventListener(
      AdEventType.ERROR,
      (error) => {
        console.error("AdMob Erro de carregamento:", error);
        setLoaded(false);
      },
    );

    rewarded.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeError();
    };
  }, [rewarded, isWeb]);

  const showAd = useCallback((): Promise<boolean> => {
    return new Promise((resolve) => {
      if (isWeb || !rewarded) {
        resolve(true);
        return;
      }

      if (loaded) {
        let userEarnedReward = false;

        const unsubscribeEarned = rewarded.addAdEventListener(
          RewardedAdEventType.EARNED_REWARD,
          (reward) => {
            console.log("Usuário ganhou recompensa:", reward);
            userEarnedReward = true;
          },
        );

        const unsubscribeClosed = rewarded.addAdEventListener(
          AdEventType.CLOSED,
          () => {
            console.log("Anúncio fechado");
            setLoaded(false);
            unsubscribeEarned();
            unsubscribeClosed();

            rewarded.load();

            if (userEarnedReward) {
              resolve(true);
            } else {
              Alert.alert(
                "Aviso",
                "Você fechou o anúncio antes do fim. O modelo não será gerado.",
              );
              resolve(false);
            }
          },
        );

        rewarded.show();
      } else {
        Alert.alert(
          "Aguarde",
          "O anúncio está carregando... Tente novamente em alguns segundos.",
        );
        rewarded.load();
        resolve(false);
      }
    });
  }, [loaded, rewarded, isWeb]);

  return { isLoaded: loaded, showAd };
};
