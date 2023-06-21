const {
    Router
} = require('express');
const router = Router();
const Reservation = require('../database/schemas/Reservation');

//use this to check if user is logged in
router.use((req, res, next) => {
    if (req.session.user) {
        console.log(req.session.user);
        next();
    } else if (req.session.admin) {
        console.log(req.session.admin);
        next();
    } else {
        res.status(401).json({
            message: "Unauthorized"
        });
    }
});

// get all reservations
router.get('/', async (req, res) => {
    try {
        const reservations = await Reservation.find();
        res.json(reservations);
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
        const reservation = await Reservation.findOne({
            name: name
        });
        if (reservation) {
            res.json(reservation);
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
})

// create one reservation
router.post('/', async (req, res) => {
    const reservation = new Reservation({
        from_date: req.body.from_date,
        to_date: req.body.to_date,
        user: req.body.user,
        airbnb: req.body.airbnb,
        estimated_amount: req.body.estimated_amount,
        difference_in_nights: req.body.difference_in_nights,
    });
    try {
        const savedReservation = await reservation.save();
        res.status(201).json({
            message: "Reservation created successfully",
            reservation: savedReservation
        });
    } catch (err) {
        res.status(400).json({
            message: err.message
        });
    }
});

// update one reservation
router.patch('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const updatedReservation = await Reservation.updateOne({
            _id: id
        }, {
            $set: {
                from_date: req.body.from_date,
                to_date: req.body.to_date,
                user: req.body.user,
                airbnb: req.body.airbnb,
                estimated_amount: req.body.estimated_amount,
                difference_in_nights: req.body.difference_in_nights,
            }
        });
        res.json(updatedReservation);
    } catch (err) {
        res.json({
            message: err
        });
    }
}
);

// delete one reservation
router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const removedReservation = await Reservation.deleteOne({
            _id: id
        });
        res.json(removedReservation);
    } catch (err) {
        res.json({
            message: err
        });
    }
}
);

module.exports = router;