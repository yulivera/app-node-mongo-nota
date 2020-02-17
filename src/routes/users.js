const express = require('express');
const router = express.Router();

const User = require('../models/User');

const passport = require('passport');

router.get('/users/signin', (req, res) => {
	res.render('users/signin');
});

router.post('/users/signin', passport.authenticate('local', {
	successRedirect: '/notes',
	failureRedirect: '/users/signin',
	failureFlash: true
}));

router.get('/users/signup', (req, res) => {
	res.render('users/signup');
});

// resivir datos
router.post('/users/signup', async (req, res) => {
	const { name, email, password, confirm_password} = req.body;
	const errors = [];
	// console.log(req.body);
	if(name.length<=0){
		errors.push({text: 'Por Favor Insertar un nombre'});
	}
	// Verificar contraseña
	if(password != confirm_password) {
		errors.push({text: 'Las contraseña no coincide'});
	}
	if (password.length<4){
		errors.push({text: 'la contraseña Debe ser mayor a 4 caracteres'});
	}
	if(errors.length>0){
		res.render('users/signup', {errors, name, email, password, confirm_password});
	}else{
		// Email Ya registrado
		const emailUser = await User.findOne({email: email});
		if(emailUser){
			req.flash('success_msg','El email esta en uso');
			res.redirect('/users/signup');
		}
		const newUser =  new User({name, email, password});
		newUser.password = await newUser.encryptPassword(password);
		await newUser.save();
		req.flash('Registrado Correctamente');
		res.redirect('/users/signin');
	}
});

// cerrar session
router.get('/users/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

module.exports = router;