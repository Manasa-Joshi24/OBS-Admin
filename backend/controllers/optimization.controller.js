import { runOptimization } from '../services/optimizationService.js';

export const getAnalytics = async (req, res) => {
    try {
        const results = await runOptimization('analytics');
        res.status(200).json({
            success: true,
            data: results
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getFraudAnalysis = async (req, res) => {
    try {
        const results = await runOptimization('fraud');
        res.status(200).json({
            success: true,
            data: results
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAutocomplete = async (req, res) => {
    try {
        const { query } = req.query;
        const results = await runOptimization('autocomplete', [query]);
        res.status(200).json({
            success: true,
            data: results
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getSortedTransactions = async (req, res) => {
    try {
        const results = await runOptimization('sort');
        res.status(200).json({
            success: true,
            data: results
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
