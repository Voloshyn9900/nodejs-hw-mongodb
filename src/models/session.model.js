import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  accessToken: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
  accessTokenValidUntil: {
    type: Date,
    required: true,
  },
  refreshTokenValidUntil: {
    type: Date,
    required: true,
  },
});

export const Session = mongoose.model('session', sessionSchema);

// Створіть модель Session з такими полями:

// userId - string, required
// accessToken - string, required
// refreshToken - string, required
// accessTokenValidUntil - Date, required
// refreshTokenValidUntil - Date, required

// {
//   "_id": {
//     "$oid": "682a297c12ad3c19beeece98"
//   },
//   "name": "Maria Petrenko",
//   "phoneNumber": "+380000000008",
//   "email": null,
//   "isFavourite": false,
//   "contactType": "personal",
//   "createdAt": "2024-05-08T16:12:14.954196",
//   "updatedAt": "2024-05-08T16:12:14.954198"
// }