const handleDeleteUser = (req, res, db) => {
	const { id } = req.body;

	db('users')
		.where('id', '=', id)
		.del()
		.returning('email')
		.then(loginEmail => {
			db('login')
				.where('email', '=', loginEmail[0])
				.del()
				.returning('email')
				.then(data => res.status(200).josn('success'))
				.catch(err => res.status(400).json(err));
		})
}

module.exports = {
	handleDeleteUser: handleDeleteUser
}