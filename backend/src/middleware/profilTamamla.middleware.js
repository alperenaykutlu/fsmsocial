// middleware/requireProfilTamamlandi.js
import AppError from '../utils/AppError.js'

const requireProfilTamamlandi = (req, res, next) => {
    if (!req.user?.profilTamamlandi)
        return next(new AppError(
            "Devam etmek için profilinizi tamamlayın",
            403,
            "PROFIL_INCOMPLETE"
        ))
    next()
}

export default requireProfilTamamlandi