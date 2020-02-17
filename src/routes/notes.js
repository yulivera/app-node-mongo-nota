const express = require('express');
const router = express.Router();

const Note = require('../models/Note');
// Autenticacion, si esta logeado o no
const { isAuthenticated } = require('../helpers/auth');

// agregar nota
router.get('/notes/add', isAuthenticated, (req, res) => {
	res.render('notes/new-note');
});

// resivir datos nota
router.post('/notes/new-note', isAuthenticated, async (req, res) => {
	const { title, description } = req.body;
	const errors = [];
	if(!title) {
		errors.push({text: 'Por favor escribir un titulo'});
	}
	if(!description) {
		errors.push({text: 'Escribir una descripcion'});
	}
	if(errors.length > 0) {
		res.render('notes/new-note', {
			errors,
			title,
			description
		});
	} else {
		// guardar en baseDatos
		const newNote = new Note({ title, description });
		// console.log(newNote);
		// relacionar user con su nota
		newNote.user = req.user.id;
		await newNote.save();
		req.flash('success_msg', 'Nota Agregada Satisfatoriamente');
		res.redirect('/notes');
		// res.send('ok');
	}
});

// mostrar todas las notas
router.get('/notes', isAuthenticated, async (req, res) => {
	// res.send('todas las notas');
	const notes = await Note.find({user: req.user.id}).sort({date: 'desc'});
	// console.log(notes);
	res.render('notes/all-notes', { notes });
});

// Editar nota
router.get('/notes/edit/:id', isAuthenticated, async (req, res) => {
  const note = await Note.findById(req.params.id);
	res.render('notes/edit-note', {note});
});

router.put('/notes/edit-note/:id',isAuthenticated, async (req, res) => {
	const {title , description} = req.body;
	await Note.findByIdAndUpdate(req.params.id, {title, description});
	req.flash('success_msg', 'Nota actualizada');
	res.redirect('/notes');
});

// Eliminar
router.delete('/notes/delete/:id',isAuthenticated, async (req, res) => {
	await Note.findByIdAndDelete(req.params.id);
	req.flash('success_msg', 'Nota Eliminada');
	res.redirect('/notes');
});

module.exports = router;