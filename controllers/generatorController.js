const { getPayerTemplate, getAppealTemplate } = require("../utils/Templates")

async function usePayerTemplate(req, res) {
    try {
        const { payer } = req.query;

        if(!payer) {
            return res.status(400).json({ error: "Missing payer name"});
        }

        const template = getPayerTemplate(payer);

        if(!template) {
            return res.status(404).json({ error: "Template not found for given payer"});
        }

        res.status(200).json({ template });
    } catch(error) {
        console.error("Error retrieving payer template:", error);
        res.status(500).json({ error: "Server error retrieving template"});
    }
}

async function useAppealTemplate(req, res) {
    try {
        const { cptCode, denialReason } = req.query;

        if(!cptCode || !denialReason) {
            return res
            .status(400)
            .json({ error: "Missing required query parameters: cptCode or denialReason"});
        }

        const template = getAppealTemplate(cptCode, denialReason);

        if(!template) {
            return res.status(404).json({ error: "No template found for the given CPT code and denial reason"});
        }

        res.status(200).json({ template });
    } catch(error) {
        console.error("Error fetching appeal template:", error);
        res.status(500).json({ error: "Failed to fetch appeal template"});
    }
}

module.exports = { usePayerTemplate, useAppealTemplate };