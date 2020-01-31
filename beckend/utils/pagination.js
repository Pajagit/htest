module.exports = {
  paginate: function({ page, pageSize }) {
    const offset = (page - 1) * pageSize;
    const limit = Number(pageSize);

    return {
      offset,
      limit
    };
  }
};
