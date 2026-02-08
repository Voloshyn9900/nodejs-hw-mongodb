// import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import createHttpError from 'http-errors';
import { User } from '../models/user.model.js';
import { Session } from '../models/session.model.js';

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