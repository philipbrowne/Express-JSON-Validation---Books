process.env.NODE_ENV = 'test';

const e = require('express');
const request = require('supertest');

const app = require('../app');
const db = require('../db');

const Book = require('../models/book');

describe('Test Book class', () => {
  beforeEach(async () => {
    let b = await Book.create({
      isbn: '0691161518',
      amazon_url: 'http://a.co/eobPtX2',
      author: 'Matthew Lane',
      language: 'english',
      pages: 264,
      publisher: 'Princeton University Press',
      title: 'Power-Up: Unlocking the Hidden Mathematics in Video Games',
      year: 2017,
    });
  });
  test('can get all books', async () => {
    const response = await request(app).get('/books');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      books: [
        {
          isbn: '0691161518',
          amazon_url: 'http://a.co/eobPtX2',
          author: 'Matthew Lane',
          language: 'english',
          pages: 264,
          publisher: 'Princeton University Press',
          title: 'Power-Up: Unlocking the Hidden Mathematics in Video Games',
          year: 2017,
        },
      ],
    });
  });
  test('can get one book', async () => {
    let response = await request(app).get('/books/0691161518');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      book: {
        isbn: '0691161518',
        amazon_url: 'http://a.co/eobPtX2',
        author: 'Matthew Lane',
        language: 'english',
        pages: 264,
        publisher: 'Princeton University Press',
        title: 'Power-Up: Unlocking the Hidden Mathematics in Video Games',
        year: 2017,
      },
    });
  });
  test('returns 404 if book does not exist in db', async () => {
    let response = await request(app).get('/books/0691161514');
    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({
      error: {
        message: "There is no book with an isbn '0691161514",
        status: 404,
      },
      message: "There is no book with an isbn '0691161514",
    });
  });
  test('can add new book', async () => {
    let response = await await request(app).post('/books').send({
      isbn: '0142437239',
      amazon_url:
        'https://www.amazon.com/Quixote-Penguin-Classics-Cervantes-Saavedra/dp/0142437239?SubscriptionId=AKIAIOI3S2F7L5XAVOBA&tag=shanesherman-20&linkCode=xm2&camp=2025&creative=165953&creativeASIN=0142437239',
      author: 'Miguel de Cervantes',
      language: 'english',
      pages: 1072,
      publisher: 'Penguin Classics; Rev Ed edition',
      title: 'Don Quixote',
      year: 2003,
    });
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      book: {
        isbn: '0142437239',
        amazon_url:
          'https://www.amazon.com/Quixote-Penguin-Classics-Cervantes-Saavedra/dp/0142437239?SubscriptionId=AKIAIOI3S2F7L5XAVOBA&tag=shanesherman-20&linkCode=xm2&camp=2025&creative=165953&creativeASIN=0142437239',
        author: 'Miguel de Cervantes',
        language: 'english',
        pages: 1072,
        publisher: 'Penguin Classics; Rev Ed edition',
        title: 'Don Quixote',
        year: 2003,
      },
    });
  });
  test('returns error with incomplete request', async () => {
    let res1 = await await request(app).post('/books').send({
      isbn: '0142437239',
      amazon_url:
        'https://www.amazon.com/Quixote-Penguin-Classics-Cervantes-Saavedra/dp/0142437239?SubscriptionId=AKIAIOI3S2F7L5XAVOBA&tag=shanesherman-20&linkCode=xm2&camp=2025&creative=165953&creativeASIN=0142437239',
      author: 'Miguel de Cervantes',
      language: 'english',
      pages: 1072,
      publisher: 'Penguin Classics; Rev Ed edition',
      title: 'Don Quixote',
    });
    expect(res1.statusCode).toBe(400);
    let res2 = await await request(app).post('/books').send({
      amazon_url:
        'https://www.amazon.com/Quixote-Penguin-Classics-Cervantes-Saavedra/dp/0142437239?SubscriptionId=AKIAIOI3S2F7L5XAVOBA&tag=shanesherman-20&linkCode=xm2&camp=2025&creative=165953&creativeASIN=0142437239',
      author: 'Miguel de Cervantes',
      language: 'english',
      pages: 1072,
      publisher: 'Penguin Classics; Rev Ed edition',
      title: 'Don Quixote',
      year: 2003,
    });
    expect(res2.statusCode).toBe(400);
    let res3 = await await request(app).post('/books').send({
      isbn: '0142437239',
      amazon_url:
        'https://www.amazon.com/Quixote-Penguin-Classics-Cervantes-Saavedra/dp/0142437239?SubscriptionId=AKIAIOI3S2F7L5XAVOBA&tag=shanesherman-20&linkCode=xm2&camp=2025&creative=165953&creativeASIN=0142437239',
      author: 'Miguel de Cervantes',
      language: 'english',
      publisher: 'Penguin Classics; Rev Ed edition',
      title: 'Don Quixote',
      year: 2003,
    });
    expect(res3.statusCode).toBe(400);
  });
  test('can update book', async () => {
    const response = await request(app).put('/books/0691161518').send({
      author: 'Matthew Lane',
      language: 'English',
      pages: 264,
      title: 'Power-Up: Unlocking the Hidden Mathematics in Video Games',
      year: 2017,
    });
    expect(response.statusCode).toBe(200);
  });
  test('returns error when attempting to update book that doesnt exist', async () => {
    const response = await request(app).put('/books/wrong').send({
      isbn: '0691161518',
      amazon_url: 'http://a.co/eobPtX2',
      author: 'Matthew Lane',
      language: 'English',
      pages: 264,
      publisher: 'Princeton University Press',
      title: 'Power-Up: Unlocking the Hidden Mathematics in Video Games',
      year: 2017,
    });
    expect(response.statusCode).toBe(404);
  });
  test('returns error when attempting to make incomplete put request', async () => {
    const response = await request(app).put('/books/0691161518').send({
      isbn: '0691161518',
      amazon_url: 'http://a.co/eobPtX2',
      author: 'Matthew Lane',
      language: 'English',
      pages: 264,
      publisher: 'Princeton University Press',
      title: 'Power-Up: Unlocking the Hidden Mathematics in Video Games',
    });
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      error: {
        message: ['instance requires property "year"'],
        status: 400,
      },
      message: ['instance requires property "year"'],
    });
  });
  test('can delete book and returns 404 if book ID does not exist', async () => {
    const response = await request(app).delete('/books/0691161518');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'Book deleted',
    });
    const response2 = await request(app).delete('/books/0691161518');
    expect(response2.statusCode).toBe(404);
    expect(response2.body).toEqual({
      error: {
        message: "There is no book with an isbn '0691161518",
        status: 404,
      },
      message: "There is no book with an isbn '0691161518",
    });
  });
  afterEach(async () => {
    await db.query('DELETE FROM books');
  });
  afterAll(async () => {
    await db.end();
  });
});
