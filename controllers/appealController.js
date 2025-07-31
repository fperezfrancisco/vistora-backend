const { db } = require('../utils/firebaseAdmin')
const { logEvent } = require('../utils/logger')

async function addAppeals(req, res){
    try {
        const {
            denialId,
            claimId,
            providerId,
            preparedBy,
            submittedAt,
            deadline,
            method,
            status,
            appealLetter,
            supportingDocs,
            result,
            resolutionDate,
        } = req.body;

        if(!denialId || !claimId) {
            return res.status(400).json({ error: "Missing required fields"});
        }

        const newAppeal = {
            denialId,
            claimId,
            providerId,
            preparedBy,
            submittedAt: new Date(submittedAt), // convert from string to Timestamp
            deadline: new Date(deadline),
            method,
            status,
            appealLetter,
            supportingDocs,
            result,
            resolutionDate: new Date(resolutionDate),
        };

        const docRef = await db.collection("appeals").add(newAppeal);

        await docRef.update({ appealId: docRef.id });

        await logEvent(
            "Appeal Created",
            { user: newAppeal.preparedBy, appealID: docRef.id },
            true
        );

        res.status(201).json({message: "Appeal Created", id: docRef.id});
    } catch(error) {
        console.error("Error creating appeal:", error);
        res.status(500).json({ error: "Failed to create appeal" })
    }
}

async function getAppeals(req, res){
    try {
        const { preparedBy, status } = req.query;

        let query = db.collection("appeals");

        if(preparedBy) {
            query = query.where("preparedBy", "==", preparedBy);
        }

        if(status){
            query = query.where("status", "==", status);
        }

        const snapshot = await query.get();

        const appeals = snapshot.docs.map(doc => ({
            appealID: doc.id,
            ...doc.data(),
        }));

        const user = preparedBy || "Unknown";

        await logEvent(
            "Appeals Fetched",
            { user: user, count: appeals.length },
            true
        );

        res.status(200).json(appeals);
    } catch(error) {
        console.error("Error fetching appeas:", error);
        res.status(500).json({ error: "Failed to fetch appeal" })
    }
}

module.exports = { addAppeals, getAppeals }