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
            value: {
              id: '',
              name: ''
            }
          }
        },
        errors: []
      },
      userMessage: ''
    };
  }

  post = ({url, payload}) => axios.post(url, payload);

  handleNameChange = event => {
    this.setState({name: event.target.value});
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
            value: event.target.value
          }
        }
      }
    });

  onMealChange = event => {
    const mealId = event.target.value;

    const {meals, form} = this.state;

    const mealOption = meals.filter(meal => meal.id === mealId);

    this.setState({
      form: {
        ...form,
        fields: {
          ...form.fields,
          meal: {
            ...form.fields.meal,
            value: mealOption[0]
          }
        }
      }
    });
  };

  handleSubmit = () => {};

  render() {
    const {
      name,
      email,
      userMessage,
      form: {
        fields: {meal, roomType}
      },
      meals
    } = this.state;

    return (
      <form>
        <label>Name</label>
        <input
          type="text"
          value={name}
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
            meals.map(meal => <option value={meal.id}>{meal.name}</option>)}
        </select>

        <label>Room Type</label>
        <select onChange={this.onRoomTypeChange}>
          <option value={roomType.id}>{roomType.name}</option>
        </select>

        <button onClick={this.handleSubmit}>Request Booking</button>
      </form>
    );
  }
}

export default Form;
