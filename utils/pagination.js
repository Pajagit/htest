module.exports = {
  paginate: function({ page, pageSize }) {
    const offset = page * pageSize;
    const limit = Number(offset) + Number(pageSize);

    return {
      offset,
      limit
    };
  }
};
