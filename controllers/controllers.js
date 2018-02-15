

module.exports = {
    getCurrentUser: (req,res,next) => {
        console.log('getCurrentUser',req.user)
        const dbInstance = req.app.get('db')
        // let userid = req.session.passport.user.id
        dbInstance.find_session_user([2])
            .then(response => {
                res.status(200).send(response)
            })
    }
}