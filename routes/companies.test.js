process.env.NODE_ENV = "test"; 
const request = require("supertest");
const app = require("../app");
const db = require("../db");

let testCompany;

beforeEach(async function() {
    await db.query("DELETE FROM companies");
    await db.query("DELETE FROM invoices");
    let result = await db.query(
        `INSERT INTO companies (code, name, description) VALUES ('tst','TestCo', 'test test test') RETURNING code, name, description`);
        testCompany = result.rows[0];
});

afterEach(async function() {
    await db.query("DELETE FROM companies");
})

afterAll(async function() {
    await db.end();
});

describe("GET /companies", function() {
    test("Get list of all companies", async function() {
        const response = await request(app).get(`/companies`);
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual({companies: [testCompany]});
    });
});


module.exports = db;