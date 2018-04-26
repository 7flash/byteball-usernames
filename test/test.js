const assert = require("assert");
const expect = require("chai").expect;
const proxyquire = require("proxyquire").noCallThru();

const walletsModelMock = require("./walletsModelMock.js");
const reservationsModelMock = require("./reservationsModelMock.js");
const usernamesModelMock = require("./usernamesModelMock.js");

const usernames = proxyquire("../usernames.js", {
	"./walletsModel": walletsModelMock,
	"./reservationsModel": reservationsModelMock,
	"./usernamesModel": usernamesModelMock
});

const exampleUsername = "theusername";
const examplePaymentAddress = '0FNZQSZTPMNZOHYE5R55VIWXF4J63SRG3';
const exampleDevice = 'JHKFWDLM6WAFGSXXOKX7KXDN55G3P4AL';
const exampleWallet = 'IEBQNOQNBIJIP5H6W46YEKCNG24B6QTT';

const exampleOutdatedReservation = {
	username: exampleUsername,
	wallet: exampleWallet,
	paymentAddress: examplePaymentAddress,
	paymentAmount: usernames.highPrice,
	is_confirmed: 0,
	creation_date: "2017-09-26 09:10:08"
};

const exampleReservation = {
	username: exampleUsername,
	wallet: exampleWallet,
	paymentAddress: examplePaymentAddress,
	paymentAmount: usernames.highPrice,
	is_confirmed: 0,
	creation_date: new Date()
};

describe("Usernames", () => {
	describe("record ownership of wallet by device", async () => {
		it("should return undefined for available wallet", async () => {
			expect(await usernames.findWalletByDevice(exampleDevice)).to.be.equal(undefined);
		});

		it("should create relation of wallet to device", async () => {
			await usernames.createWallet({ device: exampleDevice, wallet: exampleWallet });
		});

		it("should return wallet connected to device", async () => {
			expect(await usernames.findWalletByDevice(exampleDevice)).to.be.equal(exampleWallet);
		});
	});

	describe("record ownership of reservation by wallet", async () => {
		it("should return undefined for non-reserved username", async () => {
			expect(await usernames.findReservationByWallet(exampleWallet)).to.be.equal(undefined);
		});

		it("should reserve username for wallet", async () => {
			await usernames.createReservation(exampleOutdatedReservation);
		});

		it("should fail to reserve username that already reserved", async () => {
			try {
				await usernames.createReservation(exampleOutdatedReservation);
			} catch(e) {
				expect(e).to.be.an('error');
				return;
			}
			assert.fail("reserved again");
		});

		it("should return reservation by wallet", async () => {
			expect(await usernames.findReservationByWallet(exampleWallet)).to.be.equal(exampleOutdatedReservation);
		});

		it("should remove outdated reservation", async () => {
			await usernames.removeOutdatedReservations();

			expect(await usernames.findReservationByWallet(exampleWallet)).to.be.equal(undefined);
		});

		it("should create new reservation instead of removed", async () => {
			await usernames.createReservation(exampleReservation);
		});

		it("should not remove not-outdated reservation", async () => {
			await usernames.removeOutdatedReservations();

			expect(await usernames.findReservationByWallet(exampleWallet)).to.be.equal(exampleReservation);
		});
	});

	describe("record ownership of username by wallet", () => {
		it("should return undefined for available username", async () => {
			expect(await usernames.findUsernameByWallet(exampleWallet)).to.be.equal(undefined);
		});

		it("should create connection on username with wallet", async () => {
			await usernames.createUsername({ username: exampleUsername, wallet: exampleWallet });
		});

		it("should return wallet associated with username", async () => {
			expect(await usernames.findWalletByUsername(exampleUsername)).to.be.equal(exampleWallet);
		});
	});

	describe("validate usernames", () => {
		it("should not validate username with less than 5 symbols", () => {
			expect(usernames.validateUsername("four")).to.be.equal(false);
		});

		it("should not validate numeric username", () => {
			expect(usernames.validateUsername(55555)).to.be.equal(false);
		});

		it("should return true for any correct username", () => {
			expect(usernames.validateUsername("seven")).to.be.equal(true);
		});
	});

	describe("determine price", () => {
		it("should define high price", () => {
			expect(usernames.highPrice).to.be.a("number");
		});

		it("should define low price", () => {
			expect(usernames.lowPrice).to.be.a("number");
		});

		it("should return high price for usernames shorter than 7 symbols", () => {
			expect(usernames.getPrice("sixsix")).to.be.equal(usernames.highPrice);
		});

		it("should return low price for usernames longer than 6 symbols", () => {
			expect(usernames.getPrice("itseven")).to.be.equal(usernames.lowPrice);
		});
	});
});