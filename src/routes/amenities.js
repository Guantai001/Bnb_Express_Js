const {Router} = require('express');
const router = Router();
const Amenity = require('../database/schemas/Amenities');


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
}
);

// get all amenities
router.get('/', async (req, res) => {
    try {
        const amenities = await Amenity.find();
        res.json(amenities);
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
        const amenity = await Amenity.findOne({
            name: name
        });
        if (amenity) {
            res.json(amenity);
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
}
);

// create one amenity
router.post('/', async (req, res) => {
    const amenity = new Amenity({
        item1: req.body.item1,
        item2: req.body.item2,
        item3: req.body.item3,
        item4: req.body.item4,
        item5: req.body.item5,
        item6: req.body.item6,
        airbnb: req.body.airbnb
    });
    try {
        const savedAmenity = await amenity.save();
        res.status(201).json(savedAmenity);
    } catch (err) {
        res.status(400).json({
            message: err.message
        });
    }
}
);

// update one amenity
router.patch('/:name', async (req, res) => {
    const name = req.params.name;
    try {
        const amenity = await Amenity.findOne({
            name: name
        });
        if (amenity) {
            if (req.body.item1) {
                amenity.item1 = req.body.item1;
            }
            if (req.body.item2) {
                amenity.item2 = req.body.item2;
            }
            if (req.body.item3) {
                amenity.item3 = req.body.item3;
            }
            if (req.body.item4) {
                amenity.item4 = req.body.item4;
            }
            if (req.body.item5) {
                amenity.item5 = req.body.item5;
            }
            if (req.body.item6) {
                amenity.item6 = req.body.item6;
            }
            const updatedAmenity = await amenity.save();
            res.json(updatedAmenity);
        } else {
            res.status(404).json({
                message: "Not found"
            });
        }
    } catch (err) {
        res.status(400).json({
            message: err.message
        });
    }
}
);

// delete one amenity
router.delete('/:name', async (req, res) => {
    const name = req.params.name;
    try {
        const removedAmenity = await Amenity.deleteOne({
            name: name
        });
        res.json(removedAmenity);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}
);

module.exports = router;