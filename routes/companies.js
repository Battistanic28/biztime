const express = require("express");
const slugify = require("slugify");
const router = new express.Router();
const ExpressError = require("../expressError");
const db = require("../db");


router.get("/", async function(req, res, next) {
    try {
        const companiesQuery = await db.query("SELECT code, name, description FROM companies")
        return res.json({companies: companiesQuery.rows});
    } catch(err) {
        return next(err)
    }
})

router.get("/:code", async function(req, res, next) {
    try {
      const companyQuery = await db.query("SELECT code, name, description FROM companies WHERE code = $1" , [req.params.code]) 
      if(companyQuery.rows.length === 0) {
        throw new ExpressError(`Company code ${req.params.code} does not exist.`, 404)    
    } 
      return res.json({company: companyQuery.rows[0]}) 
    } catch(err) {
        return next(err)
    }
})

router.post("/", async function(req, res, next) {
    try {
        const { name, description } = req.body;
        const code = slugify(name, {remove: /[*+~.()'"!:@]/g, lower: true})
        const result = await db.query("INSERT INTO companies (code, name, description) VALUES ($1,$2,$3) RETURNING code, name, description", [code, name, description])
        return res.status(201).json({company: result.rows[0]})
    } catch(err) {
        return next(err)
    }
})

router.put("/:code", async function(req, res, next) {
    try {
        const code = req.params.code;
        const { name, description } = req.body;
        const result = await db.query("UPDATE companies SET code=$1, name=$2, description=$3 WHERE code=$1 RETURNING code, name, description", [code, name, description])
        if(result.rows.length === 0) {
            throw new ExpressError(`Company code ${req.params.code} does not exist.`, 404)    
        } 
        return res.json({company: result.rows[0]})
    } catch(err) {
        return next(err)
    }
})

router.delete("/:code", async function(req, res, next) {
    try {
        const result = await db.query("DELETE FROM companies WHERE code=$1 RETURNING code=$1", [req.params.code])
        if(result.rows.length === 0) {
            throw new ExpressError(`Company code ${req.params.code} does not exist.`, 404)    
        } 
        return res.json({message: "Company deleted."})
    } catch(err) {
        return next(err)
    }
})

module.exports = router;