import React, { Component } from 'react';
import './App.css'

export class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      GBP: '',
      USD: '',
      EUR: '',
      hasConverted: false,
      hasError: false
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.fetchRates = this.fetchRates.bind(this)
    this.handleDisplay = this.handleDisplay.bind(this)
  }

  handleSubmit(e){
    this.fetchRates();
    e.preventDefault()
  }

  handleChange(e){
    this.setState({GBP: e.target.value})
  }

  async fetchRates(){
    let obj = {amount: this.state.GBP}
    const proxyurl = "https://cors-anywhere.herokuapp.com/";

    try {
      let res = await fetch(proxyurl + 'https://us-central1-ornate-apricot-220209.cloudfunctions.net/CodingTestFrontEnd-API?',
        {
          method: 'POST', 
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(obj)
        })

      let data = await res.json()

      this.setState({
        USD: data.USD.toFixed(2),
        EUR: data.EUR.toFixed(2),
        hasConverted: true
      })

    } catch(err) {
      console.log(err)
      this.setState({
        hasConverted: false,
        hasError: true
      })
    }
  }

  handleDisplay(){
    return(
      <div>
        Your Money Will Buy You: 
      <br/>
        {
          this.state.USD > this.state.EUR ? 
            <div> USD {this.state.USD} <br/> EUR {this.state.EUR} <br/>That's {(this.state.USD - this.state.EUR).toFixed(2)} more USD than EUR!</div>  : 
            <div> EUR {this.state.EUR} <br/> USD {this.state.USD} <br/>That's {(this.state.EUR - this.state.USD).toFixed(2)} more EUR than USD!</div>
        } 
      </div>
    )    
  }

  render() {
    console.log(this.state.USD)
    return (
      <div className='App'>

        <div className='leftSide'>
          <form id='GBPform' onSubmit={this.handleSubmit}>
            Enter GBP Amount: 
            <br/>
            <input id='GBPinput' type='number' min='0' step='0.01' value={this.state.GBP} onChange={this.handleChange}></input>
            <br/>
            <input id='GBPsubmit' type='submit' value='Convert'></input>
          </form>
        </div>

        <div className='rightSide'>
          {this.state.hasConverted ? this.handleDisplay() : 
            (this.state.hasError ? "There's Been A Problem. Refresh And Try Again In A Few Minutes" : '')}
        </div>

      </div>
    )
  }
}

export default App
