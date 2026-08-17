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
import requireAdmin from '../middleware/requireAdmin.js';

const router = express.Router();

// ── PUBLIC: read-only routes ──────────────────────────────────────
router.get('/all', getAllServices);
router.get('/categories', getAllCategories);
router.get('/category/:category', getServicesByCategory);
router.get('/:serviceId', getServiceById);

// ── ADMIN: protected write routes ─────────────────────────────────
router.post('/create', authMiddleware, requireAdmin, createService);
router.put('/update/:serviceId', authMiddleware, requireAdmin, updateService);
router.delete('/delete/:serviceId', authMiddleware, requireAdmin, deleteService);

export default router;
