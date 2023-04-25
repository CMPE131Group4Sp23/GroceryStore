const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

function initialize(passport, connection)
{
    const authenticateUser = async (email, password, done) => {
        connection.query('SELECT * FROM users WHERE email = ?',[email], async function(error, results, fields) {
            try {
                if (error) return done(error);

                if (results.length == 0)
                {
                    return done(null, false, { message: 'No user with that email' });
                }

                user = results[0];
                if (await bcrypt.compare(password, user.password))
                {
                    return done(null, user);
                }
                else
                {
                    return done(null, false, { message: 'Password incorrect'});
                }
            }
            catch(e)
            {
                return done(e);
            }
        })
        
    }
    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));
    passport.serializeUser((user,done) => 
    {
        done(null, user.userid);
    });
    passport.deserializeUser((id, done) => {
        connection.query('SELECT * FROM users WHERE userid = ?', [id], function(error, results) {
            if (results.length == 0) done(error);
            done(null, results[0]);
        });
    });
}

module.exports = initialize;