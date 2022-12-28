const { nanoid } = require('nanoid');
const library = require('./books');

const addNewBook = (request, responseHelper) => {
  const {
    title, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  if (title === undefined) {
    const response = responseHelper.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);

    return response;
  }

  if (pageCount < readPage) {
    const response = responseHelper.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);

    return response;
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = (pageCount === readPage);
  const newBook = {
    id,
    title,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  library.push(newBook);

  const success = library.filter((book) => book.id === id).length > 0;

  if (success) {
    const response = responseHelper.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);

    return response;
  }

  const response = responseHelper.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);

  return response;
};

const getAllBooks = (request, responseHelper) => {
  const { title, reading, finished } = request.query;

  let filteredBooks = library;

  if (title !== undefined) {
    filteredBooks = filteredBooks.filter((book) => book
      .title.toLowerCase().includes(title.toLowerCase()));
  }

  if (reading !== undefined) {
    filteredBooks = filteredBooks.filter((book) => book.reading === !!Number(reading));
  }

  if (finished !== undefined) {
    filteredBooks = filteredBooks.filter((book) => book.finished === !!Number(finished));
  }

  const response = responseHelper.response({
    status: 'success',
    data: {
      books: filteredBooks.map((book) => ({
        id: book.id,
        title: book.title,
        publisher: book.publisher,
      })),
    },
  });
  response.code(200);

  return response;
};

const getBookById = (request, responseHelper) => {
  const { id } = request.params;
  const book = library.filter((b) => b.id

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);

  return response;
};
const editBookById = (request, responseHelper) => {
  const { id } = request.params;
  const {
    title, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();
  const index = library.findIndex((book) => book.id === id);

  if (index !== -1) {
    if (title === undefined) {
      const response = responseHelper.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      });
      response.code(400);

      return response;
    }

    if (pageCount < readPage) {
      const response = responseHelper.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);

      return response;
    }

    const updatedBook = {
      id,
      title,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished: (pageCount === readPage),
      reading,
      insertedAt: library[index].insertedAt,
      updatedAt,
    };

    library[index] = updatedBook;

    const response = responseHelper.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
      data: {
        bookId: id,
      },
    });
    response.code(200);

    return response;
  }

  const response = responseHelper.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);

  return response;
};

const deleteBookById = (request, responseHelper) => {
  const { id } = request.params;
  const index = library.findIndex((book) => book.id === id);

  if (index !== -1) {
    library.splice(index, 1);

    const response = responseHelper.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);

    return response;
  }

  const response = responseHelper.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);

  return response;
};

module.exports = {
  addNewBook,
  getAllBooks,
  getBookById,
  editBookById,
  deleteBookById,
};
