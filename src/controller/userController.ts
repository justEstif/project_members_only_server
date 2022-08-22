import { RequestHandler, Request, Response, NextFunction } from "express"
import { body, validationResult } from "express-validator"
import passport from "passport"
import User from "../models/user"

// NOTE: Display all messages with user, and sort decreasing
export const index: RequestHandler = (_, res) => {
  res.render("NOT IMPLEMENTED: Home list")
}

export const sign_up_get: RequestHandler = (_, res) => {
  res.render("sign_up_form", { title: "Sign Up" })
}

export const sign_up_post = [
  body("firstName").trim().escape(),
  body("lastName").trim().escape(),
  body("email")
    .trim()
    .escape()
    .exists()
    .withMessage("Email is required")
    .normalizeEmail()
    .isEmail()
    .custom(async (value) => {
      const user = await User.findOne({ email: value })
      if (user) {
        return Promise.reject("E-mail already in use")
      }
      return true
    }),
  body("password").trim().escape().exists().withMessage("Password is required"),
  body("confirmPassword")
    .trim()
    .escape()
    .exists()
    .custom((value, { req }) => req.body.password === value)
    .withMessage("Passwords don't match."),

  (req: Request, res: Response, next: NextFunction) => {
    const user = new User({
      email: req.body.email,
      password: req.body.password,
      ...(req.body.firstName !== "" && { firstName: req.body.firstName }),
      ...(req.body.lastName !== "" && { lastName: req.body.lastName }),
    })
    const errors = validationResult(req)
    switch (!errors.isEmpty()) {
      case true:
        res.render("sign_up_form", {
          title: "Sign Up",
          errors: errors.array(),
          user: user,
        })
        return
      default:
        user.save((err) => {
          if (err) return next(err)
          else {
            req.login(user, (err) => {
              if (err) return next(err)
              else res.redirect("/")
            })
          }
        })
    }
  },
]

export const sign_in_get: RequestHandler = (req, res) => {
  req.isAuthenticated() ? res.redirect("/") : res.render("sign_in_form", { title: "Sign In" })
}

export const sign_in_post = [
  body("email")
    .trim()
    .escape()
    .exists()
    .withMessage("Email is required")
    .normalizeEmail()
    .isEmail()
    .withMessage("Invalid Email"),
  body("password").trim().escape().exists().withMessage("Password is required"),

  (req: Request, res: Response, _: NextFunction) => {
    const errors = validationResult(req)
    switch (!errors.isEmpty()) {
      case true:
        res.render("sign_in_form", {
          title: "Sign In",
          errors: errors.array(),
        })
        return
      default:
        passport.authenticate("local", {
          successRedirect: "/",
          failureRedirect: "/sign-in",
        })
    }
  },
]

export const sign_out_get: RequestHandler = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err)
    } else {
      res.redirect("/")
    }
  })
}

export const join_club_get: RequestHandler = (_, res) => {
  res.render("join_club")
}

export const join_club_post: RequestHandler = (_, res) => {
  res.render("join_club")
}

export const be_admin_get: RequestHandler = (_, res) => {
  res.render("be_admin")
}

export const be_admin_post: RequestHandler = (_, res) => {
  res.render("be_admin")
}
