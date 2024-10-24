import { expect } from "chai";
import hre from "hardhat";

describe("FavoriteDrink", () => {
    const deployFavoriteDrinkFixture = async () => {
        const [owner, addr1, addr2] = await hre.ethers.getSigners();

        const FavoriteDrink = await hre.ethers.getContractFactory(
            "FavoriteDrink"
        );
        const favoriteDrink = await FavoriteDrink.deploy();

        return { owner, addr1, addr2, favoriteDrink };
    };

    describe("Deployment", () => {
        it("Should deploy the contract correctly", async () => {
            const { favoriteDrink } = await deployFavoriteDrinkFixture();

            expect(favoriteDrink.getAddress).to.not.be.undefined;
        });
    });

    describe("setFavoriteDrink", () => {
        it("Should set the favorite drinks correctly", async () => {
            const { favoriteDrink, owner, addr1, addr2 } =
                await deployFavoriteDrinkFixture();

            await favoriteDrink.connect(addr1).setDrink("Rum & Coke");
            await favoriteDrink.connect(addr2).setDrink("Gin & Tonic");

            const allDrinks = await favoriteDrink.getDrinks();

            expect(allDrinks.length).to.equal(2);

            expect(allDrinks[0].text).to.equal("Rum & Coke");
            expect(allDrinks[1].text).to.equal("Gin & Tonic");
        });

        it("Should not allow an address to vote more than once", async () => {
            const { favoriteDrink } = await deployFavoriteDrinkFixture();

            await favoriteDrink.setDrink("Rum & Coke");

            const allDrinks = await favoriteDrink.getDrinks();

            expect(allDrinks.length).to.equal(1);

            await expect(
                favoriteDrink.setDrink("White Russian")
            ).to.be.revertedWithCustomError(favoriteDrink, "AlreadySubmitted");
        });
    });
});
