import React from 'react';
import {shallow} from 'enzyme';
import App from './App';


describe('render tests', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<App/>)
    expect(wrapper).toMatchSnapshot()
   });
  
  it('renders input form', () => {
    const wrapper = shallow(<App/>)
    expect(wrapper.exists('#GBPform')).toEqual(true)
  });
});


describe('input state changes', () => {

  it('currency states are empty on launch', () => {
    const wrapper = shallow(<App/>)
    expect(wrapper.state('GBP')).toEqual('')
    expect(wrapper.state('EUR')).toEqual('')
    expect(wrapper.state('USD')).toEqual('')
  });

  it('user input changes GBP state', () => {
    const wrapper = shallow(<App/>)
    const GBPinput = wrapper.find('#GBPinput')
    const form = wrapper.find('#GBPform')

    GBPinput.simulate('change', { target: { value: 14}})
    form.simulate('submit', { preventDefault () {} })
    expect(wrapper.state('GBP')).toBe(14)
  });
});

describe('fetchRates', () => {
  let mockEvent
  let mockResponse
  let mockfetchRates
  let wrapper
  
  beforeEach( () =>{
    mockEvent = { preventDefault: jest.fn() }
    mockResponse = {USD: 18.00, EUR: 17.00};
    mockfetchRates = jest.fn();
    wrapper = shallow(<App fetchRates={mockfetchRates} />)
  })

  it('successful fetch changes state accordingly', done => {
    window.fetch = jest.fn().mockImplementation(() => Promise.resolve({
      json: () => Promise.resolve(mockResponse)
    }))  
    wrapper.instance().fetchRates(mockEvent)
    .then(() => {
      expect(wrapper.state('hasConverted')).toBeTruthy()
      expect(wrapper.state('hasError')).toBeFalsy()
      done()
    });
  });

  it('unsuccessful fetch changes state accordingly', done => {
    window.fetch = jest.fn().mockImplementationOnce(() => Promise.reject(
      new Error('Fetch failed')
    ))
  
    wrapper.instance().fetchRates(mockEvent)
    .then(() => {
      expect(wrapper.state('hasConverted')).toBeFalsy()
      expect(wrapper.state('hasError')).toBeTruthy()
      done()
    });
  })

  it('fetch changes USD/EUR state', done => {
    window.fetch = jest.fn().mockImplementation(() => Promise.resolve({
      json: () => Promise.resolve(mockResponse)
    })) 

    wrapper.instance().fetchRates(mockEvent)
    .then(() => {
      expect(wrapper.state('USD')).toBe('18.00')
      expect(wrapper.state('EUR')).toBe('17.00')
      done()
    })
  });
});
    


