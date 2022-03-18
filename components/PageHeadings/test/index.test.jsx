import React from 'react';
import { shallow } from 'enzyme';
import PageHeadings from '../src/index';
import '../src/main.scss';

it('renders', () => {
  const wrapper = shallow(<PageHeadings />);
  expect(wrapper.find('.PageHeadings').length).toBe(1);
});
