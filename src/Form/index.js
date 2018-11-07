import React from 'react';
import axios from 'axios';

class Form extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      form: {
        fields: {
          name: {
            value: ''
          },
          meal: {
            value: ''
          },
          roomType: {
            value: ''
          }
        },
        errors: []
      },
      userMessage: '',
      meals: [],
      roomTypes: []
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
          ...this.state.fields,
          name: {
            ...this.state.fields.name,
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

  onPhoneChange = event =>
    this.setState({
      form: {
        ...this.state.form,
        fields: {
          ...this.state.form.fields,
          phone: {
            ...this.state.form.fields.phone,
            value: event.target.value
          }
        }
      }
    });

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

  handleSubmit = () => {};

  render() {
    const {
      userMessage,
      form: {
        fields: {name}
      },
      meals,
      roomTypes
    } = this.state;

    return (
      <form>
        <label>Name</label>
        <input
          type="text"
          value={name.value}
          onChange={this.handleNameChange}
          placeholder="Type your name"
        />

        <label>Email</label>
        <input
          type="email"
          onChange={this.onEmailChange}
          placeholder="Type your email"
        />

        {userMessage && <div>{userMessage}</div>}

        <label>Phone</label>
        <input
          type="text"
          onChange={this.onPhoneChange}
          placeholder="Type your phone"
        />

        <label>Meal</label>
        <select onChange={this.onMealChange}>
          {meals &&
            meals.map(meal => (
              <option key={meal.id} value={meal.id}>
                {meal.name}
              </option>
            ))}
        </select>

        <label>Room Type</label>
        <select onChange={this.onRoomTypeChange}>
          {roomTypes.map(roomType => {
            return (
              <option key={roomType.id} value={roomType.id}>
                {roomType.name}
              </option>
            );
          })}
        </select>

        <button onClick={this.handleSubmit}>Request Booking</button>
      </form>
    );
  }
}

export default Form;
