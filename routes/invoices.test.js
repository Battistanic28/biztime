process.env.NODE_ENV = "test"; 
const request = require("supertest");
const app = require("../app");
const db = require("../db");

let testInvoice;

beforeEach(async function() {
    await db.query(
        `INSERT INTO companies (code, name, description) VALUES ('tst','TestCo', 'test test test') RETURNING code, name, description`);
    let result = await db.query(
        `INSERT INTO invoices (comp_code, amt) VALUES ('tst', 100) RETURNING add_date, amt, comp_code, id, paid, paid_date`);
        testInvoice = result.rows[0];
    });

afterEach(async function() {
    await db.query("DELETE FROM invoices");
    await db.query("DELETE FROM companies");
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