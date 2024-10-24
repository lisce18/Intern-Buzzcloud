import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const FavoriteDrinkModule = buildModule("FavoriteDrinkModule", (m) => {
    const favoriteDrink = m.contract("FavoriteDrink", [], {});

    return { favoriteDrink };
});

export default FavoriteDrinkModule;
