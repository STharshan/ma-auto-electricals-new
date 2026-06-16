import express from 'express';
import {
    getAllCategories,
    getServicesByCategory,
    getAllServices,
    getServiceById,
    createService,
    updateService,
    deleteService 
} from '../controllers/InvoiceController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// ── PUBLIC: read-only routes ──────────────────────────────────────
router.get('/all', getAllServices);
router.get('/categories', getAllCategories);
router.get('/category/:category', getServicesByCategory);
router.get('/:serviceId', getServiceById);

// ── ADMIN: protected write routes ─────────────────────────────────
router.post('/create', authMiddleware, createService);
router.put('/update/:serviceId', authMiddleware, updateService);
router.delete('/delete/:serviceId', authMiddleware, deleteService);

export default router;