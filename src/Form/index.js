import _ from 'lodash';

import React from 'react';
import axios from 'axios';

import {InputField, SelectField} from '../Fields';

import './styles.css';

class Form extends React.Component {
  constructor(props) {
    super(props);

    const initialFields = {
      name: {
        value: '',
        errors: []
      },
      email: {
        value: '',
        errors: []
      },
      meal: {
        value: '',
        errors: []
      },
      start: {
        value: '',
        errors: []
      },
      end: {
        value: '',
        errors: []
      },
      roomType: {
        value: '',
        errors: []
      },
      phone: {
        value: '',
        errors: []
      },
      room: {
        value: '',
        errors: []
      }
    };

    this.state = {
      initialFields,
      form: {
        fields: {
          ...initialFields
        },
        errors: []
      },
      userMessage: '',
      meals: [],
      roomTypes: [],
      successMessage: '',
      rooms: [],
      number: 0
    };
  }

  componentDidMount() {
    this.fetchMeals();
    this.fetchRoomTypes();
  }

  fetchMeals = () => {
    const url = 'http://localhost:8000/booking/meals/';
    axios
      .get(url)
      .then(response => {
        this.setState({meals: response.data});
      })
      .catch(errors =>
        this.setState({
          form: {
            ...this.state.form,
            errors
          }
        })
      );
  };

  fetchAvailableRooms = roomType => {
    const url = `http://localhost:8000/booking/available-rooms/${roomType}/`;
    axios.get(url).then(response => {
      this.setState({rooms: response.data});
    });
  };

  fetchRoomTypes = () => {
    const url = 'http://localhost:8000/booking/room-types/';

    axios
      .get(url)
      .then(response => {
        this.setState({roomTypes: response.data});

        this.fetchAvailableRooms(response.data[0].id);
      })
      .catch(errors => {
        this.setState({
          form: {
            ...this.state.form,
            errors
          }
        });
      });
  };

  post = ({url, payload}) => axios.post(url, payload);

  checkEmailExistsPerName = () => {
    const name = this.getFieldValue('form.fields.name.value');
    axios
      .post('http://localhost:8000/booking/email-exist-per-name/', {name})
      .then(response => {
        const users = response.data;
        if (!_.isEmpty(users)) {
          const user = users[0];
          this.updateState('form.fields.email.value', user.email);
        } else {
          this.updateState('form.fields.email.value', '');
        }
      });
  };

  handleNameChange = (name, errors) => {
    this.updateState('form.fields.name', {value: name, errors: errors});

    this.updateState('form.fields.name', {value: name, errors: []});

    _.debounce(this.checkEmailExistsPerName, 500)();
    this.checkEmailExistsPerName(name);
  };

  // onEmailChange = event => {
  //   const emailValue = event.target.value;

  //   const url = `http://localhost:8000/booking/email-exist/`;
  //   const payload = {
  //     email: emailValue
  //   };

  //   this.post({url, payload})
  //     .then(response => {
  //       const message = response.data.message;

  //       this.setState({userMessage: message});
  //     })
  //     .catch(errors => {
  //       const error = errors[0];

  //       this.setState({
  //         form: {
  //           ...this.state.form,
  //           errors: error
  //         }
  //       });
  //     });
  // };

  onEmailChange = event => {
    const emailValue = event.target.value;
    const {form} = this.state;

    this.setState({
      form: {
        ...form,
        fields: {
          ...form.fields,
          email: {
            ...form.fields.email,
            value: emailValue
          }
        }
      }
    });
  };

  onMealChange = event => {
    const mealId = event.target.value;
    const {form} = this.state;

    this.setState({
      form: {
        ...form,
        fields: {
          ...form.fields,
          meal: {
            ...form.fields.meal,
            value: mealId
          }
        }
      }
    });
  };

  onRoomTypeChange = event => {
    const roomTypeId = event.target.value;

    this.updateState('form.fields.roomType.value', roomTypeId);

    if (roomTypeId === '3') {
      this.updateState('form.fields.meal.value', 3);
    }

    this.fetchAvailableRooms(roomTypeId);
  };

  handleErrors = errors => {
    const responseData = errors.response.data;

    if (_.isArray(responseData)) {
      this.setState({
        form: {
          ...this.state.form,
          errors: responseData
        }
      });
    } else {
      this.setFieldErrors(responseData);
    }
  };

  handleSubmit = () => {
    const {
      form: {
        fields: {name, meal, email, roomType, start, end, phone, room}
      }
    } = this.state;

    const data = {
      name: name.value,
      email: email.value,
      meal: meal.value,
      roomType: roomType.value,
      start: start.value,
      end: end.value,
      phone: phone.value,
      room: room.value
    };

    const url = 'http://localhost:8000/booking/booking-request/';
    axios
      .post(url, data)
      .then(response => {
        this.setState({successMessage: 'Booking request sent!'});
      })
      .catch(errors => {
        this.handleErrors(errors);
      });
  };

