/* global describe, it, expect, beforeEach, jest */

import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import AutoComplete from '../'

Enzyme.configure({ adapter: new Adapter() })

function noop () {}

describe('AutoComplete', () => {
  let fakeSuggestions
  beforeEach(() => {
    fakeSuggestions = [{
      text: '0.4'
    }, {
      text: '0.5'
    }, {
      text: '0.6'
    }]
  })

  it('renders correctly', () => {
    expect(shallow(
      <AutoComplete onSelect={noop} />
    )).toMatchSnapshot()
  })

  it('only renders the suggestions that have a similarity score greater than or equal to the minimum score passed', () => {
    const params = {
      value: '0.5',
      suggestions: fakeSuggestions,
      suggestionObjectTextProperty: 'text',
      minimumSimilarityScore: 0.5,
      onSelect: noop
    }

    const wrapper = shallow(
      <AutoComplete {...params} />
    )

    wrapper.instance().componentDidMount()
    wrapper.instance().forceUpdate()
    wrapper.update()

    expect(wrapper.find('TouchableHighlight').length).toEqual(2)

    expect(wrapper.find({suggestionText: '0.5'}).length).toEqual(1)
    expect(wrapper.find({suggestionText: '0.6'}).length).toEqual(1)
  })

  it('correctly changes the rendered suggestions when receiving new props', () => {
    let params = {
      value: '0.5',
      suggestions: fakeSuggestions,
      suggestionObjectTextProperty: 'text',
      minimumSimilarityScore: 0.5,
      onSelect: noop
    }

    const wrapper = shallow(
      <AutoComplete {...params} />
    )

    wrapper.instance().componentDidMount()
    wrapper.instance().forceUpdate()
    wrapper.update()

    expect(wrapper.find('TouchableHighlight').length).toEqual(2)

    params.value = '0.6'
    wrapper.setProps(params)

    expect(wrapper.find('TouchableHighlight').length).toEqual(1)
    expect(wrapper.find({suggestionText: '0.6'}).length).toEqual(1)
  })

  it('hides the suggestions and calls the select callback when a suggestion is selected', () => {
    const params = {
      value: '0.5',
      suggestions: fakeSuggestions,
      suggestionObjectTextProperty: 'text',
      onSelect: jest.fn(),
      minimumSimilarityScore: 0.5
    }

    const wrapper = shallow(
      <AutoComplete {...params} />
    )

    wrapper.instance().componentDidMount()
    wrapper.instance().forceUpdate()
    wrapper.update()

    expect(wrapper.find('TouchableHighlight').length).toEqual(2)

    wrapper.find({suggestionText: '0.5'}).simulate('press')

    expect(params.onSelect.mock.calls.length).toEqual(1)
    expect(params.onSelect.mock.calls[0]).toEqual([{
      text: '0.5'
    }])

    wrapper.instance().forceUpdate()
    wrapper.update()

    expect(wrapper.find('TouchableHighlight').length).toEqual(0)
  })

  it('correctly calls the onChangeText callback when the text changes', () => {
    const params = {
      onChangeText: jest.fn(),
      onSelect: noop
    }

    const wrapper = shallow(
      <AutoComplete {...params} />
    )

    wrapper.find('TextInput').simulate('changeText', 'Some Text')

    expect(params.onChangeText.mock.calls.length).toEqual(1)
    expect(params.onChangeText.mock.calls[0]).toEqual(['Some Text'])
  })
})
