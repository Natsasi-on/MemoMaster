const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware/checkAuth');
const noteController = require('../controllers/noteController');

router.get('/dashboard', isLoggedIn, noteController.maninPageNote);
router.get('/new-note', isLoggedIn, noteController.createNote);
router.post('/new-note', isLoggedIn, noteController.dashboardAddNoteSubmit);
router.get('/notes', isLoggedIn, noteController.allNotes);
router.get('/notes/item/:id', isLoggedIn, noteController.editNote);
router.put('/notes/item/:id', isLoggedIn, noteController.dashboardUpdateNote);
router.delete('/notes/item-delete/:id', isLoggedIn, noteController.deleteNote);


router.get('/search', isLoggedIn, noteController.searchNote);
router.post('/search', isLoggedIn, noteController.searchNoteSubmit);

module.exports = router;