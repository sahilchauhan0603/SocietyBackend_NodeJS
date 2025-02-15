const { where } = require("sequelize");
let db = require("../models");

const testimonials = db.Testimonials;

//ADD NEW TESTIMONIAL
let AddNewTestimonial = async (
    EnrollmentNo,
    TestimonialDescription,
) => {
  try {
    let data = await testimonials.create({
        EnrollmentNo,
        TestimonialDescription,
    });
    return data;
  } catch (e) {
    return e;
  }
};


//UPDATE TESTIMONIAL
let UpdateTestimonial = async (EnrollmentNo,TestimonialDescription) => {
  try {
    let [data] = await testimonials.update(
      { 
        TestimonialDescription,
      },
      {
        where: {
          EnrollmentNo,
        }
      }
    );

    // Check if any rows were updated
    if (data) {
      // Fetch and return the updated testimonial
      const updatedTestimonial = await testimonials.findOne({ where: { EnrollmentNo } });
      return updatedTestimonial;
    }

    // If no rows were updated, throw an error
    throw new Error('Testimonial not found');
  } catch (e) {
    return e;
  }
};


//GET ALL THE TESTIMONIAL
let FetchAllTestimonials = async () => {
  try {
    let data = await testimonials.findAll({
      order: [
        ["EnrollmentNo", "ASC"], 
      ],
      attributes: ['TestimonialDescription'],
      include: [{
        model: StudentProfile,
        as: 'studentprofiles',
        attributes: ['FirstName','LastName','Branch','BatchYear'],
      }]
    });

    return data;
  } catch (e) {
    return;
  }
};

//GET TESTIMONIAL BY ID
let FetchTestimonialID = async (EnrollmentNo) => {
  if (!EnrollmentNo) {
    throw new Error("EnrollmentNo is required");
  }
  try {
    let student = await testimonials.findOne({
      where: { 
        EnrollmentNo: EnrollmentNo,
      },
      attributes: ['TestimonialDescription'],
      include: [{
        model: StudentProfile,
        as: 'studentprofiles',
        attributes: ['FirstName','LastName','Branch','BatchYear'],
      }]
    });
    console.log(student);
    return student;
  } catch (e) {
    return e;
  }
};


//delete TESTIMONIAL
let RemoveTestimonial = async (EnrollmentNo) => {
  try {

    if (!EnrollmentNo) {
      throw new Error("EnrollmentNo is required");
    }

    let result = await testimonials.destroy({
      where: {
        EnrollmentNo: EnrollmentNo,
      },
    });

    // Check if the item was deleted
    if (result === 0) {
      throw new Error(`Testimonial with student EnrollmentNo ${EnrollmentNo} not found`);
    }

    // Return the result of the deletion operation
    return {
      message: `Testimonial with student EnrollmentNo ${EnrollmentNo} successfully deleted`,
      result: result,
    };
  } catch (e) {
    console.error(`Error removing Testimonial with student EnrollmentNo ${EnrollmentNo}:`, e.message);
    return {
      error: e.message,
    };
  }
};

module.exports = {
  AddNewTestimonial,
  UpdateTestimonial,
  RemoveTestimonial,
  FetchAllTestimonials,
  FetchTestimonialID,
};