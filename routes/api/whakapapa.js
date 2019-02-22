const express = require('express')
const router = express.Router()
const passport = require('passport')
const { stringify } = require('flatted')
// Load Input Validation

const validateLoginInput = require('../../validation/login')

// Load Whakapapa and User model

const User = require('../../models/User')
const Whakapapa = require('../../models/Whakapapa')

// @route   GET api/whakapapas/test
// @desc    Tests whakapapas route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Users Works' }))
router.get('/test', (req, res) => res.json({ msg: 'Whakapapa Works' }))

// @route   GET api/tree
// @desc
// @access  Public
//
// TODO: should session be true of false?
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  var passcode = req.user.passcode // This needs the user model updated to have a passcode.
  // When we're here req should have the user set.
  // We're gonna use the user's passcode to go find the correct tree, and then send it back as part of the response
  Whakapapa.findOneAndUpdate({ passcode })
    .then((whakapapa) => {
      if (whakapapa === null) {
        return new Whakapapa({ passcode, data: stringify({ name: req.user.name }) })
          .save()
      }

      return Promise.resolve(whakapapa)
    })
    .then(whakapapa => {
      res.json({ whakapapa })
    })
    .catch((err) => {
      console.log(err)
      res.ok()
    })
})

router.post('/', passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // When we're here req should have the user set.
    var passcode = req.user.passcode // This needs the user model updated to have a passcode.
    var whakapapa = req.body.data // this is a string created by flatted on the client. Can't parse it as json.

    // We're gonna use the user's passcode to go find the correct tree, and then send it back as part of the response
    Whakapapa.updateOne({ passcode }, { data: whakapapa })
      .then((whakapapa) => {
        res.sendStatus(200)
      })
      .catch(err => {
        console.log('error updating db ', err)
        res.sendStatus(500)
      })
  }
)
module.exports = router
