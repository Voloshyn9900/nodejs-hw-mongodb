import * as fs from 'node:fs';
import path from 'node:path';

import bcrypt from 'bcrypt';
import crypto from 'crypto';
import createHttpError from 'http-errors';
import { User } from '../models/user.model.js';
import { Session } from '../models/session.model.js';
import jwt from 'jsonwebtoken';
import Handlebars from 'handlebars';
import { getEnvVar } from '../utils/getEnvVar.js';
import { sendMail } from '../utils/sendMail.js';

const createSession = () => {
  const accessToken = crypto.randomBytes(30).toString('base64');
  const refreshToken = crypto.randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + 10 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
  };
};

export async function registerUserServices(payload) {
  const user = await User.findOne({ email: payload.email });

  if (user !== null) {
    throw new createHttpError.Conflict('Email is already in use');
  }
  payload.password = await bcrypt.hash(payload.password, 10);
  return User.create(payload);
}

export async function loginUserServices({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError.Unauthorized(401, 'Email or password is wrong');
  }
  const isPasswordCompared = await bcrypt.compare(password, user.password);
  if (!isPasswordCompared) {
    throw createHttpError.Unauthorized(401, 'Email or password is wrong');
  }

  await Session.findOneAndDelete({ userId: user._id });

  const session = await Session.create({
    userId: user._id,
    ...createSession(),
  });

  return session;
}

// src/services/auth.js

/* Інший код файлу */

export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  const session = await Session.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isSessionTokenExpired = new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }

  const newSession = createSession();

  await Session.deleteOne({ _id: sessionId, refreshToken });

  return await Session.create({
    userId: session.userId,
    ...newSession,
  });
};
export const logoutUserService = async sessionId => {
  await Session.deleteOne({ _id: sessionId });
};

export async function sendResetPasswordService(email) {
  const user = await User.findOne({ email });

  if (user === null) {
    throw new createHttpError(404, 'User not found');
  }

  const token = jwt.sign(
    {
      sub: user._id,
      name: user.name,
    },
    getEnvVar('JWT_SECRET'),
    {
      expiresIn: '30m',
    }
  );

  const resetLink = `${getEnvVar('APP_DOMAIN')}/reset-password?token=${encodeURIComponent(token)}`;
  console.log(resetLink);

  const RESET_PASSWORD_TEMPLATE = fs.readFileSync(
    path.resolve('src', 'templates', 'reset-password.hbs'),
    'utf-8'
  );

  const template = Handlebars.compile(RESET_PASSWORD_TEMPLATE);

  // Рендерим handlebars-шаблон src/templates/reset-password.hbs
  const html = template({
    link: resetLink,
    name: user.name,
    email: user.email,
  });

  try {
    const info = await sendMail({
      to: user.email,
      subject: 'Reset your password',
      html,
    });

    //  console.log('MAIL SENT:', info.messageId, info.response);

    if (!info) {
      throw new Error('sendMail returned empty result');
    }
  } catch {
    throw createHttpError(500, 'Failed to send the email, please try again later.');
  }
}

export async function resetPasswordService(password, token) {
  try {
    const decoded = jwt.verify(token, getEnvVar('JWT_SECRET'));

    const user = await User.findById(decoded.sub);
    console.log(user);
    console.log(password);

    if (user === null) {
      throw new createHttpError.NotFound('User not found');
    }

    const hashedPassword = (password = await bcrypt.hash(password, 10));
    console.log(hashedPassword);

    await User.findByIdAndUpdate(user._id, { password: hashedPassword });
    console.log('The password has been changed successfully.');

    // await Session.deleteOne({ _id: sessionId });
    await Session.findOneAndDelete({ userId: user._id });

    console.log('The old session was deleted');
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      throw createHttpError.Unauthorized('Token is expired or invalid.');
    }
    // if (error.name === 'JsonWebTokenError') {
    //   throw new createHttpError.Unauthorized('Token is unauthorized');
    // }
    // if (error.name === 'TokenExpiredError') {
    //   throw new createHttpError.Unauthorized('Token is expired');
    // }
    // throw error;
  }
}
