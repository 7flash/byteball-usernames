const assert = require("assert");
const expect = require("chai").expect;

const usernames = require("../usernames.js");

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
		it("should return undefined for available username", () => {
			expect(usernames.findUsernameOwner(exampleUsername)).to.be.equal(undefined);
		});

		it("should allow to set username ownership", () => {
			usernames.setUsernameOwner(exampleUsername, examplePerson);
		});

		it("should return owner of taken username", () => {
			expect(usernames.findUsernameOwner(exampleUsername)).to.be.equal(examplePerson);
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
		it("should return undefined for username that is not pending for payment", () => {
			expect(usernames.findPendingPayment(anotherUsername)).to.be.equal(undefined);
		});

		it("should fail to create pending payment for taken username", () => {
			expect(() => usernames.savePendingPayment({ username: exampleUsername })).to.throw();
		});

		it("should fail to create pending payment for invalid username", () => {
			expect(() => usernames.savePendingPayment({ username: "four" })).to.throw();
		});

		it("should allow to create pending payment for available username", () => {
			usernames.savePendingPayment(examplePendingPayment);
		});

		it("should return info about pending payment for username", () => {
			expect(usernames.findPendingPayment("anotherUsername")).to.be.equal(examplePendingPayment);
		});
	});
});