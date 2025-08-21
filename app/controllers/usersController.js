const { db } = require('../utils/firebaseAdmin')
const { logEvent } = require("../utils/logger")

async function addUser(req, res){
    try {
        const {
            name,
            email,
            phone,
            role, 
            type,           
            organizationName,
            organizationEmail,
            npi,
            providerId,
            tpaId,
        } = req.body;

        if(!name || !email || !phone || !role || !type || !organizationName || !organizationEmail){
            return res.status(400).json({error: "Missing required fields"});
        }

        const newUser = {
            name,
            email,
            phone,
            role, 
            type,           
            organizationName,
            organizationEmail,
            npi: npi || null,
            providerId: providerId || null,
            tpaId: tpaId || null,
        }

        const docRef = await db.collection('users').add(newUser);

        await docRef.update({ uid: docRef.id });

        await logEvent(
            "New User Created",
            { user: newUser.name, role: newUser.role, organizationName: organizationName },
            true
        );

        res.status(201).json({message: "New User Created", id: docRef.id});
    } catch(error) {
        console.error("Error creating new user:", error);
        res.status(500).json({ error: "Failed to create new user" })
    }
}

module.exports = { addUser }