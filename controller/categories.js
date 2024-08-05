const cloudinary = require('../middleware/cloudinary.js')
const categoryModel = require("../models/categories");
const fs = require("fs");

class Category {
  async getAllCategory(req, res) {
    try {
      let Categories = await categoryModel.find({}).sort({ _id: -1 });
      if (Categories) {
        return res.status(200).json({
          success: true,
          message: "Category Fetched Successfully",
          data: Categories
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

    async getProductCategory(req, res) {
    try {
      let Categories = await categoryModel.find({categoryName:req.body.categoryName}).sort({ _id: -1 });
      if (Categories) {
        return res.status(200).json({
          success: true,
          message: "Category Fetched Successfully",
          data: Categories
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

async postAddCategory(req, res) {
      const formImage = req.files.image;
      console.log(formImage);
      const imagePath = formImage.tempFilePath;

    // Validation
  if (formImage) {  
           
    try {

      const categoryImageURL = await cloudinary.upload_image(imagePath,"categories");
      console.log(categoryImageURL);
      const {categoryName,categoryDescription,categoryStatus} = req.body;
      console.log(categoryName,categoryDescription,categoryStatus);

    //   if (
    //   !categoryName |
    //   !categoryDescription |
    //   !categoryStatus
    // ) {
    //     return res.status(400).json({
    //       success: false,
    //       message: "Field can't be empty",
    //     });
    //   }

      const exist = await categoryModel.findOne({ categoryName });
      if (exist) {
        return res.status(400).json({
          success: false,
          message: "Category name already exist",
        });
      }

      const category = await categoryModel.create({
        categoryImageURL: categoryImageURL,
        categoryName,
        categoryDescription,
        categoryStatus
        
      });
      res.status(200).json({
        success: true,
        message: "Categoty created successfully!",
        data: category,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  } else {
    return res.status(500).json({
      success: false,
      message: "Category Image is required",
    });
  }
}
  async postEditCategory(req, res) {
    let {categoryName, categoryDescription, categoryStatus } = req.body;
    if (!categoryName || !categoryDescription || !categoryStatus) {
      return res.json({ error: "All filled must be required" });
    }
    try {
      let editCategory = categoryModel.findByIdAndUpdate(categoryName, {
        categoryDescription: categoryDescription,
        categoryStatus: categoryStatus,
      });
      let edit = await editCategory.exec();
      if (edit) {
        return res.json({ success: "Category edit successfully" });
      }
    } catch (err) {
      console.log(err);
    }
  }

  async getDeleteCategory(req, res) {
    let { cId } = req.body;
    if (!cId) {
      return res.json({ error: "All filled must be required" });
    } else {
      try {
        let deletedCategoryFile = await categoryModel.findById(cId);
        const filePath = `../server/public/uploads/categories/${deletedCategoryFile.categoryImageURL}`;

        let deleteCategory = await categoryModel.findByIdAndDelete(cId);
        if (deleteCategory) {
          // Delete Image from uploads -> categories folder 
          fs.unlink(filePath, (err) => {
            if (err) {
              console.log(err);
            }
            return res.json({ success: "Category deleted successfully" });
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
  } 
}

const categoryController = new Category();
module.exports = categoryController;
