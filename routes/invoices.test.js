process.env.NODE_ENV = "test"; 
const request = require("supertest");
const app = require("../app");
const db = require("../db");

let testInvoice;

beforeEach(async function() {
    let result = await db.query(
        `INSERT INTO invoices (comp_code, amt) VALUES ('tst', 100)`);
        testInvoice = result.rows[0];
});

afterEach(async function() {
    await db.query("DELETE FROM invoices");
})

afterAll(async function() {
    await db.end();
});

describe("GET /invoices", function() {
    test("Get list of all invoices", async function() {
        const response = await request(app).get(`/invoices`);
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual({invoices: [testInvoice]});

    });
});


module.exports = db;