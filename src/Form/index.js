import _ from 'lodash';

import React from 'react';
import axios from 'axios';

import {InputField, RadioField, SelectField} from '../Fields';

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
      successMessage: ''
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

  fetchRoomTypes = () => {
    const url = 'http://localhost:8000/booking/room-types/';

    axios
      .get(url)
      .then(response => {
        this.setState({roomTypes: response.data});
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

  handleNameChange = event => {
    this.setState({
      form: {
        ...this.state.form,
        fields: {
          ...this.state.form.fields,
          name: {
            ...this.state.form.fields.name,
            value: event.target.value
          }
        }
      }
    });
  };

  onEmailChange = event => {
    const emailValue = event.target.value;

    const url = `http://localhost:8000/booking/email-exist/`;
    const payload = {
      email: emailValue
    };

    this.post({url, payload})
      .then(response => {
        const message = response.data.message;

        this.setState({userMessage: message});
      })
      .catch(errors => {
        const error = errors[0];

        this.setState({
          form: {
            ...this.state.form,
            errors: error
          }
        });
      });
  };

  // onEmailChange = event => {
  //   const emailValue = event.target.value;
  //   const {form} = this.state;

  //   this.setState({
  //     form: {
  //       ...form,
  //       fields: {
  //         ...form.fields,
  //         email: {
  //           ...form.fields.email,
  //           value: emailValue
  //         }
  //       }
  //     }
  //   });
  // };

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

    const {form} = this.state;

    this.setState({
      form: {
        ...form,
        fields: {
          ...form.fields,
          roomType: {
            ...form.fields.roomType,
            value: roomTypeId
          }
        }
      }
    });
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
      // let newFields = {};
      // _.mapKeys(responseData, (error, key) => {
      //   newFields[key] = {
      //     ...fields[key],
      //     errors: error
      //   };
      // });

      // this.setState({
      //   form: {
      //     ...this.state.form,
      //     fields: {
      //       ...this.state.form.fields,
      //       ...newFields
      //     }
      //   }
      // });
    }
  };

  handleSubmit = () => {
    const {
      form: {
        fields: {name, meal, email, roomType, start, end}
      }
    } = this.state;

    const data = {
      name: name.value,
      email: email.value,
      meal: meal.value,
      roomType: roomType.value,
      start: start.value,
      end: end.value
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
    const newState = _.cloneDeep(this.state);
    const stateWithChangedField = _.set(newState, path, value);

    this.setState(stateWithChangedField);
  };

  getFieldValue = path => _.get(this.state, path);

  setFieldErrors = responseData => {
    let form = _.cloneDeep(this.state.form);
    _.forEach(responseData, (value, key) => {
      _.set(form, `fields.${key}.errors`, value);
    });

    this.setState({form});
  };

  render() {
    const {
      userMessage,
      form: {
        fields: {name, email, start, end, roomType, meal},
        errors
      },
      meals,
      roomTypes,
      successMessage
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

          <RadioField
            label="Meal"
            options={meals}
            onChange={this.onMealChange}
            errors={meal.errors}
          />

          <button onClick={this.handleSubmit} type="button">
            Request Booking
          </button>

          <button onClick={this.handleClear} type="button">
            Clear
          </button>
        </form>

        {successMessage && <div>{successMessage}</div>}
      </React.Fragment>
    );
  }
}

export default Form;
