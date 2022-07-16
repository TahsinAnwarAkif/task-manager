import request from "supertest";
import express from 'express';
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import {app} from '../app.js';
import User from '../models/User.js';

let user1, user1Password, user1Token;

beforeEach(async () => {
  await User.deleteMany();

  user1Password = 'akif';
  user1 = new User({
      name: 'akif',
      email: "akif@gmail.com",
      password: user1Password
    });

  await user1.save();

  user1Token = user1.getGeneratedToken();
});

test('Should register user correctly', async () => {
  await request(app)
    .post('/api/v1/auth/register')
    .send({
      name: 'rafi',
      email: 'rafi@gmail.com',
      password: 'rafi'
    })
    .expect(201);
});

test('Should login user correctly', async () => {  
  await request(app)
    .post('/api/v1/auth/login')
    .send({
      email: user1.email,
      password: user1Password
    })
    .expect(200);
});

test('Should not login non-existing user', async () => {  
  await request(app)
    .post('/api/v1/auth/login')
    .send({
      email: 'akif@gmail.com',
      password: 'akif2'
    })
    .expect(401);
});

test('Should get profile for user', async () => {  
  await request(app)
    .get('/api/v1/auth/me')
    .set('Authorization', `Bearer ${user1Token}`)
    .send()
    .expect(200);
});

test('Should not get profile for unauthenticated user', async () => {  
  await request(app)
    .get('/api/v1/auth/me')
    .send()
    .expect(401);
});