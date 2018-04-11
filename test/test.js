const assert = require("assert");
const expect = require("chai").expect;

const usernames = require("../usernames.js");

const exampleUsername = "superuser";
const examplePerson = "0FNZQSZTPMNZOHYE5R55VIWXF4J63SRG3";

describe("Usernames", () => {
	describe("should record ownership of usernames", () => {
		it("should return undefined for available username", () => {
			expect(usernames.findUsernameOwner(exampleUsername)).to.be.equal(undefined);
		});

		it("should allow to set username ownership", () => {
			usernames.setUsernameOwner(exampleUsername, examplePerson);
		});

		it("should return owner of taken username", () => {
			expect(usernames.findUsernameOwner(exampleUsername)).to.be.equal(examplePerson);
		})
	});
});