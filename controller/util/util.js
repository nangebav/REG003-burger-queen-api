module.exports = {
  validateEmail: (email) => {
    const emailRegex = /[\w._%+-]+@[\w.-]+/g;
    return emailRegex.test(email);
  },
  pagination: (response, url, page, limit, totalPages) => {
    const linkHeader = {
      first: `${url}?limit=${limit}&page=1`,
      prev: response.hasPrevPage ? `${url}?limit=${limit}&page=${page - 1}` : `${url}?limit=${limit}&page=${page}`,
      next: response.hasNextPage ? `${url}?limit=${limit}&page=${page + 1}` : `${url}?limit=${limit}&page=${page}`,
      last: `${url}?limit=${limit}&page=${totalPages}`,
    };
    return linkHeader;
  },
};
