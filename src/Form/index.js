import React from 'react';

class Form extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: ''
    };
  }

  handleNameChange = event => {
    this.setState({name: event.target.value});
  };

  onEmailChange = event => {
    const emailValue = event.target.value;
    console.log(emailValue);
  };

  handleSubmit = () => {};

  render() {
    const {name, email} = this.state;

    console.log(name);
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

        <button onClick={this.handleSubmit}>Request Booking</button>
      </form>
    );
  }
}

export default Form;
