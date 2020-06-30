// You need to define the schema for a reservation
// The fields you require are:
// associated user
// quantity of guests
// restaurant name
// date and time of reservation (you can do these as separate fields if you wish) 

const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
    user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
   }, 
   
   restaurant: {
    type: String,
    required: true
  },

   dateAndTime: {
    type: String,
    required: true
   },
  
   quantityOfGuests: {
    type: String,
    required: true
   },
   status: {
    type: String,
    enum: ['DRAFT', 'PUBLISHED'],
    default: 'DRAFT'
  }}, {
    timestamps: true

});

ReservationSchema.query.drafts = function () {
    return this.where({
      status: 'DRAFT'
    })
  };
  
  
  ReservationSchema.query.published = function () {
    return this.where({
      status: 'PUBLISHED'
    })
  };
  
  ReservationSchema.virtual('synopsis')
  .get(function () {
    const post = this.content;
    return post
      .replace(/(<([^>]+)>)/ig,"")
      .substring(0, 250);
  });
  
  module.exports = mongoose.model('Reservation', ReservationSchema);



