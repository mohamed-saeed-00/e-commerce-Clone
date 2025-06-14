class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  filter() {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const queryStringObj = { ...this.queryString };
    const fixedQuery = ["sort", "page", "limit", "fields", "keyword"];
    fixedQuery.forEach((field) => delete queryStringObj[field]);

    // apply [gte,gt,lte,lt] on filter
    let queryStr = JSON.stringify(queryStringObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (val) => `$${val}`);
    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));

    return this;
  }

  //sorting feature
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("createdAt");
    }
    return this;
  }

  // fields feature
  fields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }

  search(moduleName) {
    // search feature
    if (this.queryString.keyword) {
      // eslint-disable-next-line prefer-const
      let searchQuery = {};
      if (moduleName === "Products") {
        searchQuery.$or = [
          { title: { $regex: this.queryString.keyword, $options: "i" } },
          { description: { $regex: this.queryString.keyword, $options: "i" } },
        ];
      } else {
        searchQuery = {
          name: { $regex: this.queryString.keyword, $options: "i" },
        };
      }
      this.mongooseQuery = this.mongooseQuery.find(searchQuery);
    }
    return this;
  }

  // pagination
  paginate(documentsCount) {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;

    const pagination = {};

    pagination.currentPage = page;
    pagination.currentLimit = limit;
    pagination.numberOfPages = Math.ceil(documentsCount / limit);

    if (endIndex < documentsCount) {
      pagination.next = page + 1;
    }
    if (skip > 0) {
      pagination.prev = page - 1;
    }

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    this.paginationResult = pagination;
    return this;
  }
}

module.exports = ApiFeatures;