  handleStartChange = event => {
    const start = event.target.value;

    this.updateState('form.fields.start.value', start);
  };

  handleEndChange = event => {
    const end = event.target.value;

    this.updateState('form.fields.end.value', end);
  };

  handleClear = () => {
    this.setState({
      form: {
        ...this.state.form,
        fields: this.state.initialFields
      }
    });
  };

  updateState = (path, value) => {
    this.setState(state => {
      // const newState = _.cloneDeep(state);
      // let stateWithChangedField = _.set(newState, path, value);

      console.log(state);
      let stateWithChangedField = _.set(state, path, value);

      if (state.form.fields.name.value === '') {
        stateWithChangedField = {
          ...stateWithChangedField,
          form: {
            ...stateWithChangedField.form,
            fields: {
              ...stateWithChangedField.form.fields,
              name: {
                ...stateWithChangedField.form.fields.name
              }
            }
          }
        };
      }

      return stateWithChangedField;
    });
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.form.fields.name.value !== this.state.form.fields.name.value
    ) {
      console.log('Component updated');
    }
  }

  getFieldValue = path => _.get(this.state, path);

  setFieldErrors = responseData => {
    this.setState(state => {
      let form = _.cloneDeep(this.state.form);
      _.forEach(responseData, (value, key) => {
        _.set(form, `fields.${key}.errors`, value);
      });

      return {form};
    });
  };

  checkPhoneNumberIsTaken = phone => {
    const url = 'http://localhost:8000/booking/check-phone/';
    axios
      .post(url, {phone})
      .then(() => {
        this.updateState('form.fields.phone.errors', []);
      })
      .catch(errors => {
        this.updateState('form.fields.phone.errors', errors.response.data);
      });
  };

  handlePhoneChange = event => {
    this.updateState('form.fields.phone.value', event.target.value);

    this.checkPhoneNumberIsTaken(event.target.value);
  };

  validatePhone = value => {
    const regex = /^\d{3}-\d{3}-\d{4}$/;

    return {
      valid: value.match(regex),
      message: 'Enter a valid number'
    };
  };

  updateSyncErrors = (fieldName, errorMsg) => {
    console.log(fieldName, errorMsg);
    this.updateState(`form.fields.${fieldName}.errors`, errorMsg);
  };

  updateMeal = roomTypeValue => {
    const {form} = this.state;
    if (roomTypeValue === '3') {
      this.setState({
        form: {
          ...form
        }
      });
    }
  };

  onMealChange = event => {
    this.updateState('form.fields.meal.value', event.target.value);
  };

  onRoomChange = event => {
    this.updateState('form.fields.room.value', event.target.value);
  };

  validateName = name => {
    return {
      valid: name.length > 20,
      message: 'Name cannot be more than 20 characters'
    };
  };

  render() {
    const {
      userMessage,
      form: {
        fields: {name, email, start, end, roomType, meal, phone, room},
        errors
      },
      rooms,
      meals,
      roomTypes,
      successMessage,
      number
    } = this.state;

    return (
      <React.Fragment>
        <form className="BookingRequestForm">
          {!_.isEmpty(errors) && errors.map(error => <div>{error}</div>)}
          <div className="nameAndEmail">
            <InputField
              type="text"
              label="Name"
              value={name.value}
              onChange={this.handleNameChange}
              errors={name.errors}
            />

            <InputField
              type="email"
              label="Email"
              value={email.value}
              onChange={this.onEmailChange}
              errors={email.errors}
            />
          </div>
          <div className="dates">
            <InputField
              type="date"
              label="Start"
              value={start.value}
              onChange={this.handleStartChange}
              errors={start.errors}
            />

            <InputField
              type="date"
              label="End"
              value={end.value}
              onChange={this.handleEndChange}
              errors={end.errors}
            />
          </div>
          {userMessage && <div>{userMessage}</div>}
          <SelectField
            label="Room Type"
            options={roomTypes}
            onChange={this.onRoomTypeChange}
            errors={roomType.errors}
          />
          <SelectField
            label="Meals"
            value={meal.value}
            options={meals}
            onChange={this.onMealChange}
            errors={meal.errors}
          />
          <SelectField
            label="Rooms"
            value={room.value}
            options={rooms}
            onChange={this.onRoomChange}
            errors={room.errors}
          />
          <InputField
            type="text"
            label="Phone number"
            name="phone"
            value={phone.value}
            onChange={this.handlePhoneChange}
            errors={phone.errors}
            validators={[this.validatePhone]}
            updateSyncErrors={this.updateSyncErrors}
          />
          <button
            className="formButton"
            onClick={this.handleSubmit}
            type="button">
            Request Booking
          </button>
          <button
            className="formButton"
            onClick={this.handleClear}
            type="button">
            Clear
          </button>
        </form>
        {successMessage && <div>{successMessage}</div>}
      </React.Fragment>
    );
  }
}

export default Form;
