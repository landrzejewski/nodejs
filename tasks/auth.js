import passport from 'passport';
import {Strategy, ExtractJwt} from 'passport-jwt';

module.export = APP => {
    const Users = APP.db.models.Users;
    const cfg = APP.libs.config;
    const  params = {
        secretOrKey: cfg.jwtSecret,
        jwtFromRequest: ExtractJwt.fromAuthHeader()
    };
    const strategy = new Strategy(params, (payload, done) => {
        Users.findById(payload.id).then(user => {
            if (user) {
                return done(null, {
                    id: user.id,
                    email: user.email
                });
            }
            return done(null, false);
        }).catch(error => done(error, null));
    });
    passport.use(strategy);
    return {
        initialize: () => {
            return passport.initialize();
        },
        authenticate: () => {
            return passport.authenticate('jwt', cfg.jwtSession);
        }
    };
};