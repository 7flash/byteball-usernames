const assert = require("assert");
const expect = require("chai").expect;
const proxyquire = require("proxyquire").noCallThru();

const usernamesModelMock = require("./usernamesModelMock.js");
const pendingPaymentsModelMock = require("./pendingPaymentsModelMock.js");

const usernames = proxyquire("../usernames.js", {
	'./usernamesModel': usernamesModelMock ,
	'./pendingPaymentsModel': pendingPaymentsModelMock
});

const exampleUsername = "superuser";
const examplePerson = "0FNZQSZTPMNZOHYE5R55VIWXF4J63SRG3";

const anotherUsername = "anotherUsername";
const anotherPerson = "0FNZQSZTPMNZOHYE5R55VIWXF4J63SRG4";
const examplePaymentAddress = "0FNZQSZTPMNZOHYE5R55VIWXF4J63SRG5";
const examplePendingPayment = {
	username: "anotherUsername",
	person: examplePerson,
	paymentAddress: examplePaymentAddress,
	paymentAmount: usernames.highPrice
};

describe("Usernames", () => {
	describe("record ownership of usernames", () => {
		it("should return undefined for available username", async () => {
			expect(await usernames.findUsernameOwner(exampleUsername)).to.be.equal(undefined);
		});

		it("should allow to set username ownership", async () => {
			await usernames.setUsernameOwner(exampleUsername, examplePerson);
		});

		it("should return owner of taken username", async () => {
			expect(await usernames.findUsernameOwner(exampleUsername)).to.be.equal(examplePerson);
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

	describe("record pending payments", () => {
		it("should return undefined for username that is not pending for payment", async () => {
			expect(await usernames.findPendingPaymentByUsername(examplePendingPayment.username)).to.be.equal(undefined);
		});

		it("should fail to create pending payment for taken username", async () => {
			try {
				await usernames.savePendingPayment({ username: exampleUsername });
			} catch(e) {
				expect(e).to.be.an('error');
			}
		});

		it("should fail to create pending payment for invalid username", async () => {
			try {
				await usernames.savePendingPayment({ username: "four" })
			} catch(e) {
				expect(e).to.be.an('error');
			}
		});

		it("should allow to create pending payment for available username", async () => {
			await usernames.savePendingPayment(examplePendingPayment);
		});

		it("should return info about pending payment by username", async () => {
			expect(await usernames.findPendingPaymentByUsername(examplePendingPayment.username)).to.be.equal(examplePendingPayment);
		});

		it("should return info about pending payment by address", async () => {
			expect(await usernames.findPendingPaymentByAddress(examplePendingPayment.address)).to.be.equal(examplePendingPayment);
		});

		it("should allow to remove pending payment by username", async () => {
			await usernames.removePendingPaymentByUsername(examplePendingPayment.username);
			expect(await usernames.findPendingPaymentByUsername(examplePendingPayment.username)).to.be.equal(undefined);
		});

		it("should allow to remove pending payment by address", async () => {
			await usernames.savePendingPayment(examplePendingPayment);

			await usernames.removePendingPaymentByAddress(examplePendingPayment.address);
			expect(await usernames.findPendingPaymentByAddress(examplePendingPayment.address)).to.be.equal(undefined);
		});
	});
});