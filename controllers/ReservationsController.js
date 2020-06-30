// You need to complete this controller with the required 7 actions

const viewPath = 'reservations';
const Reservation = require('../models/reservation');
const User = require('../models/user');

exports.index = async (req, res) => {
  try {
    const reservations = await Reservation
      .find()
      .populate('user')
      .sort({updatedAt: 'desc'});

    res.render(`${viewPath}/index`, {
      pageTitle: 'Archive',
      reservations: reservations
    });
  } catch (error) {
    req.flash('danger', `We are having an error displaying the results: ${error}`);
    res.redirect('/');
  }
};

exports.show = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
    .populate('user');
    res.render(`${viewPath}/show`, {
      pageTitle: reservation.restaurant,
       reservation: reservation
    });
  } catch (error) {
    req.flash('danger', `There was an error showing your reservation: ${error}`);
    res.redirect('/');
  }
};

exports.new = (req, res) => {
  res.render(`${viewPath}/new`, {
    pageTitle: 'New Reservation'
  });
};

exports.create = async (req, res) => {
  try {
    const { user: email } = req.session.passport;
    const user = await User.findOne({email: email});
    const reservation = await Reservation.create({user: user._id, ...req.body});
    req.flash('success', 'Your reservation was successfully created');
    res.redirect(`/reservations/${reservation.id}`);
  } catch (error) {
    req.flash('danger', `There was ERROR in your booking your reservation: ${error}`);
    req.session.formData = req.body;
    res.redirect('/reservations/new');
  }
};

exports.edit = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    res.render(`${viewPath}/edit`, {
      pageTitle: reservation.restaurant,
      formData: reservation
    });
  } catch (error) {
    req.flash('danger', `There booking your restaurant: ${error}`);
    res.redirect('/');
  }
};

exports.update = async (req, res) => {
  try {
    const { user: email } = req.session.passport;
    const user = await User.findOne({email: email});

    let reservation = await Reservation.findById(req.body.id);
    if (!reservation) throw new Error('Your reservation could not be found');

    const attributes = {user: user._id, ...req.body};
    await Reservation.validate(attributes);
    await Reservation.findByIdAndUpdate(attributes.id, attributes);

    req.flash('success', 'Your reservation was successfully updated');
    res.redirect(`/reservations/${req.body.id}`);
  } catch (error) {
    req.flash('danger', `There was an error updating your reservation: ${error}`);
    res.redirect(`/reservations/${req.body.id}/edit`);
  }
};

exports.delete = async (req, res) => {
  try {
    await Reservation.deleteOne({_id: req.body.id});
    req.flash('success', 'Your reservation was sucessfully deleted');
    res.redirect(`/reservations`);
  } catch (error) {
    req.flash('danger', `There was an error deleting your reservation: ${error}`);
    res.redirect(`/reservations`);
  }
};