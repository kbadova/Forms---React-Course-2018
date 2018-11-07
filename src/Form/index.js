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
          },
          notes: {
            value: ''
          },
          guests: {
            value: ''
          },
          phone: {
            value: ''
          },
          email: {
            value: ''
          },
          start: {
            value: ''
          },
          end: {
            value: ''
          }
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

  handleNotesChange = event => {
    const notesValue = event.target.value;

    this.setState({
      form: {
        ...this.state.form,
        fields: {
          ...this.state.form.fields,
          notes: {
            ...this.state.form.fields.notes,
            value: notesValue
          }
        }
      }
    });
  };

  onGuestsChange = event => {
    const guestsValue = event.target.value;
    const {form} = this.state;

    this.setState({
      form: {
        ...form,
        fields: {
          ...form.fields,
          guests: {
            ...form.fields.guests,
            value: guestsValue
          }
        }
      }
    });
  };

  handleErrors = errors => {
    // field errors
    const reponseData = errors.response.data;

    console.log(reponseData);
  };

  handleSubmit = () => {
    const {
      form: {
        fields: {name, meal, email, phone, roomType, notes, guests, start, end}
      }
    } = this.state;

    const data = {
      name: name.value,
      email: email.value,
      phone: phone.value,
      meal: meal.value,
      roomType: roomType.value,
      notes: notes.value,
      numberOfPeople: guests.value,
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
    const {form} = this.state;

    this.setState({
      form: {
        ...form,
        fields: {
          ...form.fields,
          start: {
            ...form.fields.start,
            value: start
          }
        }
      }
    });
  };

  handleEndChange = event => {
    const end = event.target.value;
    const {form} = this.state;

    this.setState({
      form: {
        ...form,
        fields: {
          ...form.fields,
          end: {
            ...form.fields.end,
            value: end
          }
        }
      }
    });
  };

  render() {
    const {
      userMessage,
      form: {
        fields: {name, notes, guests, phone, email, start, end}
      },
      meals,
      roomTypes,
      successMessage
    } = this.state;

    return (
      <React.Fragment>
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
            value={email.value}
            onChange={this.onEmailChange}
            placeholder="Type your email"
          />

          <label>Start</label>
          <input
            type="date"
            value={start.value}
            onChange={this.handleStartChange}
          />

          <label>End</label>
          <input
            type="date"
            value={end.value}
            onChange={this.handleEndChange}
          />

          {userMessage && <div>{userMessage}</div>}
          <label>Phone</label>
          <input
            type="text"
            value={phone.value}
            onChange={this.onPhoneChange}
            placeholder="Type your phone"
          />

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

          <label>Meal</label>
          {meals.map(meal => (
            <React.Fragment key={meal.id}>
              <label>{meal.name}</label>
              <input
                key={meal.id}
                type="radio"
                value={meal.id}
                name="radio"
                onChange={this.onMealChange}
              />
            </React.Fragment>
          ))}

          <label>Guests</label>
          <input
            type="number"
            value={guests.value}
            onChange={this.onGuestsChange}
          />

          <label>Notes</label>
          <textarea
            placeholder="White you notes here..."
            onChange={this.handleNotesChange}
            value={notes.value}
          />
          <button onClick={this.handleSubmit} type="button">
            Request Booking
          </button>
        </form>

        {successMessage && <div>{successMessage}</div>}
      </React.Fragment>
    );
  }
}

export default Form;
