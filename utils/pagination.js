module.exports = {
  paginate: function({ page, pageSize }) {
    const offset = page * pageSize;
    const limit = Number(pageSize);

    return {
      offset,
      limit
    };
  }
};
