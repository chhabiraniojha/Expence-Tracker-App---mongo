const Expence = require('../models/Expence');
const User = require('../models/User');
const ExpenceReport = require('../models/ExpenceReport');
const AWS = require('aws-sdk');

// Add expense
exports.addExpence = async (req, res, next) => {
  const { expenceAmount, expenceDescription, expenceCategory } = req.body;
  const userId = req.user.id;
  const prevExpence = Number(req.user.totalExpence);
  const newExpence = prevExpence + Number(expenceAmount);

  try {
    // Create expense
    const expense = await Expence.create({ expenceAmount, expenceDescription, expenceCategory, userId });

    // Update total expense for the user
    await User.updateOne({ _id: userId }, { totalExpence: newExpence });

    res.status(200).json("Expense added");
  } catch (error) {
    res.json(error);
  }
}

// Get all expenses
exports.getExpence = async (req, res, next) => {
  try {
    const expenses = await Expence.find({ userId: req.user.id });
    return res.json(expenses);
  } catch (error) {
    return res.json(error);
  }
}

// Delete expense
exports.deleteExpence = async (req, res, next) => {
  const expenceId = req.params.id;
  const userId = req.user.id;
  console.log(expenceId,userId)
  
  try {
    // Get expense and user details
    const expense = await Expence.findById(expenceId, 'expenceAmount');
    const expenceAmount = expense.expenceAmount;
    const user = await User.findById(userId, 'totalExpence');
    const totalExpence = user.totalExpence;
    const newTotalExpence = parseInt(totalExpence - expenceAmount);
    console.log(typeof(newTotalExpence))

    // Delete expense and update user
    await Expence.deleteOne({ _id: expenceId });
    await User.updateOne({ _id: userId }, { totalExpence: newTotalExpence });

    res.status(200).json(`Expense ID ${expenceId} successfully deleted`);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
}

// Get paginated expenses
exports.getPaginatedExpence = async (req, res, next) => {
  const id = req.user.id;
  const page = req.query.page;
  const pageLimit = parseInt(req.query.limit);

  try {
    const count = await Expence.countDocuments({ userId: id });
    const expenses = await Expence.find({ userId: id })
      .skip(page * pageLimit)
      .limit(pageLimit);

    res.json({ expenses, count });
  } catch (error) {
    res.json(error);
  }
}

// Upload expenses to S3
const uploadToS3 = (data, fileName) => {
  const BUCKET_NAME = process.env.BUCKET_NAME;
  const IAM_USER_KEY = process.env.IAM_USER_KEY;
  const IAM_USER_SECRET_KEY = process.env.IAM_USER_SECRET_KEY;

  const s3 = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET_KEY,
  });
  const params = {
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: data
  };
  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

// Download all expenses and upload to S3
exports.downloadExpences = async (req, res, next) => {
  try {
    const expenses = await Expence.find({ userId: req.user.id });
    const stringifiedExpenses = JSON.stringify(expenses);
    const fileName = `Expenses_${req.user.id}_${new Date().getTime()}`;
    const fileUrl = await uploadToS3(stringifiedExpenses, fileName);

    // Create an expense report in the database
    await ExpenceReport.create({
      expenceUrl: fileUrl.Location,
      userId: req.user.id,
    });

    res.status(200).json({ fileUrl, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false });
  }
}

// Show all reports
exports.showReports = async (req, res) => {
  try {
    const reports = await ExpenceReport.find({ userId: req.user.id });
    res.status(200).json({ success: true, message: "Successfully retrieved files", response: reports });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};
