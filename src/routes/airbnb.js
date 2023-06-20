const { Router } = require('express');
const router = Router();
const Airbnb = require('../database/schemas/Airbnb');


router.use((req, res, next) => {
    if (req.session.user) {
        console.log(req.session.user);
        next();
    }
    else if (req.session.admin) {
        console.log(req.session.admin);
        next();
    }
    else {
        res.status(401).json({
            message: "Unauthorized"
        });
    }
});


// get all airbnbs
router.get('/', async (req, res) => {
    try {
        const airbnbs = await Airbnb.find();
        res.json(airbnbs);
    } catch (err) {
        res.json({
            message: err
        });
    }
});

// get by name
router.get('/:name', async (req, res) => {
    const name = req.params.name;
    try {
        const airbnb = await Airbnb.findOne({
            name: name
        });
        if (airbnb) {
            res.json(airbnb);
        } else {
            res.status(404).json({
                message: "Not found"
            });
        }
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});

// create one airbnb
// create one airbnb
router.post('/', async (req, res) => {
    const airbnb = new Airbnb({
        name: req.body.name,
        location: req.body.location,
        price: req.body.price,
        beds: req.body.beds,
        category: req.body.category,
        description: req.body.description,
        admin: req.session.admin._id // Link the admin's ObjectId to the 'admin' field
    });
    try {
        const savedAirbnb = await airbnb.save();
        res.json(savedAirbnb);
    } catch (err) {
        res.json({
            message: err
        });
    }
});


// update one airbnb
router.put('/:name', async (req, res) => {
    const name = req.params.name;
    try {
        const updatedAirbnb = await Airbnb.updateOne({
            name: name
        }, {
            $set: {
                name: req.body.name,
                location: req.body.location,
                price: req.body.price,
                beds: req.body.beds,
                category: req.body.category,
                description: req.body.description
            }
        });
        res.json(updatedAirbnb);
    } catch (err) {
        res.json({
            message: err
        });
    }
});

// delete one airbnb
router.delete('/:name', async (req, res) => {
    const name = req.params.name;
    try {
        const removedAirbnb = await Airbnb.findOneAndDelete({
            name: name
        });
        if (removedAirbnb) {
            res.json(removedAirbnb);
        } else {
            res.status(404).json({
                message: "Not found"
            });
        }
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});



module.exports = router;