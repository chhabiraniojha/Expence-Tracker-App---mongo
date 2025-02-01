const Expence = require('../models/Expence')
const User = require('../models/User')
const ExpenceReport=require('../models/ExpenceReport')
const sequelize = require('../util/database')
const AWS = require('aws-sdk')

exports.addExpence = async (req, res, next) => {
  const { expenceAmount, expenceDescription, expenceCategory } = req.body;
  const userId = req.user.id;
  const t = await sequelize.transaction();
  const prevExpence = Number(req.user.totalExpence)
  const newExpence = prevExpence + Number(expenceAmount);

  try {
    await Expence.create({ expenceAmount, expenceDescription, expenceCategory, userId }, { transaction: t })
    await User.update({ totalExpence: newExpence }, {
      where: {
        id: userId
      },
      transaction: t

    });
    await t.commit();
    res.status(200).json("expence added")
  } catch (error) {
    await t.rollback();
    res.json(error)
  }

}

exports.getExpence = async (req, res, next) => {

  try {
    const expences = await Expence.findAll({
      where: {
        userId: req.user.id
      }
    })
    return res.json(expences)
  } catch (error) {
    return res.json(error)
  }
}

exports.deleteExpence = async (req, res, next) => {
  const expenceId = req.params.id;
  const userId = req.user.id;
  const t = await sequelize.transaction();
  try {
    const expence = await Expence.findByPk(expenceId, {
      attributes: ['expenceAmount']
    })
    const expenceAmount = Number(expence.expenceAmount)
    const user = await User.findByPk(userId, {
      attributes: ['totalExpence']
    })
    const totalExpence = Number(user.totalExpence);
    const newTotalExpence = totalExpence - expenceAmount;
    console.log(newTotalExpence)

    await Expence.destroy({
      where: {
        id: expenceId
      },
      transaction: t
    });
    await User.update({ totalExpence: newTotalExpence }, {
      where: {
        id: userId
      },
      transaction: t

    });
    await t.commit()
    res.status(200).json(`id ${expenceId} successfully deleted`)
  } catch (error) {
    await t.rollback()
    console.log(error)
  }
}

exports.getPaginatedExpence = async (req, res, next) => {
  const id = req.user.id;
  const page = req.query.page;
  const pageLimit = parseInt(req.query.limit);
  const count = await Expence.count({
    where: {
      userId: id
    }
  });
  const expence = await Expence.findAll({
    where: {
      userId: id
    },
    offset: (page) * pageLimit,
    limit: pageLimit

  })
  res.json({ expence, count })
}


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
exports.downloadExpences = async (req, res, next) => {
  try {
    const expences = await Expence.findAll({
      where: {
        userId: req.user.id
      }
    })
    const stringifiedExpences = JSON.stringify(expences)
    const fileName = `Expenses_${req.user.id}_${new Date().getTime()}`;
    const fileUrl = await uploadToS3(stringifiedExpences, fileName);
    await ExpenceReport.create({
			expenceUrl: fileUrl.Location,
			userId: req.user.id,
		});

    res.status(200).json({ fileUrl, success: true });

  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false });

  }
  
}


exports.showReports = async (req, res) => {
	try {
		const reports = await ExpenceReport.findAll({
      where:{
          userId:req.user.id
    }});
		res.status(200).json({ success: true, message: "Successfully retrieved files", response: reports });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false });
	}
};