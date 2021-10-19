process.env.NODE_ENV = 'test';

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
    let books = await Book.findAll();
    expect(books).toEqual([
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
    ]);
  });
  test('can get one book', async () => {
    let book = await Book.findOne('0691161518');
    expect(book).toEqual({
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
  test('can add new book', async () => {
    let newBook = await Book.create({
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
    expect(newBook).toEqual({
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
  });
  test('can update book', async () => {
    let newBook = await Book.create({
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
    let updatedBook = await Book.update('0142437239', {
      isbn: '0142437239',
      amazon_url:
        'https://www.amazon.com/Quixote-Penguin-Classics-Cervantes-Saavedra/dp/0142437239?SubscriptionId=AKIAIOI3S2F7L5XAVOBA&tag=shanesherman-20&linkCode=xm2&camp=2025&creative=165953&creativeASIN=0142437239',
      author: 'Miguel de Cervantes',
      language: 'spanish',
      pages: 1072,
      publisher: 'Penguin Classics; Rev Ed edition',
      title: 'Don Quixote',
      year: 2003,
    });
    expect(updatedBook).toEqual({
      isbn: '0142437239',
      amazon_url:
        'https://www.amazon.com/Quixote-Penguin-Classics-Cervantes-Saavedra/dp/0142437239?SubscriptionId=AKIAIOI3S2F7L5XAVOBA&tag=shanesherman-20&linkCode=xm2&camp=2025&creative=165953&creativeASIN=0142437239',
      author: 'Miguel de Cervantes',
      language: 'spanish',
      pages: 1072,
      publisher: 'Penguin Classics; Rev Ed edition',
      title: 'Don Quixote',
      year: 2003,
    });
  });
  test('can delete existing book', async () => {
    await Book.remove('0691161518');
    let books = await Book.findAll();
    expect(books).toEqual([]);
  });
  afterEach(async () => {
    await db.query('DELETE FROM books');
  });
  afterAll(async () => {
    await db.end();
  });
});
