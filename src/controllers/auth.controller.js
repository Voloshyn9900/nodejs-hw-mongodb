import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { registerUser } from '../services/auth.services.js';
import { User } from '../models/user.model.js';
import { Session } from '../models/session.model.js';
import createHttpError from 'http-errors';

export const registerController = async (req, res) => {
  const user = await registerUser(req.body);
  res.status(201).json({ status: 201, message: 'User created successfully', data: user });
};

export const loginController = async (req, res) => {
  // 1 есть ли такой юзер

  // const {} = req.body
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    throw createHttpError.Unauthorized(401, 'Email or password is wrong');
  }

  // 2 валидируем пароль

  const isPasswordCompared = await bcrypt.compare(req.body.password, user.password);

  if (!isPasswordCompared) {
    throw createHttpError.Unauthorized(401, 'Email or password is wrong');
  }
  // 3 проверяем и удаляем некорректную предидушие сессии

  await Session.findOneAndDelete({ userId: user._id });

  // 4 создаем сессию + access token + refresh token.

  const session = await Session.create({
    userId: user._id,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + 10 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  // 5 возврашяям юзера + cookie

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expire: session.refreshTokenValidUntil,
    // secure: process.env.NODE_ENV === "production",
  });

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expire: session.refreshTokenValidUntil,
  });

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: { accessToken: session.accessToken },
  });
};
