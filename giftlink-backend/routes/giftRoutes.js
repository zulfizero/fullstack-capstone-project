router.get('/', async (req, res) => {
    try {
        // ✅ Task 1: Connect to MongoDB and store connection to db constant
        const db = await connectToDatabase();

        // ✅ Task 2: use the collection() method to retrieve the gift collection
        const collection = db.collection('gifts');

        // ✅ Task 3: Fetch all gifts using the collection.find method. Chain with toArray method
        const gifts = await collection.find({}).toArray();

        // ✅ Task 4: return the gifts using the res.json method
        res.json(gifts);
    } catch (e) {
        console.error('Error fetching gifts:', e);
        res.status(500).send('Error fetching gifts');
    }
});

// GET gift by ID
router.get('/:id', async (req, res) => {
    try {
        // ✅ Task 1: Connect to MongoDB
        const db = await connectToDatabase();

        // ✅ Task 2: Retrieve collection
        const collection = db.collection('gifts');

        const id = parseInt(req.params.id); // Convert string to number

        // ✅ Task 3: Find gift by ID
        const gift = await collection.findOne({ id: id });

        if (!gift) {
            return res.status(404).send('Gift not found');
        }

        res.json(gift);
    } catch (e) {
        console.error('Error fetching gift:', e);
        res.status(500).send('Error fetching gift');
    }
});

// POST add a new gift
router.post('/', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('gifts');
        const result = await collection.insertOne(req.body);

        res.status(201).json(result.ops[0]); // Return the created gift
    } catch (e) {
        next(e);
    }
});

module.exports = router;