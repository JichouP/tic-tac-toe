import React from 'react';
import renderer from 'react-test-renderer';
import { cleanup, fireEvent, render } from '@testing-library/react';
import App from '@/App';

describe('Unit test', () => {
  it('should have div element.', () => {});
});

describe('Integration test', () => {
  afterEach(cleanup);
  test('The element with an innerText of "Hello World" should cause nothing to happen when it is clicked.', () => {
    const { getByText } = render(<App></App>);
    expect(getByText('Hello World')).toBeTruthy();
    fireEvent.click(getByText('Hello World'));
    expect(getByText('Hello World')).toBeTruthy();
  });
});

describe('Snapshot test', () => {
  it('should match snapshot', () => {
    const tree = renderer.create(<App></App>);
    expect(tree).toMatchSnapshot();
  });
});
