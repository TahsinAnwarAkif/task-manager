import {DEFAULT_PAGE_LIMIT} from '../utils/constants.js';

export const advancedResults = (model, loggedInUserOnly, ...populate) => async(req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || DEFAULT_PAGE_LIMIT;
  const startIndex = limit * (page - 1);
  const endIndex = limit * page;

  const splittedReqQuery = {...req.query};
  
  if(loggedInUserOnly){
    splittedReqQuery.user = req.user._id;
  }

  const fieldsToBeRemoved = ['select', 'sort', 'page', 'limit'];
  fieldsToBeRemoved.forEach(param => delete splittedReqQuery[param]);
  
  let splittedReqQueryStr = JSON.stringify(splittedReqQuery);
  splittedReqQueryStr = splittedReqQueryStr.replace(/\b()\b(gt|gte|lt|lte|in)/g, match => `$${match}`);
  
  let query = model.find(JSON.parse(splittedReqQueryStr));
  
  if(populate && populate.length !== 0){
    populate.forEach(p => query = query.populate(p));
  }
  
  if(req.query.select){
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
    
    if(fields.includes('user')){
      query = query.populate('user', 'name email');
    }
  }
  
  if(req.query.sort){
    const fields = req.query.sort.split(',').join(' ');
    query = query.sort(fields);
  }else{
    query = query.sort('-createdAt');
  }
  
  query = await query.skip(startIndex).limit(limit);

  let countFilter = {};

  if(loggedInUserOnly){
    countFilter.user = req.user._id;
  }
  
  const totalCount = await model.countDocuments(countFilter);
  
  const pagination = {};
  
  if(endIndex < totalCount){
    pagination.next = {
      page: page + 1,
      limit
    }
  }
  
  if(startIndex > 0){
    pagination.prev = {
      page: page - 1,
      limit
    }
  }
  
  res.advancedResults = {
    success: true,
    dataCount: query.length,
    totalCount,
    pagination,
    data: query
  }
  
  next();
}
