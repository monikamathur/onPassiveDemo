var express = require('express');
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var router = express.Router();
const User = require('../modals/user');
/* GET users listing. */
router.get('/', function (req, res, next) {
  User.find({}, 'name age', function (err, user) {
    if (err) return err;
    console.log("***", user)
    res.status(200).send(user)
    // 'athletes' contains the list of athletes that match the criteria.
  })

});

/**
* @method - POST
* @param - /signup
* @description - User SignUp
*/
router.post('/signup', [
  check("firstName", "Please Enter a Valid first name").not().isEmpty(),
  check("lastName", "Please Enter a Valid Last Name").not().isEmpty(),
  check("username", "Please Enter a Valid Username").not().isEmpty(),
  check("email", "Please enter a valid email").isEmail(),
  check("password", "Please enter a valid password").isLength({
    min: 6
  })
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }
  try {
    let email = req.body.email;

    let user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({
        msg: "User already exist"
      })
    }
    const userDataObj = {
      firstName: req.body.firstName,
      lastName: req.body.firstName,
      email: req.body.email,
      account: {
        username: req.body.username,
        password: req.body.password
      }
    }
    let userData = new User(userDataObj)
    const salt = await bcrypt.genSalt(10)
    userData.account.password = await bcrypt.hash(userData.account.password, salt)
    await userData.save();

    const payload = {
      user: {
        id: userData._id
      }
    }
    jwt.sign(payload,
      "mySecretKey", {
      expiresIn: 10000
    },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({
          token
        });
      }
    );
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Error in Saving");
  }
});

router.post('/login', [
  check("username", "Please enter user name").not().isEmpty(),
  check("password", "Please enter valid password").isLength({ min: 6 })
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      errors: errors.array()
    })
  }
  try {

    const {username, password} = req.body;
    let user = await User.findOne({ 'account.username' :  username})
    if(!user){
      res.status(404).json({msg: "User not found"})
    }

    let isMatch = await bcrypt.compare(password, user.account.password);

    if(!isMatch) {
      res.status(400).json({msg: "Incorrect password"})
    }
    const payload = {
      id : user._id
    }
    jwt.sign(payload,
      "mySecretKey", {
      expiresIn: 10000
    },(err, token) => {
      if (err) throw err;
      res.status(200).json({
        token
      });

    })
  } catch (err) {
    res.status(500).json({ msg: "Internel server error" })
  }
})
module.exports = router;
