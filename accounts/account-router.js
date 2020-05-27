const express = require('express');
//  const config = require('../knexfile').development
const knex = require('../data/dbConfig.js');

const router = express.Router();


/**----------GETS------------ */
router.get('/', async (req,res)=>{
    try{
        const accounts = await knex('accounts')
        res.json(accounts)
    }
    catch (err) {
        errorMessage(err)
      }
})

router.get('/:id',validateID, async (req,res)=>{
    try{
        const {id} = req.params
        
        const accounts = await knex('accounts').where('id',id)
        res.json(accounts)
    } catch(err) {
        errorMessage(err)
    }

})
/**-------------POSTS--------------- */

router.post('/',validateBody, async (req,res)=>{
    const accountData = req.body
    try{
        const account = await knex('accounts').insert(accountData)
        res.status(201).json(account)
    }
    catch(err){
        errorMessage(err)
    }
})

/**-------------------PUTS------------ */

router.put('/:id', validateID,validateBody, async(req,res)=>{
    const accountData = req.body
    const {id} = req.params
    try{
        const count = await knex('accounts').update(accountData).where({id})
        res.status(200).json(({update:count}))
    }
    catch(err){
        errorMessage(err)
    }
})

/**----------------------DELETES----------------- */

router.delete('/:id', validateID, async (req,res)=>{
    const {id} = req.params
    try{
        const count = await knex('accounts').del().where({id})
        res.json({deleted:count})
    }
    catch(err){
        errorMessage(err)
    }
})


/******-------------------MIDDLEWARE---------------*********** */


//Checks to see if there is a valid ID
//if the array length === 0 then there is no valid ID, returns 404
 async function  validateID(req,res,next){
    const {id} = req.params
    const accounts = await knex('accounts').where('id',id)
    // console.log(accounts.length)
    if(accounts.length === 0){
        next(res.status(404).json({message:"Not found"}))
    }
  
        else{
            next()
        }     
}
//Checks to see if a valid body has been submitted
/** A VALID BODY IS AS FOLLOWS
 * "name": string
 * "budget": number
 * 
 */
async function validateBody(req,res,next){
    const name = req.body.name
    const budget = req.body.budget
    if(typeof budget !== "number"){
        next(res.status(400).json({message:"Budget needs to be a number"}))
    }
    if(!name || !budget){
        next(res.status(400).json({message:"Please include a name and budget"}))
    }
    else{
        next()
    }
}



//This is just because I don't want to keep typing the error message

function errorMessage(error){
    const err = error;
    res.status(500).json({message: "problem with DB", error:err})
}

/***---------------------END OF MIDDLEWARE----------------- */

module.exports = router