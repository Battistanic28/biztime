const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError");
const db = require("../db");


router.get("/", async function(req, res, next) {
    try {
        const invoicesQuery = await db.query("SELECT * FROM invoices")
        return res.json({invoices: invoicesQuery.rows})
    } catch(err) {
        next(err)
    }
})

router.get("/:id", async function(req, res, next) {
    try {
        const invoiceQuery = await db.query("SELECT * FROM invoices WHERE id=$1" , [req.params.id]) 
        if(invoiceQuery.rows.length === 0) {
          throw new ExpressError(`Invoice code ${req.params.id} does not exist.`, 404)    
      } 
        return res.json({company: invoiceQuery.rows[0]}) 
      } catch(err) {
          return next(err)
      }
  })

router.post("/", async function(req, res, next) {
    try {
        const { comp_code, amt } = req.body;
        const result = await db.query("INSERT INTO invoices (comp_code, amt) VALUES ($1,$2) RETURNING id, comp_code, amt, paid, add_date, paid_date", [comp_code, amt]);
        return res.status(201).json({invoice: result.rows[0]})
    } catch(err) {
        return next(err)
    }
})

router.put("/:id", async function(req, res, next) {
    try {
        const id = req.params.id;
        const { comp_code, amt } = req.body;
        const result = await db.query("UPDATE invoices SET comp_code=$2, amt=$3 WHERE id=$1 RETURNING id, comp_code, amt, paid, add_date, paid_date", [id, comp_code, amt]);
        if(result.rows.length === 0) {
            throw new ExpressError(`Invoice code ${req.params.id} does not exist.`, 404)    
        } 
          return res.json({company: result.rows[0]}) 
        } catch(err) {
            return next(err)
        }
})

router.delete("/:id", async function(req, res, next) {
    try {
        const result = await db.query("DELETE FROM invoices WHERE id=$1 RETURNING id=$1", [req.params.id])
        if(result.rows.length === 0) {
            throw new ExpressError(`Invoice code ${req.params.id} does not exist.`, 404)    
        } 
        return res.json({message: "Invoice deleted."})
    } catch(err) {
        return next(err)
    }
})

module.exports = router;